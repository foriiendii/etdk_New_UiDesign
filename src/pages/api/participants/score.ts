import {
  checkIfAdmin,
  getParticipantScore,
  getParticipantSections,
  getSectionStatus,
} from "@lib/queries";
import { getClient } from "@lib/sanity";
import { nanoid } from "nanoid";
import { NextApiRequest, NextApiResponse } from "next";
import { mutate } from "swr";
import { getApiUser, hasRole, hasSectionAccess } from "@lib/adminAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      try {
        const user = await getApiUser(req);
        if (!user || !hasRole(user, ["superadmin", "scorer"])) {
          return res.status(403).json({ status: 403, message: "Forbidden" });
        }
        const participantSections = await getClient(true).fetch(
          getParticipantSections(req.body.id)
        );
        const sectionAccess = await Promise.all(
          (participantSections?.sections || []).map(
            (sectionId: string | null) =>
              sectionId ? hasSectionAccess(user, sectionId) : false
          )
        );
        const hasAccess = sectionAccess.some(Boolean);
        if (!hasAccess) {
          return res.status(403).json({ status: 403, message: "Forbidden" });
        }
        const sectionStatuses = await Promise.all(
          (participantSections?.sections || []).map(
            (sectionId: string | null) =>
              sectionId ? getClient(true).fetch(getSectionStatus(sectionId)) : null
          )
        );
        if (sectionStatuses.some((section) => section?.closed)) {
          return res.status(409).json({
            status: 409,
            message: "This section is already closed",
          });
        }
        const adminData = await getClient(true).fetch(
          checkIfAdmin(user.email)
        );
        if (!adminData.length) {
          return res.status(403).json({ status: 403, message: "Forbidden" });
        }
        const participantOtherScores = await getClient(true).fetch(
          getParticipantScore(req.body.id)
        );
        const pOnlyScore = participantOtherScores[0].score;
        const findTheScore = pOnlyScore?.find(
          (p: any) => p.scorer._id === adminData[0]._id
        );
        const newScore = Object.keys(req.body.scores).map((s) => ({
          score: req.body.scores[s]?.score || 0,
          criteria: { _type: "reference", _ref: s },
          _key: nanoid(),
        }));
        const indexOfTheScore = pOnlyScore?.indexOf(findTheScore);
        const resp = await getClient()
          .patch(req.body.id, {
            ...(pOnlyScore
              ? {
                  insert: {
                    ...(indexOfTheScore !== -1
                      ? { replace: `score[${indexOfTheScore}]` }
                      : { after: "score[-1]" }),
                    items: [
                      {
                        score: newScore,
                        scorer: {
                          _ref: adminData[0]._id,
                          _type: "reference",
                        },
                        _key: nanoid(),
                        publish_nominated: req.body.publish_nominated,
                        otdk_nominated: req.body.otdk_nominated,
                      },
                    ],
                  },
                }
              : {
                  set: {
                    score: [
                      {
                        score: newScore,
                        scorer: {
                          _ref: adminData[0]._id,
                          _type: "reference",
                        },
                        _key: nanoid(),
                        publish_nominated: req.body.publish_nominated,
                        otdk_nominated: req.body.otdk_nominated,
                      },
                    ],
                  },
                }),
          })
          .commit()
          .then(() => {
            mutate("/section_participants");
          });
        return res.status(200).json({ status: 200, body: resp });
      } catch (e) {
        console.log(e);
        return res.status(500).json({ status: 500, message: e });
      }
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
