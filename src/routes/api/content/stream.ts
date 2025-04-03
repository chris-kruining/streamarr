import { APIEvent } from "@solidjs/start/server";

const CHUNK_SIZE = 1 * 1e6; // 1MB

export const GET = async ({ request, ...event }: APIEvent) => {
  "use server";

  const range = request.headers.get("range");

  if (range === null) {
    return new Response("Requires Range header", { status: 400 });
  }

  try {
    const file = Bun.file(
      import.meta.dirname + "/SampleVideo_1280x720_10mb.mp4",
    );

    if ((await file.exists()) !== true) {
      return new Response("File not found", { status: 404 });
    }

    const videoSize = file.size;

    const start = Number.parseInt(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;

    return new Response(file.stream());

    // return new Response(video.slice(start, end).stream(), {
    //   status: 206,
    //   headers: {
    //     'Accept-Ranges': 'bytes',
    //     'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    //     'Content-Length': `${contentLength}`,
    //     'Content-type': 'video/mp4',
    //   },
    // });
  } catch (e) {
    console.error(e);

    throw e;
  }
};
