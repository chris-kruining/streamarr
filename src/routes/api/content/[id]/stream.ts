import { APIEvent } from "@solidjs/start/server";
import { getStream } from "~/features/content";

export const GET = async ({ request, params: { id } }: APIEvent) => {
  "use server";

  const range = request.headers.get("range");

  if (range === null) {
    return new Response("Requires Range header", { status: 400 });
  }

  return getStream(id, range);
};
