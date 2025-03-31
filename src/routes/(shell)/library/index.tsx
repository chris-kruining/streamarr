import { Title } from "@solidjs/meta";

export default function Index() {
  const title = 'Library';
  return <>
    <Title>{title}</Title>
    <h1>{title}</h1>
  </>;
}
