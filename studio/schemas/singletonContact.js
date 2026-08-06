export default {
  title: "Kapcsolat",
  name: "contact",
  type: "document",
  __experimental_actions: [/*"create",*/ "update", /*"delete",*/ "publish"],
  fields: [
    { title: "Cím", name: "address", type: "string" },
    { title: "Telefonszám", name: "phone", type: "string" },
    { title: "Email", name: "email", type: "string" },
    { title: "Facebook link", name: "facebook", type: "string" },
    { title: "Instagram link", name: "instagram", type: "string" },
  ],
};
