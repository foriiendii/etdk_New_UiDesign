// This script downloads all assets linked to participants,
// grouped into folders by participant name.
//
// Run it through:
// `sanity exec downloadAllAssets.js --with-user-token`

/* eslint-disable no-console */
import client from "part:@sanity/base/client";
import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const DOWNLOAD_DIR = path.resolve(__dirname, "downloaded-assets");

// Ensure the download directory exists
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

function sanitizeFolderName(name) {
  // Remove/replace characters that are problematic in folder names
  return (name || "unknown")
    .replace(/[/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(destPath);
    protocol
      .get(url, (response) => {
        // Follow redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          file.close();
          downloadFile(response.headers.location, destPath)
            .then(resolve)
            .catch(reject);
          return;
        }
        response.pipe(file);
        file.on("finish", () => {
          file.close(resolve);
        });
      })
      .on("error", (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
  });
}

async function downloadAsset(asset, destDir, label) {
  if (!asset || !asset.asset || !asset.asset.url) return false;

  const url = asset.asset.url;
  const filename =
    asset.asset.originalFilename ||
    `${label}.${asset.asset.extension || "bin"}`;

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const destPath = path.join(destDir, filename);

  // If file already exists, add a suffix to avoid overwriting
  let finalPath = destPath;
  let counter = 1;
  while (fs.existsSync(finalPath)) {
    const ext = path.extname(filename);
    const base = path.basename(filename, ext);
    finalPath = path.join(destDir, `${base}_${counter}${ext}`);
    counter++;
  }

  try {
    await downloadFile(url, finalPath);
    return true;
  } catch (err) {
    console.error(`  ❌ Failed to download ${label}: ${err.message}`);
    return false;
  }
}

// GROQ query: fetch all participants with their file assets dereferenced
const query = `
  *[_type == "participants"]{
    _id,
    name,
    idPhoto { asset-> { url, originalFilename, extension } },
    extract { asset-> { url, originalFilename, extension } },
    essay { asset-> { url, originalFilename, extension } },
    annex { asset-> { url, originalFilename, extension } },
    contribution { asset-> { url, originalFilename, extension } },
    companions[] {
      name,
      idPhoto { asset-> { url, originalFilename, extension } }
    },
    advisors[] {
      name,
      certificate { asset-> { url, originalFilename, extension } }
    }
  }
`;

client
  .fetch(query)
  .then(async (participants) => {
    if (!participants.length) {
      console.log("No participants found");
      return;
    }

    console.log(
      `Found ${participants.length} participants. Starting download...\n`
    );

    let totalDownloaded = 0;
    let totalFailed = 0;
    let totalSkipped = 0;

    for (let i = 0; i < participants.length; i++) {
      const p = participants[i];
      const folderName = sanitizeFolderName(p.name);
      const participantDir = path.join(DOWNLOAD_DIR, folderName);

      console.log(
        `\n[${i + 1}/${participants.length}] 📁 ${p.name || "unknown"}`
      );

      // Download top-level file fields
      const topLevelFiles = [
        { field: p.idPhoto, label: "Ellenőrző kép" },
        { field: p.extract, label: "Dolgozat kivonat" },
        { field: p.essay, label: "Dolgozat" },
        { field: p.annex, label: "Melléklet" },
        { field: p.contribution, label: "Hozzájárulási nyilatkozat" },
      ];

      for (const { field, label } of topLevelFiles) {
        const result = await downloadAsset(field, participantDir, label);
        if (result) {
          totalDownloaded++;
          console.log(`  ✅ ${label}`);
        } else if (field && field.asset) {
          totalFailed++;
        } else {
          totalSkipped++;
        }
      }

      // Download companion (co-author) files
      if (p.companions && p.companions.length > 0) {
        for (let c = 0; c < p.companions.length; c++) {
          const companion = p.companions[c];
          const companionName = sanitizeFolderName(companion.name);
          const companionDir = path.join(
            participantDir,
            `társszerző-${companionName}`
          );

          const companionFiles = [
            { field: companion.idPhoto, label: "Ellenőrző kép" },
          ];

          for (const { field, label } of companionFiles) {
            const result = await downloadAsset(field, companionDir, label);
            if (result) {
              totalDownloaded++;
              console.log(`  ✅ [Társszerző: ${companion.name}] ${label}`);
            } else if (field && field.asset) {
              totalFailed++;
            } else {
              totalSkipped++;
            }
          }
        }
      }

      // Download advisor files
      if (p.advisors && p.advisors.length > 0) {
        for (let a = 0; a < p.advisors.length; a++) {
          const advisor = p.advisors[a];
          const advisorName = sanitizeFolderName(advisor.name);
          const advisorDir = path.join(
            participantDir,
            `témavezető-${advisorName}`
          );

          const result = await downloadAsset(
            advisor.certificate,
            advisorDir,
            "Igazolás"
          );
          if (result) {
            totalDownloaded++;
            console.log(`  ✅ [Témavezető: ${advisor.name}] Igazolás`);
          } else if (advisor.certificate && advisor.certificate.asset) {
            totalFailed++;
          } else {
            totalSkipped++;
          }
        }
      }
    }

    console.log(`\n${"=".repeat(50)}`);
    console.log(`Done!`);
    console.log(`  Downloaded: ${totalDownloaded}`);
    console.log(`  Failed:     ${totalFailed}`);
    console.log(`  Skipped (no file): ${totalSkipped}`);
    console.log(`  Saved to: ${DOWNLOAD_DIR}`);
  })
  .catch((err) => {
    if (err.message.includes("Insufficient permissions")) {
      console.error(err.message);
      console.error("Did you forget to pass `--with-user-token`?");
    } else {
      console.error(err.stack);
    }
  });
