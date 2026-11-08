import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { TaskContextProvider } from "./context/TaskContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TaskContextProvider>
      <App />
    </TaskContextProvider>
  </StrictMode>,
);
