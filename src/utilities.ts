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

export const merge = (...objects: Record<string, any>[]): Record<string, any> => {
  if (objects.length === 0) {
    return {};
  }

  const target = objects[0];

  for (const key of new Set(objects.map(o => Object.keys(o)).flat())) {
    const values = objects.filter(o => Object.hasOwn(o, key)).map(o => o[key]);

    target[key] = values.every(v => v && typeof v === 'object' && !Array.isArray(v)) ? merge(...values) : values.at(-1);
  }

  return target;
};

type CamelCase<S extends string> = S extends `${infer First}${infer Rest}` ? `${Lowercase<First>}${Rest}` : Lowercase<S>;
export type CamelCased<T extends Record<string, any>> = {
  [ K in keyof T as CamelCase<string&K>]: T[K];
} & {};

export const mapKeysToCamelCase = <T extends Record<string, any>>(subject: T): CamelCased<T> => Object.fromEntries(Object.entries(subject).map(([k, v]) => [`${k[0].toLowerCase()}${k.slice(1)}`, v])) as CamelCased<T>;
