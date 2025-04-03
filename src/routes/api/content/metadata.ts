import { json } from "@solidjs/router";
import { APIEvent } from "@solidjs/start/server";

export const GET = async (event: APIEvent) => {
  console.log(event.params);

  const path = `${import.meta.dirname}/SampleVideo_1280x720_10mb`;

  return json({
    captions: await Bun.file(`${path}.captions.vtt`).bytes(),
    thumbnails: {
      track: await Bun.file(`${path}.thumbnails.vtt`).text(),
      image: await Bun.file(`${import.meta.dirname}/overview.jpg`).bytes(),
    },
  });
};
