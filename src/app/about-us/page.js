"use client";
import { MyContext } from "@/context/ThemeContext";
import { postApiService } from "@/utils/api";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";

const AboutUs = () => {
  const { isMobile } = useContext(MyContext);
  const ptValue = isMobile ? "MSITE" : "WEBSITE";
  const [loading, setLoading] = useState(false);
  const [aboutUsData, setAboutUsData] = useState(null);

  useEffect(() => {
    getProfileDataService();
  }, []);

  const getProfileDataService = () => {
    setLoading(true);
    const cityPostData = {
      staticNames: ["ABOUT_US"],
      type: "",
    };
    postApiService(
      cityPostData,
      "v1/web/staticPages",
      ptValue,
      Cookies.get("city")
    ).then((res) => {
      setAboutUsData(res?.output?.staticHtml?.ABOUT_US?.value);
      // console.log("aboutUs", res.output);
      setLoading(false);
    });
  };

  return (
    <div>
      <sections className="cinemas-bg banner-Mobile">
        <div className="container view-container">
          <div className="d-flex justify-content-between filter-cinemas py-3">
            <div className="cinemas-banner">
              <h3>About Us</h3>
            </div>
            <div></div>
          </div>
        </div>
      </sections>
      <section className="ptb-18 company-fix">
        <div className="container view-container">
          <div className="row"></div>
        </div>
      </section>
      <div className="container view-container">
        <section id="company">
          <div className="row reserve-phn">
            <div className="col-md-12 col-sm-12">
              {loading ? (
                "Loading ..."
              ) : (
                <div className="company">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: aboutUsData,
                    }}
                    className="px-2"
                  ></p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      <section className="ptb-18 company-fix">
        <div className="container view-container">
          <div className="row"></div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
