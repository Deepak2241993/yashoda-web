"use client";
import React, { useEffect, useState } from "react";
import { MyContext } from "./ThemeContext";
import { usePathname } from "next/navigation";

const ThemeProvider = ({ children }) => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [selectedCityName, setSelectedCityName] = useState(null);
  const [isLoginChanged, setIsLoginChanged] = useState(0)
  const [isCityChanged, setIsCityChanged] = useState(0)

  // console.log('currentPath', currentPath)

  useEffect(() => {
    const checkMobileView = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.matchMedia("(max-width: 575px)").matches);
      }
    };
    checkMobileView();
    window.addEventListener("resize", checkMobileView);
    return () => {
      window.removeEventListener("resize", checkMobileView);
    };
  }, []);

  useEffect(() => {
    setCurrentPath(pathname);
    const handleRouteChange = () => {
      setCurrentPath(pathname);
    };
    handleRouteChange();
  }, [pathname]);

  const handleCityNameChange = (cityName) => {
    setSelectedCityName(cityName);
  };
  const handleLoginChange = (value) => {
    setIsLoginChanged(value);
  };

  const handleCityChange = (value)=>{
    setIsCityChanged(value)
  }
  
  const values = {
    isMobile,
    currentPath,
    selectedCityName,
    handleCityNameChange,
    isLoginChanged,
    handleLoginChange,
    isCityChanged,
    handleCityChange
  };

  //   console.log('nowShowingMovieData', nowShowingMovieData)

  return <MyContext.Provider value={values}>{children}</MyContext.Provider>;
};

export default ThemeProvider;
