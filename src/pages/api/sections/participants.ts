import { queryAllCriteria, sectionParticipants } from "@lib/queries";
import { getClient } from "@lib/sanity";
import { summarizeScores, calculateNomination } from "@utils/scoringHelpers";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { ParticipantScore, SanityParticipantScoring, UserRoles } from "types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      try {
        const resp: SanityParticipantScoring[] = await getClient(true).fetch(
          sectionParticipants(req.body.id)
        );
        const session = await getSession({ req });
        if (!session || session.user.role === "participant") {
          res.send({ status: 401, message: "Unauthorized" });
        }
        if (session!.user.role === UserRoles.Scorer) {
          const loggedInUserEmail = session!.user.email;
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
          res.send({ status: 200, body: filterUserScores });
        } else {
          const allCriterias: { name: string; _id: string }[] = await getClient(
            true
          ).fetch(queryAllCriteria);
          const userScoreSum: SanityParticipantScoring[] = resp.map((user) => {
            const userScores = user.score || [];
            const summarizedScoresByCriteria = summarizeScores(userScores);
            const { otdk, publish } = calculateNomination(userScores);
            const calculateScore: ParticipantScore[] = Object.entries(
              summarizedScoresByCriteria
            ).map((ssc) => ({
              criteria: {
                name: allCriterias.find((c) => c._id === ssc[0])?.name || "",
                _id: ssc[0],
              },
              score: ssc[1] / userScores.length || 0,
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
          res.send({ status: 200, body: userScoreSum });
        }
      } catch (e) {
        console.log(e);
        res.send({ status: 500, message: e });
      }
  }
}
