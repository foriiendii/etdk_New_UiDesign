import {
  queryApplicate,
  queryArchivsBasic,
  queryContact,
  queryGeneral,
  queryNews,
  queryOrg,
  querySponsor,
} from "@lib/queries";
import { getClient } from "@lib/sanity";
import { type NextPage } from "next";
import Head from "next/head";
import type {
  SanityApplicate,
  SanityArchiv,
  SanityContact,
  SanityGeneral,
  SanityNews,
  SanityOrganizer,
  SanitySponsor,
} from "types";
import Contact from "../components/Contact";
import MainPage from "../components/MainPage";
import NewsArchiv from "../components/NewsArchiv";
import ParticipationCondition from "../components/ParticipationCondition";
import SponsorsOrg from "../components/SponsorsOrg";
import WhyApplicate from "../components/WhyApplicate";
import Year from "../components/Year";
import { getThemeColors } from "../../utils/getThemeColors";

type Props = {
  sponsors: SanitySponsor[];
  organizers: SanityOrganizer[];
  contact: SanityContact;
  general: SanityGeneral;
  applicate: SanityApplicate;
  news: SanityNews[];
  archivs: SanityArchiv[];
};

const Home: NextPage<Props> = ({
  sponsors,
  organizers,
  contact,
  general,
  applicate,
  news,
  archivs,
}: Props) => {
  return (
    <>
      <Head>
        <title>ETDK</title>
        <meta
          name="description"
          content="Erdélyi Tudományos diákköri konferencia reál és humántudományok"
        />
        <link rel="icon" href="/ETDK.png" />
      </Head>
      <MainPage
        date={general.date}
        edition={general.edition}
        romanEdition={general.editionRoman}
      />
      <WhyApplicate
        title={applicate.title}
        description={applicate.description}
        small_benefit={applicate.small_benefit}
        big_benefit={applicate.big_benefit}
      />
      <ParticipationCondition
        generalApplicationRules={general.generalApplicationRules}
      />
      <Year paymentLink={general.paymentLink} />
      <NewsArchiv news={news} archivs={archivs} />
      <SponsorsOrg sponsors={sponsors} organizers={organizers} />
      <Contact
        address={contact.address}
        email={contact.email}
        phone={contact.phone}
        facebook={contact.facebook}
        instagram={contact.instagram}
        date={general.date}
        romanEdition={general.editionRoman}
      />
    </>
  );
};

export async function getServerSideProps({ preview = false }) {
  const sponsors = await getClient(preview).fetch(querySponsor);
  const organizers = await getClient(preview).fetch(queryOrg);
  const contacts = await getClient(preview).fetch(queryContact);
  const generals = await getClient(preview).fetch(queryGeneral);
  const applicate = await getClient(preview).fetch(queryApplicate);
  const news = await getClient(preview).fetch(queryNews);
  const archivs = await getClient(preview).fetch(queryArchivsBasic);
  const themeColors = await getThemeColors(preview);

  return {
    props: {
      contact: contacts[0],
      general: generals[0],
      applicate: applicate[0],
      archivs,
      news,
      sponsors,
      organizers,
      preview,
      themeColors,
    },
  };
}

export default Home;
