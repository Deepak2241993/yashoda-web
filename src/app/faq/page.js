"use client";
import { MyContext } from "@/context/ThemeContext";
import { getApiService } from "@/utils/api";
import Cookies from "js-cookie";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useContext, useEffect, useState } from "react";

const Faqs = () => {
  const { isMobile } = useContext(MyContext);
  const ptValue = isMobile ? "MSITE" : "WEBSITE";
  const [loading, setLoading] = useState(false);
  const [faqData, setFaqData] = useState(null);
  const [isAccordionTabOpen, setIsAccordionTabOpen] = useState(false);


  useEffect(() => {
    getFaqData();
  }, []);

  const getFaqData = () => {
    setLoading(true);
    getApiService(
      "v1/web/faqs/BOOKING",
      ptValue,
      Cookies.get("city")
    ).then((res) => {
      setFaqData(res?.output);
      // console.log("aboutUs", res.output);
      setLoading(false);
    });
  };

  const accordionHeader = (item) => {
    return (
      <div className="d-flex align-items-center">
        <div className="faq-question">
          <h4>{item.question}</h4>
        </div>
      </div>
    );
  };

  return (
    <div>
      <section className="cinemas-bg banner-Mobile">
        <div className="container view-container">
          <div className="d-flex justify-content-between filter-cinemas py-3">
            <div className="cinemas-banner">
              <h3>FAQ</h3>
            </div>
            <div></div>
          </div>
        </div>
      </section>
      <section className="ptb-18 phn-18">
        <div className="container view-container">
          <div className="row">
            <div className="col-lg-11 col-sm-12">
              {loading ? (
                "Loading ..."
              ) : <div className="faq">
                <Accordion
                  expandIcon={
                    <img
                      src="/assets/icons/downarrow.svg"
                      alt="Expand Icon"
                      className="img-fluid custom-cricle-arrow"
                    />
                  }
                  collapseIcon={
                    <img
                      src="/assets/icons/uparrow.svg"
                      alt="Collapse Icon"
                      className="img-fluid custom-cricle-arrow"
                    />
                  }
                  onTabClose={() => setIsAccordionTabOpen(false)}
                  onTabOpen={() => setIsAccordionTabOpen(true)}
                  activeIndex={0}
                >
                  {faqData &&
                    faqData.map((item, index) => {
                      return (
                        <AccordionTab
                          header={accordionHeader(item)}
                          key={index}
                        >
                          <div className="row">
                            <div className="col-md-12">
                              <div className="faq-answer">
                                <p>{item.awnser}</p>
                              </div>
                            </div>
                          </div>
                        </AccordionTab>
                      );
                    })}
                </Accordion>
              </div>}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Faqs