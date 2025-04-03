import {
  WiMoonAltFirstQuarter,
  WiMoonAltFull,
  WiMoonAltNew,
} from "solid-icons/wi";
import {
  Component,
  createEffect,
  For,
  Match,
  on,
  Setter,
  Switch,
} from "solid-js";
import { ColorScheme, useTheme } from "./context";
import css from "./picker.module.css";
import { Select } from "~/components/select";

const colorSchemes: Record<ColorScheme, keyof typeof ColorScheme> =
  Object.fromEntries(
    Object.entries(ColorScheme).map(([k, v]) => [v, k]),
  ) as any;

export const ColorSchemePicker: Component = (props) => {
  const themeContext = useTheme();

  const setScheme: Setter<ColorScheme> = (next) => {
    if (typeof next === "function") {
      next = next();
    }

    themeContext.setColorScheme(next);
  };

  return (
    <>
      <label aria-label="Color scheme picker">
        <Select
          id="color-scheme-picker"
          class={css.picker}
          value={themeContext.theme.colorScheme}
          setValue={setScheme}
          values={colorSchemes}
        >
          {(k, v) => (
            <>
              <Switch>
                <Match when={k === ColorScheme.Auto}>
                  <WiMoonAltFirstQuarter />
                </Match>
                <Match when={k === ColorScheme.Light}>
                  <WiMoonAltNew />
                </Match>
                <Match when={k === ColorScheme.Dark}>
                  <WiMoonAltFull />
                </Match>
              </Switch>
              {v}
            </>
          )}
        </Select>
      </label>

      {/* <label class={css.hue} aria-label="Hue slider">
            <input type="range" min="0" max="360" value={theme.hue} onInput={e => setHue(e.target.valueAsNumber)} />
        </label> */}
    </>
  );
};
