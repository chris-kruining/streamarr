import { toSlug } from "~/utilities";
import type { Entry } from "./types";

export const emptyEntry = Object.freeze<Entry>({ type: 'movie', id: '0', title: '' });

export const createSlug = (entry: Entry) => toSlug(`${entry.title}-${entry.type}-${entry.id}`);
