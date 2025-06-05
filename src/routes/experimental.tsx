import { A } from "@solidjs/router";
import { ParentProps } from "solid-js";

export default function Experimental(props: ParentProps) {
  return (
    <div style={{ overflow: "auto" }}>
      <nav
        style={{
          position: "sticky",
          "inset-block-start": 0,
          display: "flex",
          gap: "var(--size-2)",
        }}
      >
        <A href="/">Home</A>
        <A href="/experimental/sonarr">Sonarr</A>
        <A href="/experimental/radarr">Radarr</A>
      </nav>

      <main>{props.children}</main>
    </div>
  );
}
