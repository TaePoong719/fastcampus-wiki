import React from "react";
import ReactDOM from "react-dom/client";
import "index.css";
import App from "./App";
import "style/fonts/Font.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const root = ReactDOM.createRoot(document.getElementById("root")!);
const queryClient = new QueryClient()

root.render(
<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
);