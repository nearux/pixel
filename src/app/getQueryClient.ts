// app/getQueryClient.tsx
import { cache } from "react";

import { QueryClient } from "@tanstack/react-query";

// cache() is scoped per request, so we don't leak data between requests
const getQueryClient = cache(() => new QueryClient());
export default getQueryClient;
