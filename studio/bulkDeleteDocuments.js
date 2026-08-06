import client from "part:@sanity/base/client";

// for this to work, first run the bulkEditDocuments.js file
const queryAdminsNotSuperAdmin = `*[_type == "admins" && role != "superadmin"][0...999]{
  _id,
}._id`;
const queryParticipants = `*[_type == "participants"][0...999]{
  _id,
}._id`;
const queryWinners = `*[_type == "winners"][0...999]{
  _id,
}._id`;
client
  .fetch(queryAdminsNotSuperAdmin)
  .then((ids) => {
    if (!ids.length) {
      console.log("No one to delete");
      return true;
    }

    console.log(`Deleting ${ids.length} documents`);
    return ids
      .reduce((trx, id) => trx.delete(id), client.transaction())
      .commit()
      .then(() => console.log("Done!"));
  })
  .catch((err) => {
    if (err.message.includes("Insufficient permissions")) {
      console.error(err.message);
      console.error("Did you forget to pass `--with-user-token`?");
    } else {
      console.error(err.stack);
    }
  });
