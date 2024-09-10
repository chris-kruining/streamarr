import { Title } from "@solidjs/meta";

export default function Index() {
  const title = 'Manage';
  return <>
    <Title>{ title }</Title>
    <h1>{title}</h1>
    </>;
}
