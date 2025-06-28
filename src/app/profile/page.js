"use client";
import Image from "next/image";
import { MyContext } from "@/context/ThemeContext";
import React, { useContext, useEffect, useState } from "react";
import PersonalDetails from "./personal-details/PersonalDetails";
import MyBookings from "./my-bookings/MyBookings";
import ConfirmMessageDialog from "@/global-functions/ConfirmMessageDialog";
import { Dialog } from "primereact/dialog";
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";
import { postApiService } from "@/utils/api";


export default function Page() {
  const router = useRouter();
  const { isMobile } = useContext(MyContext);
  const ptValue = isMobile ? "MSITE" : "WEBSITE";
  const [viewMode, setViewMode] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [showMsg, setShowMsg] = useState(null);
  const [logoutModal, setLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cookies, setCookies] = useState(null);
  const [profileDetails, setProfileDetails] = useState(null);


  useEffect(() => {
    getProfileDataService()
    if (typeof window !== 'undefined') {
      setCookies(Cookies);
    }
  }, []);

  const getProfileDataService = () => {
    setLoading(true);
    const cityPostData = {};
    postApiService(cityPostData, "v1/user/profile", ptValue, Cookies.get("city")).then((res) => {
      setProfileDetails(res.output);
      // console.log('profile', res.output)
      setLoading(false);
    });
  };

  const logoutService = async () => {
    if (!cookies) return;

    setLoading(true);

    setShowAlert(true);
    setShowMsg({ title: "Success", msg: "You are logged out successfully" });
    cookies.remove("loginInfo");
    cookies.remove("token");
    cookies.remove("refrace_token");
    setLogoutModal(false);

    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  return (
    <>
      <div className="payment-mobile-header show-in-mobile-view">
        <div className="payment-header-item">
          <span
          onClick={() => {
            router.back();
          }}
          >
            {" "}
            <Image
              src="/assets/icons/arrow-b.svg"
              alt="back icon"
              className=""
              width={30}
              height={30}
            />{" "}
          </span>
          <h4>Profile</h4>
        </div>
        <div className="search-mobile-cinemas"></div>
      </div>
      <section className="profile-border">
        <div className="container view-container">
          <div className="row">
            <div className="col-md-12">
              <div className="profile-box">
                <div className="profile-photo">
                  <img
                    src="/assets/icons/avtar.png"
                    alt=""
                    className="img-fluid"
                  />
                </div>
                <div className="profile-content">
                  <h3>{profileDetails?.data?.un}</h3>
                  <p>{profileDetails?.data?.em}</p>
                  <p>{profileDetails?.data?.mob}</p>
                  <button
                    className="logout-profile"
                    onClick={() => {
                      setLogoutModal(true);
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-profile">
        <div className="container view-container">
          <div className="row">
            <div className="col-md-12">
              <div className="personal-details">
                <ul>
                  <li
                    className={
                      viewMode === 0
                        ? "profile-active bg-light-cinema pointer"
                        : "pointer"
                    }
                    onClick={() => {
                      setViewMode(0);
                    }}
                  >
                    <span className="icon-profile">
                      <Image
                        src="/assets/icons/user-icon.svg"
                        alt="user icon"
                        width={15}
                        height={15}
                        className="img-fluid"
                      />
                    </span>
                    Personal Details
                  </li>
                  <li
                    className={
                      viewMode === 1
                        ? "profile-active bg-light-cinema pointer"
                        : "pointer"
                    }
                    onClick={() => {
                      setViewMode(1);
                    }}
                  >
                    <span className="icon-profile">
                      <img
                        src="/assets/icons/ticket-icon.svg"
                        alt=""
                        className="img-fluid"
                      />
                    </span>
                    My Bookings
                  </li>
                </ul>
                <div className="spaces-divider"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container view-container">
          <div className="row">
            <div className="col-md-12">
              {viewMode === 0 ? (
                <PersonalDetails profile={profileDetails} />
              ) : viewMode === 1 ? (
                <MyBookings />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </section>
      <div className="card flex justify-content-center">
        <Dialog
          visible={logoutModal}
          showHeader={false}
          closable={false}
          className="seat-terms-condition-flow"
          style={{ width: "30vw" }}
          onHide={() => setLogoutModal(false)}
          blockScroll
        >
          <div className="card px-3 pt-2">
            <div className="d-flex justify-content-center">
              <h2 className="logout">
                Are you sure<br></br> to want to logout?
              </h2>
            </div>
            <div className="accpet-btn-flow-seat">
              <button
                className="yes-logout my-2 light-theme-button"
                onClick={() => {
                  setLogoutModal(false);
                }}
              >
                No
              </button>
              <button
                className="yes-logout my-2 dark-theme-button"
                onClick={() => {
                  logoutService();
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </Dialog>
      </div>
      <div>
        <ConfirmMessageDialog
          icon={"success"}
          visible={showAlert}
          onHide={() => setShowAlert(false)}
          title={showMsg?.title}
          message={showMsg?.msg}
          showConfirmButton={true}
          confirmButtonText={"OK"}
          showCancelButton={false}
          cancelButtonText={"No"}
          onConfirm={() => {
            setShowAlert(false);
          }}
          onCancel={() => setShowAlert(false)}
          closable={false}
          timer={2000}
        />
      </div>
    </>
  );
}
