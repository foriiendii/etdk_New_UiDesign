import { getAllParticipants } from "@lib/queries";
import { getClient } from "@lib/sanity";
import { NextApiRequest, NextApiResponse } from "next";
import { summarizeScores, calculateNomination } from "@utils/scoringHelpers";
import { getApiUser, hasRole } from "@lib/adminAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const user = await getApiUser(req);
      if (!user || !hasRole(user, ["superadmin", "data_checker"])) {
        return res.status(403).json({ message: "Forbidden" });
      }
      try {
        const resp = await getClient().fetch(getAllParticipants);
        const participantsWithScoring = resp.map((user: any) => {
          const userScores = user.score || [];
          const summarizedScoresByCriteria = summarizeScores(userScores);
          const { otdk, publish } = calculateNomination(userScores);
          return {
            ...user,
            score:
              Object.values(summarizedScoresByCriteria).reduce(
                (acc, cur) => acc + cur || 0,
                0
              ) / userScores.length || 0,
            otdk_nominated:
              otdk.false === 0 && otdk.true === 0
                ? false
                : otdk.false <= otdk.true,
            publish_nominated:
              publish.false === 0 && publish.true === 0
                ? false
                : publish.false <= publish.true,
          };
        });
        return res.status(200).json({ status: 200, body: participantsWithScoring });
      } catch (e) {
        console.log(e);
        return res.status(500).json({ status: 500, message: e });
      }
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
