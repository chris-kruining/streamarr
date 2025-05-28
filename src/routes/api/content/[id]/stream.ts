import { APIEvent } from "@solidjs/start/server";
import { getStream } from "~/features/content";

// const CHUNK_SIZE = 1 * 1e6; // 1MB

export const GET = async ({ request, params }: APIEvent) => {
  "use server";

  const range = request.headers.get("range");

  if (range === null) {
    return new Response("Requires Range header", { status: 400 });
  }

  return getStream(params.id, range);

  // try {
  //   const file = Bun.file(
  //     import.meta.dirname + "/SampleVideo_1280x720_10mb.mp4",
  //   );

  //   if ((await file.exists()) !== true) {
  //     return new Response("File not found", { status: 404 });
  //   }

  //   const videoSize = file.size;
  //   const start = Number.parseInt(range.replace(/\D/g, ""));
  //   const end = Math.min(start + CHUNK_SIZE - 1, videoSize - 1);

  //   console.log(`streaming slice(${start}, ${end})`);

  //   return new Response(file.slice(start, end), {
  //     status: 206,
  //     headers: {
  //       'Accept-Ranges': 'bytes',
  //       'Content-Range': `bytes ${start}-${end}/${videoSize}`,
  //       'Content-Length': `${end - start + 1}`,
  //       'Content-Type': 'video/mp4',
  //     },
  //   });
  // } catch (e) {
  //   console.error(e);

  //   throw e;
  // }
};
