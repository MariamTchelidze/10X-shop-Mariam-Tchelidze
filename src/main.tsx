// React აპლიკაციის საწყის წერტილს ქმნის და საერთო სტილებს უკავშირებს.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
