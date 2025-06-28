"use client";
import { MyContext } from "@/context/ThemeContext";
import Image from "next/image";
import { useContext } from "react";


export default function Footer() {
  const date = new Date();
  const year = date.getFullYear();
  const { isMobile, currentPath } = useContext(MyContext);
  const restrictedPath = ["seatlayout", "food", "payment", "booking"];
  const isRestrictedPath = restrictedPath.includes(currentPath?.split("/")[1]);
  // const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 575px)").matches;

  return (
    <>
      <div className={isRestrictedPath ? "d-none" : "footer-m"}>
        <section className="footer-bg">
          <div className="view-container container">
            <div style={{ width: "100%" }}>
              <div className="row">
                <div className="col-md-3 col-sm-12">
                  <div className="footer-link-movietime">
                    <h2>Our Hospitals</h2>
                    <p className="mt-2">
                      Yashoda Healthcare<br></br>
                      1st Floor ,Kamal Cinemas Building<br></br>
                      Nehru Nagar, Ghaziabad- 210029
                    </p>
                    <span className="d-flex">
                      <Image
                        src="/assets/brand/yashoda_site_logo.png"
                        alt="Email Icon"
                        width={30}
                        height={30}
                        className="img-fluid movietime-icon"
                      />{" "}
                      <a href="mailto:info@movietimecinemas.in">
                        info@movietimecinemas.in
                      </a>
                    </span>
                    <h6 className="d-flex">
                      <Image
                        src="/assets/icons/call.png"
                        alt="Phone icon"
                        width={30}
                        height={30}
                        className="img-fluid movietime-icon"
                      />{" "}
                      <a href="tel: 9068853335"> 9068853335</a>
                    </h6>
                    <div className="social-link">
                      <ul>
                        <li>
                          <a
                            href="#"
                            target="_blank"
                          >
                            <i
                              className="pi pi-facebook"
                              style={{ fontSize: "1em" }}
                            />
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            target="_blank"
                          >
                            <i
                              className="pi pi-instagram"
                              style={{ fontSize: "1em" }}
                            />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-12">
                  <div className="footer-link-movietime">
                    <h2> Our Link</h2>
                    <ul className="mt-2">
                      <li>
                        <a href="/about-us">About us</a>
                      </li>
                      <li>
                        <a href="/faq">FAQ’s</a>
                      </li>
                      <li>
                        <a href="/careers">Careers</a>
                      </li>
                      <li>
                        <a href="/contact-us">Contact Us </a>
                      </li>
                      <li>
                        <a href="/privacy-policy">Privacy Policy </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-3 col-sm-12">
                  <div className="footer-link-movietime">
                    <h2>Other Link</h2>
                    <ul className="mt-2">
                      <li>
                        <a href="/advertise">Advertise</a>
                      </li>
                      {/* <li>
                        <a href="/private-screening">Private Screening</a>
                      </li> */}
                      {/* <li>
                        <a href="/corporate-booking">Corporate Booking</a>
                      </li> */}
                      {/* <li>
                        <a href="/school-booking">School Booking</a>
                      </li> */}
                      <li>
                        <a href="/terms-conditions">Terms & Conditions</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-3 col-sm-12">
                  <div className="app-store">
                    <h2>Download Our App</h2>
                    <div className="d-flex mt-2">
                      {/* <a href={isMobile ? 'http://onelink.to/e9ptem' : "https://play.google.com/store/apps/details?id=com.movietime&hl=en"} target="_blank"> */}
                        <Image
                          src="/assets/icons/Google-Play.svg"
                          alt="play-store"
                          width={125}
                          height={30}
                          className="store-gp"
                        />
                      {/* </a> */}
                      {/* <a href={isMobile ? 'http://onelink.to/e9ptem' : "https://apps.apple.com/in/app/movietime-cinema/id1547424499"} target="_blank"> */}
                        {" "}
                        <Image
                          src="/assets/icons/App-Store.svg"
                          alt="play-store"
                          width={125}
                          height={30}
                        />
                      {/* </a> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="media-tabview">
                    <ul>
                      <li>
                        {/* <a href="http://onelink.to/e9ptem" target="_blank"> */}
                          <Image
                            src="/assets/icons/facebook.svg"
                            alt="facebook"
                            width={50}
                            height={50}
                            className="img-fluid  new-logo"
                          />
                        {/* </a> */}
                      </li>
                      <li>
                        <a href="#" target="_blank">
                          <Image
                            src="/assets/icons/instagram.svg"
                            alt="instagram"
                            width={50}
                            height={50}
                            className="img-fluid  new-logo"
                          />
                        </a>
                      </li>
                      <li>
                        <a href="#" target="_blank">
                          <Image
                            src="/assets/icons/youtube.svg"
                            alt="youtube"
                            width={50}
                            height={50}
                            className="img-fluid  new-logo"
                          />
                        </a>
                      </li>
                      <li>
                        <a href="#" target="_blank">
                          <Image
                            src="/assets/icons/twitter.svg"
                            alt="twitter"
                            width={50}
                            height={50}
                            className="img-fluid new-logo"
                          />
                        </a>
                      </li>
                      <li>
                        <a href="#" target="_blank">
                          <Image
                            src="/assets/icons/linkeed.svg"
                            alt="linkedin"
                            width={50}
                            height={50}
                            className="img-fluid  new-logo"
                          />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
