import { useEffect } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { useTranslation } from "react-i18next";

function App() {
  const { i18n } = useTranslation();
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = typeof i18n.dir === "function" ? i18n.dir(i18n.language) : "ltr";
  }, [i18n, i18n.language]);

  return <RouterProvider router={router} />;
}

export default App
