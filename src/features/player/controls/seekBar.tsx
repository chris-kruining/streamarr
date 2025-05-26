import { Component } from "solid-js";

interface SeekBarProps {
  video: HTMLVideoElement | undefined;
}

export const SeekBar: Component<SeekBarProps> = () => {
  return (
    <>
      <input
        list="chapters"
        type="range"
        max={duration().toFixed(0)}
        value={currentTime().toFixed(0)}
        oninput={(e) => setTime(e.target.valueAsNumber)}
        step="1"
      />

      <datalist id="chapters">
        <option value="100">Chapter 1</option>
        <option value="200">Chapter 2</option>
        <option value="300">Chapter 3</option>
      </datalist>
    </>
  );
};
