import { Component, createEffect, on } from "solid-js";
import { useVideo } from "../context";
import css from "./seekBar.module.css";

interface SeekBarProps {}

export const SeekBar: Component<SeekBarProps> = () => {
  const video = useVideo();

  createEffect(
    on(
      () => [video.duration(), video.buffered(), video.currentTime()] as const,
      ([duration, buffered, currentTime]) => {
        console.log({ duration, buffered, currentTime });
      }
    )
  );

  return (
    <div class={css.container}>
      <span class={css.time}>{formatTime(video.currentTime())}</span>
      <span class={css.duration}>{formatTime(video.duration())}</span>

      <input
        class={css.bar}
        list="chapters"
        type="range"
        max={video.duration().toFixed(2)}
        value={video.currentTime().toFixed(2)}
        data-value={((video.currentTime() / video.duration()) * 100).toFixed(2)}
        oninput={(e) => video.setTime(e.target.valueAsNumber)}
        step="0.01"
      />

      <progress
        class={css.buffered}
        max={video.duration().toFixed(2)}
        value={video.buffered().toFixed(2)}
      />

      <datalist id="chapters">
        <option value="100">Chapter 1</option>
        <option value="200">Chapter 2</option>
        <option value="300">Chapter 3</option>
      </datalist>
    </div>
  );
};

const formatTime = (subject: number) => {
  if (Number.isNaN(subject)) {
    return "";
  }

  const hours = Math.floor(subject / 3600);
  const minutes = Math.floor((subject % 3600) / 60);
  const seconds = Math.floor(subject % 60);

  const sections = hours !== 0 ? [hours, minutes, seconds] : [minutes, seconds];

  return sections.map((section) => String(section).padStart(2, "0")).join(":");
};
