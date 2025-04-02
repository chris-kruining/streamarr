import { Params, useParams } from "@solidjs/router";
import { createEffect } from "solid-js";
import { Player } from "~/features/player";

interface ItemParams extends Params {
  item: string;
}

export default function Item() {
  const params = useParams<ItemParams>();

  return (
    <>
      <Player id={params.item} />
    </>
  );
}
