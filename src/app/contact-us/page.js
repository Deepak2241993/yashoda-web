"use client";
import { postApiService } from "@/utils/api";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import swal from "sweetalert";

const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  const feedback = [
    { name: "Complaint", code: "Complaint" },
    { name: "Suggestion", code: "Suggestion" },
    { name: "Compliment", code: "Compliment" },
    { name: "Enquiry", code: "Enquiry" },
    { name: "Others", code: "Others" },
    { name: "Copy To Self", code: "Copy To Self" },
  ];

  const feedbackFormik = useFormik({
    initialValues: {
      email: "",
      mobile: "",
      name: "",
      feedType: "",
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
      } else if (!/(0\/91)?[4-9][0-9]{9}/.test(data.mobile)) {
        errors.mobile = 'Please enter valid mobile number".';
      }
      if (!data.feedType) {
        errors.feedType = "Please select feedback type";
      }
      if (!data.msg) {
        errors.msg = "Please enter your message";
      }
      return errors;
    },
    onSubmit: (data) => {
      feedbackRequest(data);
    },
  });
  const isAdvertiseFormFieldValid = (name) =>
    !!(feedbackFormik.touched[name] && feedbackFormik.errors[name]);
  const getAdvertisetFormErrorMessage = (name) => {
    return (
      isAdvertiseFormFieldValid(name) && (
        <small className="p-error">{feedbackFormik.errors[name]}</small>
      )
    );
  };

  const feedbackRequest = (data) => {
    setLoading(true);
    const cityPostData = {
      mobile: data.mobile,
      email: data.email,
      name: data.name,
      type: data.feedType,
      comments: data.msg,
    };
    postApiService(
      cityPostData,
      "v1/web/feedback/add",
      ptValue,
      Cookies.get("city")
    ).then((res) => {
      // setTermsAndConditionsData(res?.output?.staticHtml?.Terms_Conditions?.value);
      const dt = res.output
      feedbackFormik.resetForm();
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
              <h3>Contact Us</h3>
            </div>
            <div></div>
          </div>
        </div>
      </section>
      <section className="pb-30 mfeedback-top">
        <div className="container view-container">
          <div className="row reserve-phn">
            <div className="col-md-12">
              <div className="bulk-from">
                <form onSubmit={feedbackFormik.handleSubmit} className="row">
                  <div className="col-md-6">
                    <div className="mobile">
                      <span className="p-float-label">
                        <InputText
                          id="name"
                          value={feedbackFormik.values.name}
                          onChange={feedbackFormik.handleChange}
                          maxLength={32}
                        />
                        <label htmlFor="ssn_input">Name</label>
                      </span>
                      {getAdvertisetFormErrorMessage("name")}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mobile">
                      <span className="p-float-label">
                        <InputText
                          id="mobile"
                          value={feedbackFormik.values.mobile}
                          onChange={feedbackFormik.handleChange}
                          maxLength={10}
                          keyfilter={/^\d*$/}
                        />
                        <label htmlFor="ssn_input">Mobile No.</label>
                      </span>
                      {getAdvertisetFormErrorMessage("mobile")}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mobile">
                      <span className="p-float-label">
                        <InputText
                          id="email"
                          value={feedbackFormik.values.email}
                          onChange={feedbackFormik.handleChange}
                        />
                        <label htmlFor="ssn_input">Email ID</label>
                      </span>
                      {getAdvertisetFormErrorMessage("email")}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="organisation-feild">
                      <span className="p-float-label ">
                        <Dropdown
                          id="feedType"
                          options={feedback}
                          value={feedbackFormik.values.feedType}
                          onChange={feedbackFormik.handleChange}
                          optionLabel="name"
                          optionValue="code"
                        />
                        <label htmlFor="ssn_input" className="dropdowns-type">
                          Feedback Type
                        </label>
                      </span>
                      <span>{getAdvertisetFormErrorMessage("feedType")}</span>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mobile">
                      <span className="p-float-label feed-space ">
                        <InputText
                          id="msg"
                          value={feedbackFormik.values.msg}
                          onChange={feedbackFormik.handleChange}
                        />
                        <label htmlFor="ssn_input">Write a Message</label>
                      </span>
                      {getAdvertisetFormErrorMessage("msg")}
                    </div>
                  </div>
                  <div className="bulk-contact bulk-mobile">
                    <div className="contact-details">
                      <p>
                        <span className="icon-mail">
                          <img
                            src="/assets/icons/phone.svg"
                            alt=""
                            className="img-fluid"
                            style={{ height: "0.93rem" }}
                          />
                        </span>
                        {"+91 9068853335"}
                      </p>
                      <p>
                        <span className="icon-mail">
                          <img
                            src="/assets/icons/mail.svg"
                            alt=""
                            className="img-fluid"
                          />
                        </span>
                        {" info@movietimecinemas.in"}
                      </p>
                    </div>
                    <div className="bulk-submit">
                      <button
                        className={
                          loading
                            ? "btn-opacity border-0 rounded px-3 py-2 dark-theme-button"
                            : "border-0 rounded px-3 py-2 dark-theme-button"
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
      </section>
    </div>
  );
};

export default ContactUs;
