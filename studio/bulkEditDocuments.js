import client from "part:@sanity/base/client";

const querySections = `*[_type == "sections"][0...999]{
  _id,
}._id`;
client
  .fetch(querySections)
  .then((ids) => {
    if (!ids.length) {
      console.log("No ids found");
      return true;
    }

    console.log(`Found ids number ${ids.length}`);

    return ids
      .reduce(
        (trx, id) => trx.patch(id, { set: { scorers: [] } }),
        client.transaction()
      )
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
