export default {
  title: "Határidők",
  name: "deadlines",
  type: "document",
  __experimental_actions: ["create", "update", /*"delete",*/ "publish"],
  fields: [
    {
      title: "Regisztráció kezdet",
      name: "applicationStart",
      type: "date",
      options: {
        dateFormat: "YYYY.MM.DD",
        calendarTodayLabel: "Today",
      },
    },
    {
      title: "Regisztráció vége",
      name: "applicationEnd",
      type: "date",
      options: {
        dateFormat: "YYYY.MM.DD",
        calendarTodayLabel: "Today",
      },
    },
    {
      title: "Dolgozatok feltöltése kezdet",
      name: "documentUploadStart",
      type: "date",
      options: {
        dateFormat: "YYYY.MM.DD",
        calendarTodayLabel: "Today",
      },
    },
    {
      title: "Dolgozatok feltöltése vége",
      name: "documentUploadEnd",
      type: "date",
      options: {
        dateFormat: "YYYY.MM.DD",
        calendarTodayLabel: "Today",
      },
    },
    {
      title: "Adatellenőrzés kezdet",
      name: "dataCheckStart",
      type: "date",
      options: {
        dateFormat: "YYYY.MM.DD",
        calendarTodayLabel: "Today",
      },
    },
    {
      title: "Adatellenőrzés vége",
      name: "dataCheckEnd",
      type: "date",
      options: {
        dateFormat: "YYYY.MM.DD",
        calendarTodayLabel: "Today",
      },
    },
    {
      title: "Dolgozatok értékelése kezdet",
      name: "scoringStart",
      type: "date",
      options: {
        dateFormat: "YYYY.MM.DD",
        calendarTodayLabel: "Today",
      },
    },
    {
      title: "Dolgozatok értékelése vége",
      name: "scoringEnd",
      type: "date",
      options: {
        dateFormat: "YYYY.MM.DD",
        calendarTodayLabel: "Today",
      },
    },
    {
      title: "Dolgozatok pontozásának véglegesítése kezdet",
      name: "scoringCheckStart",
      type: "date",
      options: {
        dateFormat: "YYYY.MM.DD",
        calendarTodayLabel: "Today",
      },
    },
    {
      title: "Dolgozatok pontozásának véglegesítése vége",
      name: "scoringCheckEnd",
      type: "date",
      options: {
        dateFormat: "YYYY.MM.DD",
        calendarTodayLabel: "Today",
      },
    },
  ],
};
