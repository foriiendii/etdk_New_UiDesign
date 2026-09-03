import { getClient } from "@lib/sanity";
import { NextApiRequest, NextApiResponse } from "next";
import { getApiUser, hasRole, hasSectionAccess } from "@lib/adminAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      const user = await getApiUser(req);
      const sectionId = req.body.id as string;
      if (
        !user ||
        !hasRole(user, ["superadmin", "section_closer"]) ||
        !(await hasSectionAccess(user, sectionId))
      ) {
        return res.status(403).json({ message: "Forbidden" });
      }
      try {
        const resp = await getClient()
          .patch(sectionId, {
            set: {
              closed: true,
            },
          })
          .commit();
        return res.status(200).json({ status: 200, body: resp });
      } catch (e) {
        return res.status(500).json({ status: 500, message: e });
      }
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
