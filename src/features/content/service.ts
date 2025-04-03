import type { Category, Entry } from './types';
import { query } from "@solidjs/router";
import { entries } from './data';

export const listCategories = query(async (): Promise<Category[]> => {
  "use server";

  return [
    {
      label: 'Popular',
      entries: [entries.get(1)!, entries.get(2)!, entries.get(3)!, entries.get(4)!, entries.get(1)!, entries.get(2)!, entries.get(3)!, entries.get(4)!],
    },
    {
      label: 'Drama',
      entries: [entries.get(5)!, entries.get(6)!, entries.get(7)!, entries.get(8)!, entries.get(1)!, entries.get(2)!, entries.get(3)!, entries.get(4)!],
    },
    {
      label: 'Now streaming',
      entries: [entries.get(1)!, entries.get(2)!, entries.get(3)!, entries.get(4)!, entries.get(1)!, entries.get(2)!, entries.get(3)!, entries.get(4)!],
    },
    {
      label: 'Sci-Fi & Fantasy',
      entries: [entries.get(9)!, entries.get(11)!, entries.get(12)!, entries.get(13)!, entries.get(1)!, entries.get(2)!, entries.get(3)!, entries.get(4)!],
    },
  ];
}, 'series.categories.list');

export const getEntry = query(async (id: Entry['id']): Promise<Entry | undefined> => {
  "use server";

  return entries.get(id);
}, "series.get");
