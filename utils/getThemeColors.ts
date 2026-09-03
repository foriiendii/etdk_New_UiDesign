import { getClient } from "@lib/sanity";
import { queryGeneral } from "@lib/queries";
import type { SanityGeneral } from "../types";

/**
 * Helper function to get theme colors from Sanity
 * Use this in getServerSideProps to pass theme colors to pages
 */
export async function getThemeColors(preview = false) {
  const generals: SanityGeneral[] = await getClient(preview).fetch(
    queryGeneral
  );
  const general = generals[0];

  return {
    primaryLight: general?.primaryLight || "#d4af6a",
    primaryDark: general?.primaryDark || "#2c1728",
    secondaryColor: general?.secondaryColor || "#e7a9b4",
  };
}
