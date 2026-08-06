import createImageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";
import { config } from "./config";

if (!config.projectId) {
  throw Error("The Project ID is not set. Check your environment variables.");
}
export const urlFor = (source) => createImageUrlBuilder(config).image(source);

export const client = createClient(config);

export const clientWithouCDN = createClient({
  ...config,
  useCdn: false,
});

export const getClient = (noCDN) => (noCDN ? clientWithouCDN : client);
export default client;
