'use client'
import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { useFormik } from "formik";
import * as appConstants from "../../../constants/index";
import axios from "axios";
import swal from "sweetalert";
import Cookies from "js-cookie";


const PersonalDetails = (profileDetails) => {
  const profile = profileDetails.profile;
  const [viewMode1, setViewMode1] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cookies, setCookies] = useState(null);
  const [loginInfo, setLoginInfo] = useState(null)
  const maritalOption = [
    { name: "Married", code: "Married" },
    { name: "Unmarried", code: "Unmarried" },
  ];
  const genderOption = [
    { name: "Male ", code: "Male" },
    { name: "Female", code: "Female" },
    { name: "Other ", code: "Other" },
  ];

  // console.log("loginInfo", loginInfo);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCookies(Cookies);
      const loginInfo = cookies?.get("loginInfo") && JSON?.parse(cookies?.get("loginInfo"));
      setLoginInfo(loginInfo)
    }
  }, []);

  useEffect(() => {
    if (viewMode1 === 1) {
      personalDetailsFormik.setFieldValue("name", profile?.data?.un);
      personalDetailsFormik.setFieldValue("email", profile?.data?.em);
      personalDetailsFormik.setFieldValue("gender", profile?.data?.gd);
      personalDetailsFormik.setFieldValue("maritalStatus", profile?.data?.ms);
      // personalDetailsFormik.setFieldValue("dob", new Date(profile?.data?.dob));
      // personalDetailsFormik.setFieldValue("doa", new Date(profile?.data?.doa));

      const exactMinDate = new Date();
      exactMinDate.setFullYear(exactMinDate.getFullYear() - 13);
      exactMinDate.setHours(0, 0, 0, 0);

      const minAnniversaryDate = new Date(personalDetailsFormik.values.dob);
      minAnniversaryDate.setFullYear(minAnniversaryDate.getFullYear() + 18);

      const dobValue = profile?.data?.dob
        ? new Date(profile.data.dob)
        : exactMinDate;
      const doaValue = profile?.data?.doa
        ? new Date(profile.data.doa)
        : new Date();
      personalDetailsFormik.setFieldValue("dob", dobValue);
      personalDetailsFormik.setFieldValue("doa", doaValue);
    }
  }, [viewMode1]);

  const personalDetailsFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      gender: "",
      maritalStatus: "",
      dob: "",
      doa: "",
    },
    validate: (data) => {
      let errors = {};
      let nameVal;
      if (data?.name?.length) {
        nameVal = data?.name?.split(" ");
        // console.log("name", nameVal?.length, nameVal);
      }
      if (!data?.name) {
        errors.name = "Please enter your name";
      } else if (nameVal?.length == 1) {
        errors.name = "Please enter your full name";
      } else if (nameVal?.length > 1 && nameVal[1] === "") {
        errors.name = "Last Name is mandatory";
      }
      if (!data.email) {
        errors.email = "Please enter your email";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)
      ) {
        errors.email = "Invalid email address.";
      }
      if (!data.gender) {
        errors.gender = "Please select gender";
      }
      if (!data.maritalStatus) {
        errors.maritalStatus = "Please select marital status";
      }
      const timeDifference =
        new Date(data?.doa)?.getTime() - new Date(data?.dob)?.getTime();
      const eighteenYearsInMillis = 18 * 365 * 24 * 60 * 60 * 1000;
      const timeComp = eighteenYearsInMillis - timeDifference;
      if (!data.dob) {
        errors.dob = "Please select date of birth";
      }
      if (
        !data.doa &&
        personalDetailsFormik.values.maritalStatus === "Married"
      ) {
        errors.doa = "Please select marriage anniversary";
      } else if (
        personalDetailsFormik.values.maritalStatus === "Married" &&
        data.doa &&
        timeComp > 0
      ) {
        errors.doa = "Anniversary date must be 18 years greater than DOB.";
      }
      // console.log("erroe", timeComp);
      return errors;
    },
    onSubmit: (data) => {
      editProfileRequest(data);
      // console.log("formikData", data);
    },
  });
  const isPersonalDetailsFormFieldValid = (name) =>
    !!(
      personalDetailsFormik.touched[name] && personalDetailsFormik.errors[name]
    );
  const getPersonalDetailsFormErrorMessage = (name) => {
    return (
      isPersonalDetailsFormFieldValid(name) && (
        <small className="p-error">{personalDetailsFormik.errors[name]}</small>
      )
    );
  };
  const editProfileRequest = async (data) => {
    const inputDobDate = data.dob;

    const day = inputDobDate.getDate();
    const month = inputDobDate.getMonth() + 1;
    const year = inputDobDate.getFullYear();
    const finalDate = `${day}-${month}-${year}`;

    const inputDoaDate = data.doa;
    const doaday = inputDoaDate.getDate();
    const doamonth = inputDoaDate.getMonth() + 1;
    const doayear = inputDoaDate.getFullYear();
    const finalDoaDate = `${doaday}-${doamonth}-${doayear}`;
    const postData = {
      name: data.name,
      email: data.email,
      gender: data.gender,
      maritalStatus: data.maritalStatus,
      dob: finalDate,
      doa: data.maritalStatus === "Married" ? finalDoaDate : "",
    };
    try {
      await axios
        .post(`${appConstants.BASE_URL}v1/user/edit`, postData, {
          headers: {
            Authorization: `Bearer ${cookies?.get("token")}`,
            chain: appConstants.chain,
            city: cookies?.get("city"),
            appVersion: appConstants.appVersion,
            platform: '',
            country: appConstants.countryName,
          },
        })
        .then((res) => {
          const dt = res.data;
          if (dt.result === "success") {
            const updatedUerInfo = {
              mob: loginInfo?.data.mob,
              ms: data.maritalStatus,
              dob: finalDate,
              em: data.email,
              un: data.name,
              wopt: loginInfo?.data.wopt,
              gd: data.gender,
              token: loginInfo?.data.token,
            };
            const updatedData = { ...loginInfo, data: updatedUerInfo };
            // console.log("updatedData", updatedData);
            cookies.set("loginInfo", JSON.stringify(updatedData));
            // dispatch(setViewMode(Math.floor(10000 + Math.random() * 90000)));
            swal({
              text: dt.msg,
              timer: 2000,
              icon: "success",
              buttons: false,
            });
            setViewMode1(0);
          } else {
            swal({
              text: dt.msg,
              timer: 2000,
              icon: "error",
              buttons: false,
            });
            setLoading(false);
          }
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  // Calculate the exact date 18 years ago from today
  const exactMinDate = new Date();
  exactMinDate.setFullYear(exactMinDate.getFullYear() - 13);
  exactMinDate.setHours(0, 0, 0, 0);

  const minAnniversaryDate = new Date(personalDetailsFormik.values.dob);
  minAnniversaryDate.setFullYear(minAnniversaryDate.getFullYear() + 18);
  minAnniversaryDate.setHours(0, 0, 0, 0);

  const presonalDetailsForm = () => {
    return (
      <>
        <div className="conatct-head">
          <div className="contact-title">
            <h3>
              <span
                className="pointer rightarrow"
                onClick={() => {
                  personalDetailsFormik.resetForm();
                  setViewMode1(0);
                }}
              >
                {/* <img src={ArrowRight} alt="" className="img-fluid" /> */}
              </span>{" "}
              Edit Details
            </h3>
          </div>
        </div>
        <div className="profile-divider"></div>
        <form onSubmit={personalDetailsFormik.handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="mobile">
                <span className="p-float-label">
                  <InputText
                    id="name"
                    value={personalDetailsFormik.values.name}
                    onChange={personalDetailsFormik.handleChange}
                  />
                  <label htmlFor="ssn_input">Name</label>
                </span>
                <div className="advertise-icon">
                  {/* <img src={Profile} alt="" className="img-fluid" /> */}
                </div>
                {getPersonalDetailsFormErrorMessage("name")}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mobile">
                <span className="p-float-label">
                  <InputText
                    id="email"
                    value={personalDetailsFormik.values.email}
                    onChange={personalDetailsFormik.handleChange}
                  />
                  <label htmlFor="ssn_input">Email ID</label>
                </span>
                <div className="advertise-icon">
                  {/* <img src={mail} alt="" className="img-fluid" /> */}
                </div>
                {getPersonalDetailsFormErrorMessage("email")}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mobile">
                <span className="p-float-label">
                  <InputText
                    id="mobile"
                    value={profile?.data?.mob}
                    onChange={personalDetailsFormik.handleChange}
                    disabled
                  />
                  <label htmlFor="ssn_input">Mobile No.</label>
                </span>
                <div className="advertise-icon">
                  {/* <img src={phone} alt="" className="img-fluid" /> */}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="organisation-feild now-right ">
                <div className="mobiless">
                  <span className="p-float-label">
                    <Dropdown
                      id="gender"
                      options={genderOption}
                      value={personalDetailsFormik.values.gender}
                      onChange={personalDetailsFormik.handleChange}
                      optionLabel="name"
                      optionValue="code"
                    />
                    <div className="custom-dropdown-arrow">
                      {/* <img src={custoArrow} alt="" className="" /> */}
                    </div>
                    <label htmlFor="ssn_input" className="dropdowns-type">
                      Gender
                    </label>
                  </span>
                  {getPersonalDetailsFormErrorMessage("gender")}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="organisation-feild now-right">
                <span className="p-float-label">
                  <Dropdown
                    id="maritalStatus"
                    options={maritalOption}
                    value={personalDetailsFormik.values.maritalStatus}
                    onChange={personalDetailsFormik.handleChange}
                    optionLabel="name"
                    optionValue="code"
                  />
                  <div className="custom-dropdown-arrow">
                    {/* <img src={custoArrow} alt="" className="" /> */}
                  </div>
                  <label htmlFor="ssn_input" className="dropdowns-type">
                    Marital Status
                  </label>
                </span>
                {getPersonalDetailsFormErrorMessage("maritalStatus")}
              </div>
            </div>
            <div className="col-md-6">
              <div className="select-date-search">
                <div className="fields-search">
                  <div className="mobile">
                    <span className="p-float-label">
                      <Calendar
                        id="dob"
                        value={personalDetailsFormik.values.dob}
                        onChange={personalDetailsFormik.handleChange}
                        dateFormat="dd-mm-yy"
                        maxDate={exactMinDate} // Up to the exact 18th birthday
                        showIcon
                        // icon={<img src={calendarIcon} alt="Calendar Icon" />}
                      />
                      <label htmlFor="ssn_input">Date Of Birth</label>
                    </span>
                    {getPersonalDetailsFormErrorMessage("dob")}
                  </div>
                </div>
              </div>
            </div>
            {personalDetailsFormik.values.maritalStatus === "Married" ||
              personalDetailsFormik.values.maritalStatus === "Married" ? (
              <div className="col-md-6">
                <div className="select-date-search">
                  <div className="fields-search">
                    <div className="mobile">
                      <span className="p-float-label">
                        <Calendar
                          // id="doa"
                          // value={personalDetailsFormik.values.doa}
                          // onChange={personalDetailsFormik.handleChange}
                          // dateFormat="dd-mm-yy"
                          // // icon='pi pi-calendar'
                          // showIcon
                          // icon={<img src={calendarIcon} alt="Calendar Icon" />}

                          id="doa"
                          value={personalDetailsFormik.values.doa}
                          onChange={personalDetailsFormik.handleChange}
                          dateFormat="dd-mm-yy"
                          minDate={minAnniversaryDate} // Disable future dates
                          showIcon
                          // icon={<img src={calendarIcon} alt="Calendar Icon" />}
                        />
                        <label htmlFor="ssn_input">Marriage Anniversary</label>
                      </span>
                      {getPersonalDetailsFormErrorMessage("doa")}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="col-md-12">
              <div className="edit-divider"></div>
              <div className="edit-profile">
                <div className="save-edit-btn">
                  {/* <AlsoAddBtn
                    className="cancel-btn-edit"
                    type="button"
                    onClick={() => {
                      setViewMode1(0);
                      personalDetailsFormik.resetForm();
                    }}
                  >
                    Cancel
                  </AlsoAddBtn> */}
                </div>
                <div className="save-btn-edits">
                  {/* <DarkButton
                    className={
                      loading ? "save-btn-edit btn-opacity" : "save-btn-edit"
                    }
                    type="submit"
                  >
                    Save
                  </DarkButton> */}
                </div>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  };
  return (
    <>
      <div className="information-personal">
        {viewMode1 === 0 ? (
          <>
            <div className="conatct-head">
              <div className="contact-title">
                <h3>Contact Information</h3>
              </div>
              <div
                className="edit-details pointer"
                onClick={() => setViewMode1(1)}
              >
                <h3>Edit Details</h3>
              </div>
            </div>
            <div className="profile-divider"></div>
            <div className="personal-details-profile">
              <div className="filed-details">
                <h6>Full Name</h6>
              </div>
              <div className="fill-details">
                <h6>{profile?.data?.un}</h6>
              </div>
            </div>
            <div className="personal-details-profile">
              <div className="filed-details">
                <h6>Email</h6>
              </div>
              <div className="fill-details">
                <h6>{profile?.data?.em}</h6>
              </div>
            </div>
            <div className="personal-details-profile">
              <div className="filed-details">
                <h6>Phone</h6>
              </div>
              <div className="fill-details">
                <h6>{profile?.data?.mob}</h6>
              </div>
            </div>
            <div className="personal-details-profile">
              <div className="filed-details">
                <h6>Gender</h6>
              </div>
              <div className="fill-details">
                <h6>{profile?.data?.gd}</h6>
              </div>
            </div>
            <div className="personal-details-profile">
              <div className="filed-details">
                <h6>Marital Status</h6>
              </div>
              <div className="fill-details">
                <h6>{profile?.data?.ms}</h6>
              </div>
            </div>
            <div className="personal-details-profile">
              <div className="filed-details">
                <h6>Date of Birth</h6>
              </div>
              <div className="fill-details">
                <h6>{profile?.data?.dob}</h6>
              </div>
            </div>
            {profile?.data?.ms === "Married" ? (
              <div className="personal-details-profile">
                <div className="filed-details">
                  <h6>Anniversary</h6>
                </div>
                <div className="fill-details">
                  <h6>{profile?.data?.doa}</h6>
                </div>
              </div>
            ) : (
              ""
            )}
            {/* <div className="delete-account">
              <h6>Delete Account</h6>
            </div> */}
          </>
        ) : (
          presonalDetailsForm()
        )}
      </div>
    </>
  );
};

export default PersonalDetails;
