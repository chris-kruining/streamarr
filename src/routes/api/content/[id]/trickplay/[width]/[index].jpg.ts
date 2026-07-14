import { APIEvent } from "@solidjs/start/server";
import { getTrickplay } from "~/features/content";

export const GET = async ({ params: { id, width, index } }: APIEvent) => {
  "use server";

  return getTrickplay(id, Number(width), Number(index));
};
