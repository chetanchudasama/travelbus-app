import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toAbsoluteUrl } from "../../helpers";
import AuthLogin from "./authLogin";

class login extends Component {
  render() {
    return (
      <div className="d-flex flex-column flex-root h-100">
        {/*begin::Login*/}
        <div
          className="login login-1 login-signin-on d-flex flex-column flex-lg-row flex-column-fluid bg-white"
          id="kt_login"
        >
          {/*begin::Aside*/}
          <div
            className="login-aside d-flex flex-row-auto bgi-size-cover bgi-no-repeat p-10 p-lg-10"
            style={{
              backgroundImage: `url(${toAbsoluteUrl("/media/bg/bg-4.jpg")})`,
            }}
          >
            {/*begin: Aside Container*/}
            <div className="d-flex flex-row-fluid flex-column justify-content-between">
              {/* start:: Aside header */}
              <Link to="/" className="flex-column-auto mt-5 pb-lg-0 pb-10">
                <img
                  alt="Logo"
                  className="max-h-70px"
                  src={toAbsoluteUrl("/media/logos/app-logo.png")}
                />
              </Link>
              {/* end:: Aside header */}

              {/* start:: Aside content */}
              <div className="flex-column-fluid d-flex flex-column justify-content-center">
                <h3 className="font-size-h1 mb-5 text-white">
                  Welcome to Bus Travel!
                </h3>
              </div>
              {/* end:: Aside content */}

              {/* start:: Aside footer for desktop */}
              <div className="d-none flex-column-auto d-lg-flex justify-content-between mt-10">
                <div className="opacity-70 font-weight-bold	text-white">
                  <p> &copy; {new Date().getFullYear()} TWINKLE TOURIST BUS CO. LIMITED</p>
                </div>
              </div>
              {/* end:: Aside footer for desktop */}
            </div>
            {/*end: Aside Container*/}
          </div>
          {/*begin::Aside*/}

          {/* begin::Content body */}
          <div className="d-flex flex-column-fluid flex-center mt-30 mt-lg-0 ">
            <AuthLogin />
          </div>
          {/*end::Content body*/}

          {/* begin::Mobile footer */}
          <div className="d-flex d-lg-none flex-column-auto flex-column flex-sm-row justify-content-between align-items-center mt-5 p-5">
            <div className="text-dark-50 font-weight-bold order-2 order-sm-1 my-3 ml-5 col-8 col-md-6 mx-auto  ">
              <p> &copy; {new Date().getFullYear()} TWINKLE TOURIST BUS CO. LIMITED</p>
            </div>
          </div>
          {/* end::Mobile footer */}
        </div>
        {/*end::Login*/}
      </div>
    );
  }
}

export default login;
