import createSchema from "part:@sanity/base/schema-creator";
import schemaTypes from "all:part:@sanity/base/schema-type";
import sponsor from "./sponsor";
import organizer from "./organizer";
import news from "./news";
import singletonGeneralData from "./singletionGeneralData";
import singletonContact from "./singletonContact";
import whyApplicateData from "./whyApplicateData";
import sections from "./sections";
import archiv from "./archiv";
import faculty from "./faculty";
import university from "./university";
import subject from "./subject";
import participant from "./participant";
import criteria from "./criteria";
import admin from "./admin";
import singletonDocumentsGeneral from "./singletonDocumentsGeneral";
import winners from "./winners";
import signletonDeadline from "./signletonDeadline";

export default createSchema({
  name: "default",
  types: schemaTypes.concat([
    singletonGeneralData,
    singletonDocumentsGeneral,
    sponsor,
    organizer,
    news,
    sections,
    archiv,
    singletonContact,
    whyApplicateData,
    subject,
    faculty,
    university,
    participant,
    criteria,
    admin,
    winners,
    signletonDeadline,
  ]),
});
