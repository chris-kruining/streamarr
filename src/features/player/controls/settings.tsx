import { Component } from "solid-js";
import { useVideo } from "../context";
import { FaSolidEllipsisVertical } from "solid-icons/fa";

export const Settings: Component<{}> = (props) => {
  const video = useVideo();

  return (
    <button
      onclick={(e) =>
        video.state.setState((last) =>
          last === "playing" ? "paused" : "playing"
        )
      }
    >
      <FaSolidEllipsisVertical />
    </button>
  );
};
