import { createAsync } from "@solidjs/router";
import { createEffect } from "solid-js";
import { TEST } from "~/features/content/apis/sonarr";

export default function Sonarr() {
  const result = createAsync(() => TEST());

  createEffect(() => {
    console.log("the merged lookup table", result());
  });

  return <pre>{JSON.stringify(result(), null, 2)}</pre>;
}
