import { Component, createMemo } from "solid-js";
import { useVideo } from "../context";

export const PlayState: Component<{}> = (props) => {
  const video = useVideo();

  const icon = createMemo(() => {
    return {
      playing: "⏵",
      paused: "⏸",
    }[video.state()];
  });

  return <button onclick={(e) => video.togglePlayState()}>{icon()}</button>;
};
