import {
  createEventListenerMap,
  makeEventListener,
  makeEventListenerStack,
} from "@solid-primitives/event-listener";
import { createAsync, json, query } from "@solidjs/router";
import {
  Component,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  onMount,
} from "solid-js";
import { isServer } from "solid-js/web";

const streamKaas = query(async () => {
  "use server";

  const stream = new WritableStream();

  async function* packetGenerator() {
    for (let i = 0; i < 10; i++) {
      yield `packet ${i}`;
      await new Promise((res) => setTimeout(res, 1000));
    }
  }

  (async () => {
    const writer = stream.getWriter();

    try {
      await writer.ready;

      for await (const packet of packetGenerator()) {
        writer.write(packet);
      }
    } finally {
      writer.releaseLock();
    }
    // response.body.wr
  })();

  return new Response(packetGenerator());
}, "kaas");

interface PlayerProps {
  id: string;
}

export const Player: Component<PlayerProps> = (props) => {
  const [video, setVideo] = createSignal<HTMLVideoElement>();
  const stream = createAsync(async () => {
    const res = await streamKaas();

    console.log(res);

    return "";
  });
  // const [kaas, { refetch }] = createResource(async () => {
  //   if (isServer) {
  //     return "";
  //   }
  //   const response = await fetch("http://localhost:3000/api/stream/video", {
  //     method: "GET",
  //   });

  //   console.log(response.body);

  //   for await (const packet of response.body) {
  //     console.log(new TextDecoder().decode(packet));
  //   }

  //   return "";
  // });

  // onMount(() => refetch());

  // createEffect(() => console.log(stream()));

  // const progress = createMemo(() => {
  //   const
  // });

  createEventListenerMap(() => video()!, {
    durationchange(e) {
      console.log("durationchange", e);
    },
    loadeddata(e) {
      console.log("loadeddata", e);
    },
    loadedmetadata(e) {
      console.log("loadedmetadata", e);
    },
    ratechange(e) {
      console.log("ratechange", e);
    },
    seeked(e) {
      console.log("seeked", e);
    },
    seeking(e) {
      console.log("seeking", e);
    },
    stalled(e) {
      console.log("stalled", e);
    },

    play(e) {
      console.log("play", e);
    },
    playing(e) {
      console.log("playing", e);
    },
    pause(e) {
      console.log("pause", e);
    },
    suspend(e) {
      console.log("suspend", e);
    },

    volumechange(e) {
      console.log("volumechange", e);
    },

    waiting(e) {
      console.log("waiting", e);
    },

    progress(e) {
      console.log(e);
    },

    timeupdate(e) {
      console.log("timeupdate", e);
    },
  });

  const toggle = () => {
    const el = video();

    if (!el) {
      return;
    }

    el[el.paused ? "play" : "pause"]();
  };

  return (
    <>
      <h1>{props.id}</h1>

      <video ref={setVideo} muted preload="metadata">
        <source src="/videos/bbb_sunflower_2160p_60fps_normal.mp4" />
      </video>

      <button onclick={toggle}>play/pause</button>

      <progress />
    </>
  );
};
