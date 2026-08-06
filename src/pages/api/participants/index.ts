import { getAllParticipants } from "@lib/queries";
import { getClient } from "@lib/sanity";
import { NextApiRequest, NextApiResponse } from "next";
import { summarizeScores, calculateNomination } from "@utils/scoringHelpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
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
        res.send({ status: 200, body: participantsWithScoring });
      } catch (e) {
        console.log(e);
        res.send({ status: 500, message: e });
      }
  }
}
