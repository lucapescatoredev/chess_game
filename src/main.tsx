import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ChessGameProvider } from "./context/ChessGameProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChessGameProvider>
      <App />
    </ChessGameProvider>
  </StrictMode>,
);
