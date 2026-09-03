import {
  queryApplicate,
  queryArchivsBasic,
  queryContact,
  queryGeneralHome,
  queryNews,
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
  contact: SanityContact;
  general: SanityGeneral;
  applicate: SanityApplicate;
  news: SanityNews[];
  archivs: SanityArchiv[];
};

const Home: NextPage<Props> = ({
  sponsors,
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
      <Year paymentLink={general.paymentLink} showJury={general.showJury !== false} />
      <NewsArchiv news={news} archivs={archivs} />
      <SponsorsOrg sponsors={sponsors} />
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
  const client = getClient(preview);

  // Run every fetch in parallel instead of eight sequential round-trips to Sanity.
  const [
    sponsors,
    contacts,
    generals,
    applicate,
    news,
    archivs,
    themeColors,
  ] = await Promise.all([
    client.fetch(querySponsor),
    client.fetch(queryContact),
    client.fetch(queryGeneralHome),
    client.fetch(queryApplicate),
    client.fetch(queryNews),
    client.fetch(queryArchivsBasic),
    getThemeColors(preview),
  ]);

  return {
    props: {
      contact: contacts[0],
      general: generals[0],
      applicate: applicate[0],
      archivs,
      news,
      sponsors,
      preview,
      themeColors,
    },
  };
}

export default Home;
