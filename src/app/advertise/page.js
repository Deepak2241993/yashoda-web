"use client";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

const Advertise = () => {
  const [loading, setLoading] = useState(false);

  const advertiseFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      msg: "",
    },
    validate: (data) => {
      let errors = {};
      if (!data.name) {
        errors.name = "Please enter your name";
      }
      if (!data.email) {
        errors.email = "Please enter your email";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)
      ) {
        errors.email = "Invalid email address.";
      }
      if (!data.mobile) {
        errors.mobile = "Please enter phone number.";
      } else if (data.mobile.length < 10) {
        errors.mobile = "Mobile no. must be in 10 digits.";
      }
      if (!data.msg) {
        errors.msg = "Please enter your message";
      }
      return errors;
    },
    onSubmit: (data) => {
      // if (loginInfo?.access?.token) {
      advertiseRequest(data);
      // } else {
      //   dispatch(setLoginViewMode({ value: true }));
      // }
    },
  });
  const isAdvertiseFormFieldValid = (name) =>
    !!(advertiseFormik.touched[name] && advertiseFormik.errors[name]);
  const getAdvertisetFormErrorMessage = (name) => {
    return (
      isAdvertiseFormFieldValid(name) && (
        <small className="p-error">{advertiseFormik.errors[name]}</small>
      )
    );
  };

  const advertiseRequest = async (data) => {
    setLoading(true);
    const cityPostData = {
      mobile: data.mobile,
      email: data.email,
      name: data.name,
      advertiseType: "  ",
      organisationType: "  ",
      location: "  ",
      comments: data.msg,
    };
    postApiService(
      cityPostData,
      "v1/web/advertise/add",
      ptValue,
      Cookies.get("city")
    ).then((res) => {
      // console.log("aboutUs", res.output);
      const dt = res.output;
      advertiseFormik.resetForm();
      swal({
        text: res.msg,
        timer: 2000,
        icon: "success",
        buttons: false,
      });
      setLoading(false);
    });
  };

  return (
    <div>
      <section className="cinemas-bg banner-Mobile">
        <div className="container view-container">
          <div className="d-flex justify-content-between filter-cinemas py-3">
            <div className="cinemas-banner">
              <h3>Advertise</h3>
            </div>
            <div></div>
          </div>
        </div>
      </section>
      <section className="ptb25">
        <div className="container view-container">
          <div className="row">
            <div className="col-xl-12 col-md-5 col-12">
              <div className="advertise-from">
                <div className="bulk-from">
                  <form onSubmit={advertiseFormik.handleSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mobile">
                          <span className="p-float-label">
                            <InputText
                              id="name"
                              name="name"
                              value={advertiseFormik.values.name}
                              onChange={advertiseFormik.handleChange}
                              maxLength={32}
                            />
                            <label
                              htmlFor="ssn_input"
                              className="advertise-label"
                            >
                              Name
                            </label>
                          </span>
                          <div className="advertise-icon">
                            <img
                              src="/assets/icons/profile.svg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          {getAdvertisetFormErrorMessage("name")}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mobile">
                          <span className="p-float-label">
                            <InputText
                              id="email"
                              value={advertiseFormik.values.email}
                              onChange={advertiseFormik.handleChange}
                            />
                            <label
                              htmlFor="ssn_input"
                              className="advertise-label"
                            >
                              Email ID
                            </label>
                          </span>
                          <div className="advertise-icon">
                            <img
                              src="/assets/icons/mail.svg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          {getAdvertisetFormErrorMessage("email")}
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mobile">
                          <span className="p-float-label">
                            <InputText
                              id="mobile"
                              value={advertiseFormik.values.mobile}
                              onChange={advertiseFormik.handleChange}
                              maxLength={10}
                              keyfilter={/^\d*$/}
                            />
                            <label
                              htmlFor="ssn_input"
                              className="advertise-label"
                            >
                              Mobile No.
                            </label>
                          </span>
                          <div className="advertise-icon">
                            <img
                              src="/assets/icons/phone.svg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          {getAdvertisetFormErrorMessage("mobile")}
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mobile input-leave adv-msg">
                          <span className="p-float-label">
                            <InputText
                              id="msg"
                              value={advertiseFormik.values.msg}
                              onChange={advertiseFormik.handleChange}
                            />
                            <label
                              htmlFor="ssn_input "
                              className="advertise-label"
                            >
                              Leave your message
                            </label>
                          </span>
                          {getAdvertisetFormErrorMessage("msg")}
                        </div>
                      </div>
                    </div>
                    <div className="advertise-contact">
                      <div className="contact-details"></div>
                      <div className="advertise-submit">
                        <button
                          className={
                            loading
                              ? "advertise-sub btn-opacity dark-theme-button"
                              : "advertise-sub dark-theme-button"
                          }
                          type="submit"
                        >
                          {loading ? (
                            <span>
                              <i
                                className="pi pi-spin pi-spinner"
                                style={{ fontSize: "1em" }}
                              ></i>{" "}
                              Submit Request
                            </span>
                          ) : (
                            "Submit Request"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Advertise;
