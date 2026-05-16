
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HeroUIProvider } from "@heroui/react";
import { CartWishlistProvider } from "./context/CartWishlistContext";

import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeroUIProvider>
      <ThemeProvider>
        <CartWishlistProvider>
          <App />
        </CartWishlistProvider>
      </ThemeProvider>
    </HeroUIProvider>
  </StrictMode>
);