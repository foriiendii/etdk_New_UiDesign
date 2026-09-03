import { getClient } from "@lib/sanity";
import { NextApiRequest, NextApiResponse } from "next";
import { mutate } from "swr";
import { getApiUser, hasRole } from "@lib/adminAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      const user = await getApiUser(req);
      if (!user || !hasRole(user, ["superadmin", "data_checker"])) {
        return res.status(403).json({ message: "Forbidden" });
      }
      try {
        const resp = await getClient()
          .patch(req.body.id, { set: { accepted: !req.body.currentValue } })
          .commit()
          .then(() => {
            mutate("/participants_data");
          });
        return res.status(200).json({ status: 200, body: resp });
      } catch (e) {
        return res.status(500).json({ status: 500, message: e });
      }
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
