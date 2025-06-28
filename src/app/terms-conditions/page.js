"use client";
import { MyContext } from "@/context/ThemeContext";
import { postApiService } from "@/utils/api";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";

const TermsConditions = () => {
  const { isMobile } = useContext(MyContext);
  const ptValue = isMobile ? "MSITE" : "WEBSITE";
  const [loading, setLoading] = useState(false);
  const [termsAndConditionsData, setTermsAndConditionsData] = useState(null);

  useEffect(() => {
    getTermsAndConditionsData();
  }, []);

  const getTermsAndConditionsData = () => {
    setLoading(true);
    const cityPostData = {
      staticNames: ["Terms_Conditions"],
      type: "",
    };
    postApiService(
      cityPostData,
      "v1/web/staticPages",
      ptValue,
      Cookies.get("city")
    ).then((res) => {
      setTermsAndConditionsData(res?.output?.staticHtml?.Terms_Conditions?.value);
      // console.log("aboutUs", res.output);
      setLoading(false);
    });
  };

  return <div>
    <section className="cinemas-bg show-in-desktop-view">
        <div className="container view-container">
          <div className="d-flex justify-content-between filter-cinemas py-3">
            <div className="cinemas-banner">
              <h3>Terms & Conditions</h3>
            </div>
            <div></div>
          </div>
        </div>
      </section>
      <section className="ptb-18">
        <div className="container view-container">
          <div className="row">
            <div className="col-md-12">
              <div className="about-tab-view">
                {loading ? customeThemeLoaderUI('', 'text-theme-dark1') : <div className="card">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: termsAndConditionsData,
                    }}
                    className="px-2"
                  ></p>
                </div>}
              </div>
            </div>
          </div>
        </div>
      </section>
  </div>;
};

export default TermsConditions;
