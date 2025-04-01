import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import './index.css';
import { ThemeContextProvider } from "./features/theme";

export default function App() {
  return (
    <Router
      root={props => (
        <MetaProvider>
          <Title>Streamarr - Home</Title>
          <Suspense>
            <ThemeContextProvider>{props.children}</ThemeContextProvider>
          </Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
