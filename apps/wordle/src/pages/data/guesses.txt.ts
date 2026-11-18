import type { APIRoute } from "astro";
import { WORDS } from "#config";

// biome-ignore lint/nursery/useReactFunctionComponentDefinition: false positive
export const GET: APIRoute = () => {
  return new Response(WORDS.guessesRaw);
};
