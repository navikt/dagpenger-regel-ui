import React from "react";
import { init } from "@sentry/browser";
import { Verdikoder } from "../lib/Context/Verdikoder";
import Header from "../lib/Components/Header";

import "../styles/index.scss";
import "../styles/app.scss";

if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
  require("../mocks");
}

if (process.env.NODE_ENVIRONMENT === "production") {
  init({
    dsn: "https://c55f9219358540998cb57ae406b9ccf1@sentry.gc.nav.no/150",
    tracesSampleRate: 1.0,
  });
}

function App({ Component, pageProps }) {
  return (
    <Verdikoder>
      <div className="app">
        <Header />
        <div role="main" className="main">
          <Component {...pageProps} />
        </div>
      </div>
    </Verdikoder>
  );
}

export default App;
