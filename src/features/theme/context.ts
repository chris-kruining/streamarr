import {
  ContextProviderProps,
  createContextProvider,
} from "@solid-primitives/context";
import { action, createAsyncStore, query, useAction } from "@solidjs/router";
import { createStore } from "solid-js/store";
import { useSession } from "vinxi/http";

export enum ColorScheme {
  Auto = "light dark",
  Light = "light",
  Dark = "dark",
}

export interface State {
  colorScheme: ColorScheme;
  hue: number;
}

const getSession = async () => {
  "use server";

  return useSession<State>({
    password: process.env.SESSION_SECRET!,
  });
};

export const getState = query(async () => {
  "use server";

  const session = await getSession();

  if (Object.getOwnPropertyNames(session.data).length === 0) {
    await session.update({
      colorScheme: ColorScheme.Auto,
      hue: 0,
    });
  }

  return session.data;
}, "color-scheme");

const setState = action(async (state: State) => {
  "use server";

  const session = await getSession();
  await session.update((prev) => ({ ...prev, ...state }));
}, "color-scheme");

interface ThemeContextType {
  readonly theme: State;
  setColorScheme(colorScheme: ColorScheme): void;
  setHue(colorScheme: number): void;
}

const [ThemeContextProvider, useTheme] = createContextProvider<
  ThemeContextType,
  ContextProviderProps
>(
  (props) => {
    const updateState = useAction(setState);
    const state = createAsyncStore(() => getState());

    return {
      get theme() {
        return state.latest ?? { colorScheme: null };
      },

      setColorScheme(colorScheme) {
        updateState({ colorScheme, hue: state.latest!.hue });
      },
      setHue(hue) {
        updateState({ hue, colorScheme: state.latest!.colorScheme });
      },
    };
  },
  {
    theme: {
      colorScheme: ColorScheme.Auto,
      hue: 180,
    },

    setColorScheme(colorScheme) {},
    setHue(hue) {},
  },
);

export { ThemeContextProvider, useTheme };
