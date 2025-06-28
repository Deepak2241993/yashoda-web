"use client";
import React, { useContext, useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { InputText } from "primereact/inputtext";
import { useFormik } from "formik";
import * as appConstants from "../constants/index";
import axios from "axios";
import ConfirmMessageDialog from "../global-functions/ConfirmMessageDialog";
import { Dialog } from "primereact/dialog";
import Image from "next/image";
import { postApiService } from "../utils/api";
import Cookies from "js-cookie";
import Link from "next/link";
import { MyContext } from "@/context/ThemeContext";

const Login = ({ loginViewMode = false, onHide = () => {} }) => {
  const {isMobile, handleLoginChange } = useContext(MyContext);
  const ptValue = isMobile ? "MSITE" : "WEBSITE";
  const [mobileOtp, setMobileOtp] = useState("");
  const [viewMode, setViewMode] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sentOTPData, setSentOTPData] = useState(null);
  const [reSentOTPData, setReSentOTPData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [timeCounter, setTimeCounter] = useState(null);


  useEffect(() => {
    if (timeCounter && timeCounter > 0) {
      setTimeout(() => {
        setTimeCounter(timeCounter - 1);
      }, 1000);
    }
  }, [timeCounter]);

  const sendOTPFormik = useFormik({
    initialValues: {
      mobileInput: "",
    },

    validate: (data) => {
      let errors = {};

      if (!data.mobileInput) {
        errors.mobileInput = "Please enter phone number.";
      } else if (data.mobileInput.length < 10) {
        errors.mobileInput = "Phone number must be in 10 digits.";
      }
      // console.log('errors', errors)
      return errors;
    },

    onSubmit: (data) => {
      sendOTPService(data);
      // console.log("loginData", data);
    },
  });
  const isMobileFormFieldValid = (name) =>
    !!(sendOTPFormik.touched[name] && sendOTPFormik.errors[name]);
  const getMobiletFormErrorMessage = (name) => {
    return (
      isMobileFormFieldValid(name) && (
        <small className="p-errors">{sendOTPFormik.errors[name]}</small>
      )
    );
  };

  const registerFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
    },

    validate: (data) => {
      let errors = {};

      let nameVal;
      if (data?.name?.length) {
        nameVal = data?.name?.split(" ");
        // console.log("name", nameVal?.length, nameVal);
      }

      if (!data.name && sentOTPData.nu === "true") {
        errors.name = "Please enter name.";
      } else if (nameVal?.length == 1) {
        errors.name = "Please enter your full name";
      } else if (nameVal?.length > 1 && nameVal[1] === "") {
        errors.name = "Last Name is mandatory";
      }

      if (!data.email && sentOTPData.nu === "true") {
        errors.email = "Please enter email Id";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email) &&
        sentOTPData.nu === "true"
      ) {
        errors.email = "Invalid email address. E.g. example@email.com";
      }

      return errors;
    },

    onSubmit: (data) => {
      sentOTPData && sentOTPData?.nu === "true"
        ? registerUserService(data)
        : verifyOTPService(mobileOtp);
      // console.log("loginData", data);
    },
  });
  const isLoginFormFieldValid = (name) =>
    !!(registerFormik.touched[name] && registerFormik.errors[name]);
  const getLogintFormErrorMessage = (name) => {
    return (
      isLoginFormFieldValid(name) && (
        <small className="p-errors">{registerFormik.errors[name]}</small>
      )
    );
  };

  // ======= send otp service data ===== ==== ====
  const sendOTPService = (data) => {
    setLoading(true);
    const postData = {
      mobile: data.mobileInput,
    };

    try {
      postApiService(postData, "v1/auth/login", ptValue).then((res) => {
        const ndt = res.output;
        if (res.result === "success") {
          setTimeCounter(30);
          setSuccessMsg(res);
          setShowSuccessAlert(true);
          setTimeout(() => setShowSuccessAlert(false), 2500);
          setSentOTPData(res.output);
          setViewMode(1);
          setLoading(false);
        } else if (res.result === "error" || res.result === "dialog") {
          setErrorMsg(res);
          setShowErrorAlert(true);
          setTimeout(() => setShowErrorAlert(false), 2500);
          setLoading(false);
        }
      });
    } catch (error) {
      // swal({
      //   text: error.message,
      //   timer: 2000,
      //   icon: "error",
      //   buttons: false,
      // });
    }
  };

  // ===== send otp with mobile services ===========
  const reSendOTPService = async () => {
    setLoading(true);
    const postData = {
      mobile: sendOTPFormik.values.mobileInput,
    };
    try {
      postApiService(postData, "v1/auth/otp", ptValue).then((res) => {
        const ndt = res.output;
        if (res.result === "success") {
          setTimeCounter(30);
          setSuccessMsg(dt);
          setShowSuccessAlert(true);
          setTimeout(() => setShowSuccessAlert(false), 2500);
          setReSentOTPData(dt.output);
          setViewMode(1);
          setLoading(false);
        } else if (res.result === "error" || res.result === "dialog") {
          setErrorMsg(dt);
          setShowErrorAlert(true);
          setTimeout(() => setShowErrorAlert(false), 2500);
          setLoading(false);
        }
      });
    } catch (error) {
      // swal({
      //   text: error.message,
      //   timer: 2000,
      //   icon: "error",
      //   buttons: false,
      //
    }
  };

  // ===== send otp with mobile services ===========
  const verifyOTPService = async (data) => {
    setLoading(true);
    const postData = {
      mobile: sendOTPFormik.values.mobileInput,
      otp: data,
    };

    try {
      postApiService(postData, "v1/auth/verify", ptValue).then((res) => {
        const ndt = res.output;
        if (res.result === "success") {
          setSuccessMsg(res);
          setShowSuccessAlert(true);
          setTimeout(() => setShowSuccessAlert(false), 2500);
          Cookies.set("loginInfo", JSON.stringify(res.output));
          Cookies.set("token", res.output?.access?.token);
          Cookies.set("refrace_token", res.output?.refresh?.token);
          const randomVal = Math.floor(Math.random() * 900)
          handleLoginChange(randomVal)
          setTimeout(() => {
            onHide();
          }, 1500);
        } else if (res.result === "error" || res.result === "dialog") {
          setErrorMsg(res);
          setShowErrorAlert(true);
          setTimeout(() => setShowErrorAlert(false), 2500);
          setLoading(false);
        }
      });
    } catch (error) {
      // swal({
      //   text: error.message,
      //   timer: 2000,
      //   icon: "error",
      //   buttons: false,
      // });
    }
  };

  // ===== send otp with mobile services ===========
  const registerUserService = async (data) => {
    setLoading(true);
    const postData = {
      name: data.name,
      email: data.email,
      mobile: sendOTPFormik.values.mobileInput,
      otp: mobileOtp,
    };

    try {
      postApiService(postData, "v1/auth/verify", ptValue).then((res) => {
        const ndt = res.output;
        if (res.result === "success") {
          setSuccessMsg(res);
          setShowSuccessAlert(true);
          setTimeout(() => setShowSuccessAlert(false), 2500);
          Cookies.set("loginInfo", JSON.stringify(res.output));
          Cookies.set("token", res.output?.access?.token);
          Cookies.set("refrace_token", res.output?.refresh?.token);
          const randomVal = Math.floor(Math.random() * 900)
          handleLoginChange(randomVal)
          setTimeout(() => {
            onHide();
          }, 1500);
        } else if (res.result === "error" || res.result === "dialog") {
          setErrorMsg(res);
          setShowErrorAlert(true);
          setTimeout(() => setShowErrorAlert(false), 2500);
          setLoading(false);
        }
      });
    } catch (error) {
      // swal({
      //   text: error.message,
      //   timer: 2000,
      //   icon: "error",
      //   buttons: false,
      // });
    }
  };

  const cancelTrnsService = async () => {
    const postData = {
      qr: Cookies.get("isQR") && isMobile ? "YES" : "NO",
      bookType: Cookies.get("booking_type"),
      transId: Cookies.get("transid"),
      bookingId: Cookies.get("bookingid"),
      //ccode: cinemacode,
      ccode: Cookies.get("theaterId"),
    };

    await axios
      .post(`${appConstants.BASE_URL}v1/booking/ticketing/cancel`, postData, {
        headers: {
          chain: appConstants.chain,
          city: Cookies.get("city"),
          Authorization: `Bearer ${Cookies.get("token") || ""}`,
          appVersion: appConstants.appVersion,
          platform: '',
          country: appConstants.countryName,
        },
      })
      .then((res) => {
        const dt = res.data;
        if (!isMobile) {
          Cookies.remove("isQR");
        }
      })
      .catch((error) => {
        const err = error?.response;
        if (err?.status === 403) {
          refraceTokenService();
          console.log(
            "Forbidden: You do not have permission to access this resource."
          );
        } else {
          console.log("Error:", error.message);
        }
        setLoading(false);
      });
  };

  const signInUi = () => {
    return (
      <div className="col-md-12 col-sm-12">
        <div className="cross-icon mx-2">
          <Link href="/">
            <span onClick={onHide}>
              <i className="pi pi-times"></i>
            </span>
          </Link>
        </div>
        <div className="cinema-house mobile-login-M">
          {/* <img
            src={cinemaHouse}
            alt=""
            className="img-fluid desktop-login-icon"
          /> */}
          <img
            src="/assets/brand/mt-logo.png"
            alt=""
            className="img-fluid mobile-login-icon"
          />
          <h1 className="desktop-view-login-head">Verify Phone Number</h1>
          <h1 className="Mobile-view-login-head">
            Verify<br></br> Phone Number
          </h1>
          <p className="desktop-view-login-content">
            Enter your phone number to proceed
          </p>
          <p className="Mobile-view-login-content">
            to continue, enter your phone number
          </p>
          <form onSubmit={sendOTPFormik.handleSubmit}>
            <div className="mobile">
              <span className="p-float-label">
                <InputText
                  id="mobileInput"
                  value={sendOTPFormik.values.mobileInput}
                  onChange={sendOTPFormik.handleChange}
                  maxLength={10}
                  keyfilter={/^\d*$/}
                />
                <label htmlFor="ssn_input">Phone Number</label>
              </span>
              <div className="phone-icon">
                <Image
                  src="/assets/icons/phone.svg"
                  alt=""
                  className="img-fluid"
                  width={15}
                  height={15}
                />
              </div>
              {getMobiletFormErrorMessage("mobileInput")}
            </div>
            <div className="register-btn">
              <button className="btn-proceeds dark-theme-button" type="submit">
                Proceed
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const otpVerificationUI = () => {
    return (
      <div className="col-md-12 col-sm-12">
        <div className="cross-icon mx-2">
          <Link href="/">
            <span onClick={onHide}>
              <i className="pi pi-times"></i>
            </span>
          </Link>
        </div>
        <div className="cinema-house mobile-login-M Register-modal-desk register-track">
          {/* <img
            src={cinemaHouse}
            alt=""
            className="img-fluid register-otp desktop-login-icon"
          /> */}
          <img
            src="/assets/brand/mt-logo.png"
            alt=""
            className="img-fluid mobile-login-icon"
          />
          <h1 className="desktop-view-login-head">Verify OTP</h1>
          <h1 className="Mobile-view-login-head">
            Verify<br></br> OTP Code
          </h1>
          {/* <p className="otp-content desktop-view-login-content">
            We’ve sent a code to your phone number
          </p> */}
          <p className="Mobile-view-login-content">
            We’ve sent a code to your phone number
          </p>
          <h6 className="number-desktop">
            OTP on +91 {sendOTPFormik.values.mobileInput}
          </h6>
          <div className="otp-feild">
            <OtpInput
              value={mobileOtp}
              onChange={(e) => {
                const numericOtp = e.replace(/\D/g, "");
                setMobileOtp(numericOtp);
                if (sentOTPData.nu === "false" && numericOtp?.length === 6) {
                  verifyOTPService(numericOtp);
                }
              }}
              inputType="tel"
              numInputs={6}
              inputStyle={{ width: "47px" }}
              className="otp-box"
              isInputNum={true}
              shouldAutoFocus={true}
              renderInput={(props, index) => (
                <input {...props} className="otpfeild" />
              )}
            />
          </div>
          <div className="resend-otp">
            {timeCounter > 0 ? (
              <h6>{`00:${
                timeCounter < 10 ? `0${timeCounter}` : timeCounter
              }`}</h6>
            ) : (
              <h6
                className="show-in-mobile-views"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setMobileOtp("");
                  reSendOTPService();
                }}
              >
                Resend OTP
              </h6>
            )}
          </div>

          <form onSubmit={registerFormik.handleSubmit}>
            {sentOTPData?.nu === "false" ? (
              ""
            ) : (
              <div className="user-verfiy">
                <div className="mobile">
                  <span className="p-float-label">
                    <InputText
                      id="name"
                      value={registerFormik.values.name}
                      onChange={registerFormik.handleChange}
                    />
                    <label htmlFor="ssn_input">Name</label>
                  </span>
                  <div className="phone-icon">
                    <img
                      src="/assets/icons/person-register.svg"
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  {getLogintFormErrorMessage("name")}
                </div>
                <div className="mobile">
                  <span className="p-float-label email-last">
                    <InputText
                      id="email"
                      value={registerFormik.values.email}
                      onChange={registerFormik.handleChange}
                    />
                    <label htmlFor="ssn_input">Email</label>
                  </span>
                  <div className="phone-icon">
                    <img
                      src="/assets/icons/email.svg"
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  {getLogintFormErrorMessage("email")}
                </div>
              </div>
            )}
            <div className="register-btn">
              <button
                className={
                  mobileOtp && mobileOtp?.length === 6
                    ? "btn-proceeds dark-theme-button"
                    : "btn-proceeds dark-theme-button btn-opacity"
                }
                type="submit"
                disabled={mobileOtp && mobileOtp?.length === 6 ? false : true}
              >
                Proceed
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div>
        <ConfirmMessageDialog
          icon={"success"}
          visible={showSuccessAlert}
          onHide={() => setShowSuccessAlert(false)}
          title={successMsg?.result}
          message={successMsg?.msg}
          showConfirmButton={false}
          confirmButtonText={"OK"}
          showCancelButton={false}
          cancelButtonText={"No"}
          onConfirm={() => {
            setShowSuccessAlert(false);
          }}
          onCancel={() => setShowSuccessAlert(false)}
          closable={false}
          timer={2000}
        />
      </div>
      <div>
        <ConfirmMessageDialog
          icon={"error"}
          visible={showErrorAlert}
          onHide={() => setShowErrorAlert(false)}
          title={errorMsg?.result === "dialog" ? "Oops" : errorMsg?.result}
          message={errorMsg?.msg}
          showConfirmButton={false}
          confirmButtonText={"OK"}
          showCancelButton={false}
          cancelButtonText={"No"}
          onConfirm={() => {
            setShowErrorAlert(false);
          }}
          onCancel={() => setShowErrorAlert(false)}
          closable={false}
          timer={2000}
        />
      </div>
      <div className="card flex justify-content-center">
        <div className="">
          <Dialog
            header=""
            visible={loginViewMode}
            showHeader={false}
            closable={false}
            onHide={onHide}
            className="register-mobile"
            blockScroll
          >
            <div className="row p-3">
              {viewMode === 0 ? signInUi() : otpVerificationUI()}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Login;
