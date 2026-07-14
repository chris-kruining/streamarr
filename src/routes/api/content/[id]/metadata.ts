import { APIEvent } from "@solidjs/start/server";
import { json } from "@solidjs/router";
import { getPlayerMetadata } from "~/features/content";

export const GET = async ({ params: { id } }: APIEvent) => {
  "use server";

  const metadata = await getPlayerMetadata(id);

  return metadata
    ? json(metadata)
    : new Response("Playback metadata unavailable", { status: 404 });
};
