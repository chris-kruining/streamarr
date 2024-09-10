import type { Entry } from "./types";

export const entries = new Map<number, Entry>([
  { id: 1, title: 'Realtime with Bill Maher', thumbnail: 'https://www.themoviedb.org/t/p/w342/pbpoLLp4kvnYVfnEGiEhagpJuVZ.jpg' },
  { id: 2, title: 'Binnelanders', thumbnail: 'https://www.themoviedb.org/t/p/w342/v9nGSRx5lFz6KEgfmgHJMSgaARC.jpg' },
  { id: 3, title: 'Family guy', thumbnail: 'https://www.themoviedb.org/t/p/w342/y0HUz4eUNUe3TeEd8fQWYazPaC7.jpg' },
  { id: 4, title: 'The Simpsons', thumbnail: 'https://www.themoviedb.org/t/p/w342/vHqeLzYl3dEAutojCO26g0LIkom.jpg' },
  { id: 5, title: 'Breaking Bad', thumbnail: 'https://www.themoviedb.org/t/p/w342/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg' },
  { id: 6, title: 'Loki', thumbnail: 'https://www.themoviedb.org/t/p/w342/oJdVHUYrjdS2IqiNztVIP4GPB1p.jpg' },
  { id: 7, title: 'Dark desire', thumbnail: 'https://www.themoviedb.org/t/p/w342/uxFNAo2A6ZRcgNASLk02hJUbybn.jpg' },
  { id: 8, title: 'Bridgerton', thumbnail: 'https://www.themoviedb.org/t/p/w342/luoKpgVwi1E5nQsi7W0UuKHu2Rq.jpg' },
  { id: 9, title: 'Naruto', thumbnail: 'https://www.themoviedb.org/t/p/w342/xppeysfvDKVx775MFuH8Z9BlpMk.jpg' },
  { id: 11, title: 'Teenwolf', thumbnail: 'https://www.themoviedb.org/t/p/w342/fmlMmxSBgPEunHS5gjokIej048g.jpg' },
  { id: 12, title: 'Record of Ragnarok', thumbnail: 'https://www.themoviedb.org/t/p/w342/kTs2WNZOukpWdNhoRlH94pSJ3xf.jpg' },
  { id: 13, title: 'The Mandalorian', thumbnail: 'https://www.themoviedb.org/t/p/w342/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg' },
  {
    id: 14,
    title: 'Wednesday',
    thumbnail: 'https://www.themoviedb.org/t/p/w342/9PFonBhy4cQy7Jz20NpMygczOkv.jpg',
    image: 'https://www.themoviedb.org/t/p/original/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg',
    summary: 'Wednesday Addams is sent to Nevermore Academy, a bizarre boarding school where she attempts to master her psychic powers, stop a monstrous killing spree of the town citizens, and solve the supernatural mystery that affected her family',
    releaseDate: '2022',
    sources: [
      { label: 'TMDB', url: new URL('https://themoviedb.org/tv/119051'), rating: { score: 8.5, max: 10 } }
    ]
  },
].map((entry) => [ entry.id, entry ]));


export const emptyEntry = Object.freeze<Entry>({ id: 0, title: '' });
