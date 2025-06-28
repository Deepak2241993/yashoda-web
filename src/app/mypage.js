"use client";
import { useContext, useEffect, useState } from "react";
import Banner from "./home/Banner";
import NowShowing from "./home/NowShowing";
import ComingSoon from "./home/ComingSoon";
import { getNowShowingData } from "../utils/api";
import { MyContext } from "@/context/ThemeContext";

export default function Home() {
  const {isMobile } = useContext(MyContext);
  const appPlatform = isMobile ? "MSITE" : "WEBSITE";
  const [loading, setLoading] = useState(false);
  const [nowShowingOutput, setNowShowingOutput] = useState(null);
  const [activeTab, setActiveTab] = useState(0); 

  useEffect(() => {
    getNowShowingALLData();
  }, []);

  const getNowShowingALLData = async () => {
    setLoading(true);
    try {
      const data = await getNowShowingData(appPlatform);
      setNowShowingOutput(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching chain data:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <Banner />
      <div className="px-24 mt-2">
        <div className="flex border-lightgray-600 border-b-2">
          <div
            className={
              activeTab === 0
                ? "p-3 font-bold text-black pointer border-red-600 border-b-2"
                : "p-3 pointer"
            }
            onClick={() => setActiveTab(0)}
          >
            Now Showing
          </div>
          <div
            className={
              activeTab === 1
                ? "p-3 font-bold text-black pointer border-red-600 border-b-2"
                : "p-3 pointer"
            }
            onClick={() => setActiveTab(1)}
          >
            Coming Soon
          </div>
        </div>
        <div>
          {activeTab === 0 ? (
            <NowShowing
              loading={loading ? true : false}
              movieData={nowShowingOutput && nowShowingOutput?.mv}
            />
          ) : (
            <ComingSoon />
          )}
        </div>
      </div>
    </>
  );
}
