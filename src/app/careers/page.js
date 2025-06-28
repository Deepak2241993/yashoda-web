"use client"
import { Dropdown } from "primereact/dropdown"
import { InputText } from "primereact/inputtext"
import { FileUpload } from "primereact/fileupload";


const Careers = () => {
  return (
    <div>
      <section className="cinemas-bg banner-Mobile">
        <div className="container view-container">
          <div className="d-flex justify-content-between filter-cinemas py-3">
            <div className="cinemas-banner">
              <h3>Careers</h3>
            </div>
            <div></div>
          </div>
        </div>
      </section>
      <div className="container view-container my-3">
        <section id="company">
          <div className="row reserve-phn">
            <div className="col-md-12 col-sm-12">
              <div className="career-form">
                <form
                  action=""
                  className="row"
                >
                  <div className="col-md-6">
                    <div className="mobile">
                      <span className="p-float-label">
                        <InputText
                          id="name"
                          maxLength={32}
                        />
                        <label htmlFor="name" className="advertise-label">
                          Name
                        </label>
                      </span>
                      <div className="advertise-icon">
                        <img src="/assets/icons/profile.svg" alt="" className="img-fluid" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mobile">
                      <span className="p-float-label">
                        <InputText
                          id="email"
                          maxLength={32}
                        />
                        <label htmlFor="name" className="advertise-label">
                          Email
                        </label>
                      </span>
                      <div className="advertise-icon">
                        <img src="/assets/icons/mail.svg" alt="" className="img-fluid" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mobile">
                      <span className="p-float-label">
                        <InputText
                          id="mobile"
                          maxLength={10}
                          // value={careerFormik.values.mobile}
                          // onChange={careerFormik.handleChange}
                          // keyfilter={/^\d*$/}
                        />
                        <label htmlFor="name" className="advertise-label">
                          Mobile No
                        </label>
                      </span>
                      <div className="advertise-icon">
                        <img src="/assets/icons/phone.svg" alt="" className="img-fluid" />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="organisation-feild ">
                      <span className="p-float-label">
                        <Dropdown
                          id="depart"
                        />
                        <label htmlFor="depart" className="dropdowns-type">
                          Department
                        </label>
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mobiles carrers-sub">
                      <span className="p-float-label">
                        <FileUpload
                          id="resume"
                          // mode="basic"
                          // name="demo[]"
                          chooseLabel={
                            <span>
                              <img
                                src="/assets/icons/attachment.svg"
                                alt="Upload Icon"
                                width="24"
                                height="24"
                              />{" "}
                              Upload Resume
                            </span>
                          }
                          accept=".pdf"
                          maxFileSize={1000000}
                          // onSelect={onBasicUpload}
                          // disabled={careerFormik.values.name ? false : true}
                        />
                      </span>
                      {/* {getAdvertisetFormErrorMessage("resume")} */}
                    </div>
                  </div>
                  <div className="careers-form-divider"></div>
                  <div className="post-from">
                    <div className="cancel">
                      <button
                        className="careers-cancel light-theme-button"
                        type="button"
                        // style={
                        //   theme === "inoxTheme"
                        //     ? { backgroundColor: "#DCE2EF" }
                        //     : { backgroundColor: "#FFF0D6" }
                        // }
                        // onClick={() => {
                        //   handleChangeViewMode(0);
                        //   careerFormik.resetForm();
                        //   careerFormik.setFieldValue("resume", "");
                        //   localStorage.removeItem('resume');
                        //   hitGa("career_apply_job_cancel");
                        // }}
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="Submit">
                      <button
                        // className={loading ? 'submit-careers btn-opacity': "submit-careers"}
                        className="submit-careers dark-theme-button"
                        type="submit"
                        // onClick={() => hitCareerGa("career_apply_job_submit")}
                      >
                         Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Careers