import { getClient } from "@lib/sanity";
import { NextApiRequest, NextApiResponse } from "next";
import { mutate } from "swr";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      try {
        const resp = await getClient()
          .patch(req.body.id, { set: { accepted: !req.body.currentValue } })
          .commit()
          .then(() => {
            mutate("/participants_data");
          });
        res.send({ status: 200, body: resp });
      } catch (e) {
        res.send({ status: 500, message: e });
      }
  }
}
