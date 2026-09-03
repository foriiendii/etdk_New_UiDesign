export default {
  title: "Hírek",
  name: "news",
  type: "document",
  fields: [
    {
      title: "Összefoglaló",
      name: "summary",
      type: "string",
      description: "Ez egy rövid leirás ami a kis kártyán fog megjelenni",
    },
    {
      title: "Publikálási dátum",
      name: "date",
      type: "date",
      options: {
        dateFormat: "YYYY.MM.DD",
        calendarTodayLabel: "Today",
      },
    },
    {
      title: "Esemény címe",
      name: "eventTitle",
      type: "string",
      description: "Pl. az esemény neve, ha ez egy meghirdetett program (regisztráció, leadási határidő stb.), nem csak egy hír.",
    },
    {
      title: "Helyszín",
      name: "location",
      type: "string",
    },
    {
      title: "Esemény időpontja",
      name: "eventDate",
      type: "date",
      description: "Mikor lesz/volt maga az esemény - a kártyák ez alapján rendeződnek, nem a publikálási dátum alapján. Ha üresen hagyod, a publikálási dátum marad a rendezés alapja.",
      options: {
        dateFormat: "YYYY.MM.DD",
        calendarTodayLabel: "Today",
      },
    },
    {
      title: "Jelentkezési űrlap linkje",
      name: "registrationUrl",
      type: "url",
    },
    {
      title: "Kiemelt kép",
      name: "featuredImage",
      type: "image",
    },
    {
      title: "Leirás",
      name: "description",
      type: "array",
      of: [{ type: "block" }],
    },
  ],
};
