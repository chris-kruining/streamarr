import { json } from "@solidjs/router";
import vid from "../../../public/videos/bbb_sunflower_2160p_60fps_normal.mp4";
import { APIEvent } from "@solidjs/start/server";

export const GET = async (event: APIEvent) => {
  "use server";

  console.log(event);

  // async function* packetGenerator() {
  //   for (let i = 0; i < 10; i++) {
  //     yield `packet ${i}`;
  //     await new Promise((res) => setTimeout(res, 1000));
  //   }
  // }

  // console.log(vid);

  return "OK";
};
