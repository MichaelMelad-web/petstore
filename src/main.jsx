


import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HeroUIProvider } from "@heroui/react";
import { CartWishlistProvider } from "./context/CartWishlistContext";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeroUIProvider>
      <CartWishlistProvider>
        <App />
      </CartWishlistProvider>
    </HeroUIProvider>
  </StrictMode>
);