import { type SchemaTypeDefinition } from "sanity";

import { author } from "./authorType";
import { startup } from "./startup";
import { playlist } from "./playlist";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, startup, playlist],
};
