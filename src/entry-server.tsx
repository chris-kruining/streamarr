// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            rel="icon"
            href="/favicon-light.svg"
            media="(prefers-color-scheme:light)"
          />
          <link
            rel="icon"
            href="/favicon-dark.svg"
            media="(prefers-color-scheme:dark)"
          />
          {assets}
        </head>
        <body>
          {children}
          {scripts}
        </body>
      </html>
    )}
  />
));
