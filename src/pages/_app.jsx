import React, { useState } from "react";
import axios from "axios";
import { init } from "@sentry/browser";
import { Verdikoder } from "../lib/Context/Verdikoder";
import Header from "../lib/Components/Header";
import ErrorBoundary from "../lib/Components/ErrorBoundary";

import "../styles/index.scss";
import "../styles/app.scss";

if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
  require("../mocks");
}

if (process.env.NODE_ENVIRONMENT == "production") {
  init({
    dsn: "https://27d38c9082cc45248d48e24e2cc7f2fb@sentry.nav.no/10",
  });
}

function App({ Component, pageProps }) {
  const [errors, setError] = useState({
    hasError: false,
    status: null,
    statusText: null,
  });
  // apply interceptor on response
  axios.interceptors.response.use(
    (response) => response,
    (error) => setError({ hasError: true, ...error })
  );
  return (
    <Verdikoder>
      <div className="app">
        <Header />
        <ErrorBoundary apiErrors={errors}>
          <div role="main" className="main">
            <Component {...pageProps} />
          </div>
        </ErrorBoundary>
      </div>
    </Verdikoder>
  );
}

export default App;
