import "server-only";
import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, token } from "../env";

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false to get latest data from the server always
  token,
});

if (!writeClient.config().token) {
  throw new Error("Missing write token");
}
