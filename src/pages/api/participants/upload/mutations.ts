import { getClient } from "@lib/sanity";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      try {
        const resp = await getClient()
          .mutate(req.body)
          .then((response) => response);
        res.status(200).send({ status: 200, body: resp });
      } catch (e) {
        res.status(500).send({ error: "Feltöltés nem sikerült" });
      }
  }
}
