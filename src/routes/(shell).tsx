
import { ParentProps } from "solid-js";
import { Shell } from "~/features/shell";

export default function ShellPage(props: ParentProps) {
  return <Shell>{props.children}</Shell>;
}
