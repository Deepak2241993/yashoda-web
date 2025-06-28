"use client"
import React, { useState, useEffect, useContext } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { postApiService } from "../../../../utils/api";
import { MyContext } from "@/context/ThemeContext";


const OfferDetails = ({ params }) => {
  const { offerId, cityName } = params;
  const { isMobile } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [offerDetailsData, setOfferDetailsData] = useState(null);
  const ptValue = isMobile ? "MSITE" : "WEBSITE";


  useEffect(() => {
    fetchOfferData();
  }, []);

  const fetchOfferData = async () => {
    setLoading(true);
    const postData = {
      id: offerId,
      city: cityName,
      payment: true,
    };
    try {
      const data = await postApiService(postData, "v1/offer/get", ptValue,cityName);
      const dt = data.output;
      setOfferDetailsData(dt);
      // console.log("offerDt", data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  return (
      <div>
        {loading ? (
          <span className="d-flex justify-content-center my-5">
            <i
            className="pi pi-spin pi-spinner text-theme-dark1"
            style={{
              fontSize: "5em",
            }}
          ></i>
          </span>
        ) : (
          <>
            <div className="offer-details-banner">
              <img
                src={
                  offerDetailsData?.imageHorizontal
                    ? offerDetailsData?.imageHorizontal
                    : "/assets/default/horizontal-poster.png"
                }
                alt=""
                className="img-fluid"
              />
            </div>
            <section className="ptb-40">
              <div className="view-container container">
                <div className="row">
                  <div className="col-md-12 col-sm-12">
                    <div className="vaild-offer-cinemas">
                      <div className="vaild-plaftorm-cineams">
                        <h6>VALID ON</h6>
                        <p>Website & Mobile App</p>
                      </div>
                      <div className="divider-line"></div>
                      <div className="valid-date-cinema">
                        <h6>VALID TILL</h6>
                        <p>
                          {new Date(offerDetailsData?.validTo).toDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="offer-reedmee-avail">
                      <TabView>
                        <TabPanel header="How to avail the offer">
                          <div className="about-offer">
                            <p
                              dangerouslySetInnerHTML={{
                                __html: offerDetailsData?.howAvail,
                              }}
                              className="px-2"
                            ></p>
                          </div>
                        </TabPanel>
                        <TabPanel header="Terms and conditions">
                          <div className="about-offer">
                            <p
                              dangerouslySetInnerHTML={{
                                __html: offerDetailsData?.tnc,
                              }}
                              className="px-2"
                            ></p>
                          </div>
                        </TabPanel>
                      </TabView>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
  );
}

export default OfferDetails