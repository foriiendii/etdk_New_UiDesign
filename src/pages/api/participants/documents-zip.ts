import { getApiUser, hasRole, hasSectionAccess } from "@lib/adminAuth";
import { getParticipantFiles } from "@lib/queries";
import { getClient } from "@lib/sanity";
import JSZip from "jszip";
import { NextApiRequest, NextApiResponse } from "next";

const fileAttributes = ["extract", "annex", "contribution", "essay"] as const;

// Zips a participant's documents server-side and streams the archive back.
// This exists because cdn.sanity.io/files/... doesn't send CORS headers, so
// fetching those PDFs directly from the browser (as the old client-side
// JSZip version did) always fails silently - a server has no such
// restriction, so it fetches each file itself and hands back one .zip.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const user = await getApiUser(req);
  if (!user || !hasRole(user, ["superadmin", "scorer", "section_closer"])) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const participantId = req.body.id as string;
  if (!participantId) {
    return res.status(400).json({ message: "Missing participant id" });
  }

  const participant = await getClient(true).fetch(
    getParticipantFiles(participantId)
  );
  if (!participant) {
    return res.status(404).json({ message: "A jelentkező nem található." });
  }

  const sectionId = participant.merged_section || participant.section;
  if (!sectionId || !(await hasSectionAccess(user, sectionId))) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const zip = new JSZip();
    const folder = zip.folder(participant.name || "dokumentumok");
    let fileCount = 0;

    for (const attribute of fileAttributes) {
      const file = participant[attribute] as
        | { url?: string; originalFilename?: string }
        | null
        | undefined;
      if (!folder || !file?.url) continue;
      const response = await fetch(file.url);
      if (!response.ok) continue;
      const arrayBuffer = await response.arrayBuffer();
      folder.file(file.originalFilename || `${attribute}.pdf`, arrayBuffer);
      fileCount += 1;
    }

    if (fileCount === 0) {
      return res
        .status(404)
        .json({ message: "Ehhez a jelentkezőhöz nincs feltöltött dokumentum." });
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(
        participant.name || "dokumentumok"
      )}.zip"`
    );
    return res.status(200).send(zipBuffer);
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ message: "A dokumentumok letöltése sikertelen." });
  }
}
