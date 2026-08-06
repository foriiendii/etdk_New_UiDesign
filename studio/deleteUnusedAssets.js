// This script will find and delete all assets that are not
// referenced (in use) by other documents. Sometimes refered
// to as "orphaned" assets.
//
// Place this script somewhere and run it through
// `sanity exec <script-filename.js> --with-user-token`

/* eslint-disable no-console */
import client from "part:@sanity/base/client";

const query = `
  *[ _type in ["sanity.imageAsset", "sanity.fileAsset"] ]
  {_id, "refs": count(*[ references(^._id) ])}
  [ refs == 0 ]
  ._id
`;

const BATCH_SIZE = 100;

async function deleteUnusedAssets() {
  const ids = await client.fetch(query);

  if (!ids.length) {
    console.log("No assets to delete");
    return;
  }

  console.log(
    `Found ${ids.length} unused assets. Deleting in batches of ${BATCH_SIZE}...`
  );

  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = ids.slice(i, i + BATCH_SIZE);
    const trx = client.transaction();
    batch.forEach((id) => trx.delete(id));
    await trx.commit();
    console.log(
      `Deleted batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} assets)`
    );
  }

  console.log(`Done! Deleted ${ids.length} assets total.`);
}

deleteUnusedAssets().catch((err) => {
  if (err.message.includes("Insufficient permissions")) {
    console.error(err.message);
    console.error("Did you forget to pass `--with-user-token`?");
  } else {
    console.error("ERROR", err.stack);
  }
});
