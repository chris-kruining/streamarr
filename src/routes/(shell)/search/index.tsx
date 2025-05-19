import { createInfiniteScroll } from "@solid-primitives/pagination";
import { Title } from "@solidjs/meta";
import { createEffect, createSignal, For, on, onMount, Show, createComputed, batch, createMemo, untrack } from "solid-js";
import { createSlug, search } from "~/features/content";
import { AiOutlineLoading } from "solid-icons/ai";
import css from './index.module.css';
import { debounce } from "@solid-primitives/scheduled";

const getResults = async (query: string, page: number) => {
    const { results } = await search(query, page + 1);
    return results;
  };

export default function Index() {
  const [ query, setQuery ] = createSignal(""); // lord of the rings
  const [ ref, setRef ] = createSignal<HTMLInputElement>();

  const KAAS = createMemo(() => {
    const q = query();
    const [pages, setEl, { end }] = createInfiniteScroll((page) => getResults(q, page));
    
    return { pages, setEl, end };
  });
  // const result = createAsync(() => search(query()), { initialValue: { count: 0, pages: 0, results: [] } });

  const title = 'Search';

  createEffect(() => {
    KAAS();

    untrack(ref)?.focus();
  });

  return <div class={css.container}>
    <Title>{title}</Title>

    <header class={css.header}>
      <input ref={setRef} type="search" placeholder={title} value={query()} oninput={debounce(e => setQuery(e.target.value), 300)} />
    </header>

    <ul class={css.grid}>
      <For each={KAAS().pages()}>{
        item => <a id={`item:${item.id}`} href={`/details/${createSlug(item)}`}>
          <img class={css.item} src={item.thumbnail} title={item.title} />
        </a>
      }</For>

      <Show when={!KAAS().end()}>
        <AiOutlineLoading ref={KAAS().setEl} />
      </Show>

      <Show when={KAAS().pages().length === 0}>
        <p>No results</p>        
      </Show>
    </ul>

    {/* <output>
      <p>{result().count}</p>

      <ul>
        <For each={result().results}>{
          result => <li>{result.title}</li>
        }</For>
      </ul>      
    </output> */}
  </div>;
}
