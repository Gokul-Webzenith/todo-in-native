import createClient from "openapi-fetch";
import createReactQueryClient from "openapi-react-query";

import type { paths } from "./api-types";

const client = createClient<paths>({
  baseUrl: "http://localhost:3000",
  credentials: "include",
});

export const todoApi = createReactQueryClient(client);