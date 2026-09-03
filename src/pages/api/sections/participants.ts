import { queryAllCriteria, sectionParticipants } from "@lib/queries";
import { getClient } from "@lib/sanity";
import { averageScores, calculateNomination } from "@utils/scoringHelpers";
import { NextApiRequest, NextApiResponse } from "next";
import { ParticipantScore, SanityParticipantScoring, UserRoles } from "types";
import { getApiUser, hasRole, hasSectionAccess } from "@lib/adminAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      try {
        const user = await getApiUser(req);
        const sectionId = req.body.id as string;
        if (
          !user ||
          !hasRole(user, ["superadmin", "scorer", "section_closer"]) ||
          !(await hasSectionAccess(user, sectionId))
        ) {
          return res.status(403).json({ status: 403, message: "Forbidden" });
        }
        const resp: SanityParticipantScoring[] = await getClient(true).fetch(
          sectionParticipants(sectionId)
        );
        if (user.role === UserRoles.Scorer) {
          const loggedInUserEmail = user.email;
          const filterUserScores = resp.map((user) => {
            const userScores = user.score;
            const filteredUserScores = userScores?.filter(
              (us) => us.scorer.email === loggedInUserEmail
            );
            return {
              ...user,
              score: filteredUserScores || null,
            };
          });
          return res.status(200).json({ status: 200, body: filterUserScores });
        } else {
          const allCriterias: { name: string; _id: string }[] = await getClient(
            true
          ).fetch(queryAllCriteria);
          const userScoreSum: SanityParticipantScoring[] = resp.map((user) => {
            const userScores = user.score || [];
            const averagedScoresByCriteria = averageScores(userScores);
            const { otdk, publish } = calculateNomination(userScores);
            const calculateScore: ParticipantScore[] = Object.entries(
              averagedScoresByCriteria
            ).map((ssc) => ({
              criteria: {
                name: allCriterias.find((c) => c._id === ssc[0])?.name || "",
                _id: ssc[0],
              },
                score: ssc[1] || 0,
            }));
            return {
              ...user,
              score: [
                {
                  scorer: {
                    email: "",
                    _id: "",
                  },
                  _key: "",
                  score: calculateScore,
                  otdk_nominated:
                    otdk.false === 0 && otdk.true === 0
                      ? false
                      : otdk.false <= otdk.true,
                  publish_nominated:
                    publish.false === 0 && publish.true === 0
                      ? false
                      : publish.false <= publish.true,
                },
              ],
            };
          });
          return res.status(200).json({ status: 200, body: userScoreSum });
        }
      } catch (e) {
        console.log(e);
        return res.status(500).json({ status: 500, message: e });
      }
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
