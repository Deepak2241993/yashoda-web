"use client";
import { MyContext } from "@/context/ThemeContext";
import { postApiService } from "@/utils/api";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";

const PrivacyPolicy = () => {
  const { isMobile } = useContext(MyContext);
  const ptValue = isMobile ? "MSITE" : "WEBSITE";
  const [loading, setLoading] = useState(false);
  const [privacyPoicyData, setPrivacyPoicyData] = useState(null);

  useEffect(() => {
    getProfileDataService();
  }, []);

  const getProfileDataService = () => {
    setLoading(true);
    const cityPostData = {
      staticNames: ["Privacy_Policy"],
      type: "",
    };
    postApiService(
      cityPostData,
      "v1/web/staticPages",
      ptValue,
      Cookies.get("city")
    ).then((res) => {
      setPrivacyPoicyData(res?.output?.staticHtml?.Privacy_Policy?.value);
      // console.log("aboutUs", res.output);
      setLoading(false);
    });
  };

  return (
    <div>
      <section className="cinemas-bg show-in-desktop-view">
        <div className="container view-container">
          <div className="d-flex justify-content-between filter-cinemas py-3">
            <div className="cinemas-banner">
              <h3>Privacy Policy</h3>
            </div>
            <div></div>
          </div>
        </div>
      </section>
      <section className="ptb-18">
        <div className="container view-container">
          <div className="row">
            <div className="col-md-12">
              <div className="privacy-policy">
                {loading ? (
                  "Loading ..."
                ) : (
                  <div className="privacy-policy-space">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: privacyPoicyData,
                      }}
                      className="px-2"
                    ></p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPolicy