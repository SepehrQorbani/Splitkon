import "@/assets/styles/app.css";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("app") as HTMLElement | null;
if (container) {
    const root = createRoot(container);
    root.render(<App />);
} else {
    console.error("Container #app not found");
}
