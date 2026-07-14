import {
  WiMoonAltFirstQuarter,
  WiMoonAltFull,
  WiMoonAltNew,
} from "solid-icons/wi";
import { Component } from "solid-js";
import { ColorScheme, useTheme } from "./context";
import css from "./picker.module.css";

export const ColorSchemePicker: Component = () => {
  const themeContext = useTheme();

  const setScheme = (event: InputEvent) => {
    themeContext.setColorScheme(event.target.value);
  };

  return (
    <>
      <label aria-label="Color scheme picker">
        <select
          id="color-scheme-picker"
          class={css.picker}
          value={themeContext.theme.colorScheme}
          onInput={setScheme}
        >
          <button>
            <selectedcontent />
          </button>

          <option value={ColorScheme.Auto}>
            <WiMoonAltFirstQuarter />
          </option>
          <option value={ColorScheme.Light}>
            <WiMoonAltNew />
          </option>
          <option value={ColorScheme.Dark}>
            <WiMoonAltFull />
          </option>
        </select>
      </label>
    </>
  );
};
