import { toSlug } from "~/utilities";
import type { Entry } from "./types";

export const emptyEntry = Object.freeze<Entry>({ id: '0', title: '' });

export const createSlug = (entry: Entry) => toSlug(`${entry.title}-${entry.id}`);
