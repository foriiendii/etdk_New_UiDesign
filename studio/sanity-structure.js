import S from "@sanity/desk-tool/structure-builder";

const hiddenDocTypes = (listItem) =>
  !["general", "contact", "applicate", "files", "deadlines"].includes(
    listItem.getId()
  );

export default () =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Általános adatok")
        .child(
          S.editor()
            .id("general")
            .schemaType("general")
            .documentId("singleton-general")
        ),
      S.listItem()
        .title("Kapcsolat")
        .child(
          S.editor()
            .id("contact")
            .schemaType("contact")
            .documentId("singleton-contact")
        ),
      S.listItem()
        .title("Miért jelentkezz?")
        .child(
          S.editor()
            .id("applicate")
            .schemaType("applicate")
            .documentId("singleton-applicate")
        ),
      S.listItem()
        .title("Letölthető dokumentumok")
        .child(
          S.editor()
            .id("files")
            .schemaType("files")
            .documentId("singleton-files")
        ),
      S.listItem()
        .title("Határidők")
        .child(
          S.editor()
            .id("deadlines")
            .schemaType("deadlines")
            .documentId("singleton-deadlines")
        ),
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ]);
