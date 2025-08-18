import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "./components/layouts/Main";
import "./index.css";
import Computer from "./pages/Computer";
import Computers from "./pages/Computers";
import Configuration from "./pages/Configuration";
import Home from "./pages/Home";

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={client}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="computer" element={<Computers />} />
            <Route path="konfiguration" element={<Configuration />} />
            <Route path="raumverwaltung" element={<div>Raumverwaltung Page</div>} />
            <Route path="computer/:id" element={<Computer />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
