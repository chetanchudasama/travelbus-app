import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router";
import { api } from "../../common/api"
import { toast } from "react-toastify";
import { setUser } from "../../redux/actions/userActions";
import { useDispatch } from "react-redux";

const initialValues = {
  name: "",
  password: "",
  role:"ADMIN"
};

const AuthLogin = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const LoginSchema = Yup.object().shape({
    name: Yup.string()
       .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Name is required"),
    password: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Password is required"),
  });

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  const getInputClasses = (fieldname:any) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const login = async (values: any) => {
    enableLoading();
    try {
      const { data } = await api({
        url: "/user/login",
        method: "post",
        body: {
          name: values.name,
          password: values.password,
          role:values.role
        },
        secure: false,
      });
      disableLoading();
      if (data.serverResponse.isError) {
       
        toast.error(data.serverResponse.message);
      } else {
        dispatch(setUser(data.result.data));
        toast.success(data.serverResponse.message);
        history.push("/site");
      }
    } catch (err) {
      disableLoading();
     
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values) =>
     login(values)
     
  });

  return (
    <div
      className="login-form login-signin col-8 col-md-6 mx-auto"
      id="kt_login_signin_form"
    >
      {/* begin::Head */}
      <div className="text-center mb-10 mb-lg-20">
        <h3 className="font-size-h1">Login</h3>
        <p className="text-muted font-weight-bold">
          Enter your username and password
        </p>
      </div>
      {/* end::Head */}

      {/*begin::Form*/}
      <form
        onSubmit={formik.handleSubmit}
        className="form fv-plugins-bootstrap fv-plugins-framework"
      >
        <div className="form-group fv-plugins-icon-container w-100">
          <input
            // name="name"
            placeholder="Name"
            type="text"
            className={`form-control form-control-solid h-auto py-3 ${getInputClasses(
              "name"
            )}`}
          
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.name}</div>
            </div>
          ) : null}
        </div>
        <div className="form-group fv-plugins-icon-container">
          <input
            // name="password"
            placeholder="Password"
            type="password"
            className={`form-control form-control-solid h-auto py-3 ${getInputClasses(
              "password"
            )}`}
            
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.password}</div>
            </div>
          ) : null}
        </div>
        
        <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
          <button
            id="kt_login_signin_submit"
            type="submit"
            disabled={formik.isSubmitting}
            className={`btn btn-primary font-weight-bold px-9 py-3`}
          >
            <span>Sign In</span>
            {loading && <span className="ml-3 spinner spinner-white"></span>}
          </button>
        </div>
      </form>
      {/*end::Form*/}
    </div>
  );
};

export default AuthLogin;
