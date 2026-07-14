import { APIEvent } from "@solidjs/start/server";
import { getSubtitle } from "~/features/content";

export const GET = async ({
  params: { id, mediaSourceId, index },
}: APIEvent) => {
  "use server";

  return getSubtitle(id, mediaSourceId, Number(index));
};
