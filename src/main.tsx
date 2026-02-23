import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

console.log('Reverb key:', import.meta.env.VITE_REVERB_APP_KEY);
