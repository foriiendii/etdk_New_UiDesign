import { checkIfAdmin, getParticipantScore } from "@lib/queries";
import { getClient } from "@lib/sanity";
import { nanoid } from "nanoid";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { mutate } from "swr";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      try {
        const session = await getSession({ req });
        if (!session) {
          res.send({ status: 401, message: "Unauthorized" });
        }
        const adminData = await getClient(true).fetch(
          checkIfAdmin(session!.user.email)
        );
        const participantOtherScores = await getClient(true).fetch(
          getParticipantScore(req.body.id)
        );
        const pOnlyScore = participantOtherScores[0].score;
        const findTheScore = pOnlyScore?.find(
          (p: any) => p.scorer._id === req.body.scorerId
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
                          _ref: req.body.scorerId || adminData[0]._id,
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
                          _ref: req.body.scorerId || adminData[0]._id,
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
        res.send({ status: 200, body: resp });
      } catch (e) {
        console.log(e);
        res.send({ status: 500, message: e });
      }
  }
}
