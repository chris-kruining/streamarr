import { Accessor, createEffect, createSignal, on } from "solid-js";

export const splitAt = (
  subject: string,
  index: number,
): readonly [string, string] => {
  if (index < 0) {
    return [subject, ""];
  }

  if (index > subject.length) {
    return [subject, ""];
  }

  return [subject.slice(0, index), subject.slice(index + 1)];
};

export const toSlug = (subject: string) =>
  subject.toLowerCase().replaceAll(" ", "-").replaceAll(/[^\w-]/gi, "");
export const toHex = (subject: number) => subject.toString(16).padStart(2, "0");

const encoder = new TextEncoder();
export const hash = (
  algorithm: AlgorithmIdentifier,
  subject: Accessor<string | null | undefined>,
) => {
  const [hash, setHash] = createSignal<string>();

  createEffect(
    on(subject, async (subject) => {
      if (subject === null || subject === undefined || subject.length === 0) {
        setHash(undefined);

        return;
      }

      const buffer = new Uint8Array(
        await crypto.subtle.digest(algorithm, encoder.encode(subject)),
      );

      setHash(Array.from(buffer).map(toHex).join(""));
    }),
  );

  return hash;
};
