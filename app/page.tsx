"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorPage from "./components/pages/ErrorPage";
import { Page, useNavigation } from "./contexts/NavigationContext";
import HomePage from "./components/pages/HomePage";
import RoomOverviewPage from "./components/pages/RoomOverviewPage";

export default function Home() {
  const [page, setPage] = useState<React.ReactNode>();

  const auth = useAuth();
  const navigation = useNavigation();

  if (auth.didFail && !auth.loading) return <ErrorPage />;

  useEffect(() => {
    switch (navigation.currentPage) {
      case Page.HOME:
        setPage(<HomePage />);
        break;
      case Page.ROOMS:
        setPage(<RoomOverviewPage />);
        break;
    }
  }, [navigation.currentPage]);

  return (
    <>
      <Navbar />
      <div className="h-20 w-full" />
      {page}
      <div className="h-20 w-full"></div>
      <Footer />
    </>
  );
}
