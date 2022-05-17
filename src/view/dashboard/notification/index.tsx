import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "../../../partials/controls";
import "react-quill/dist/quill.snow.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { api } from "../../../common/api";
import { toast } from "react-toastify";
interface Values {
  title: string;
  content: string;
}
const AddNotification = () => {
  const AddNotificationData = async (values: Values) => {
    let body = {
      title: values.title,
      content: values.content,
    };
    try {
      const { data }: any = await api({
        url: `/notification/user/driver`,
        method: "post",
        body,
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        toast.success("Notification sent successfully");
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: "",
      content: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      content: Yup.string().required(" Content is required"),
    }),
    onSubmit: (values: Values) => {
      AddNotificationData(values);
    },
  });

  return (
    <div>
      <Card>
        <CardHeader title={"Push Notification"}></CardHeader>
        <CardBody>
          <div className="row mt-4">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">Title</div>
            <div className="col-4">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.title}
                />
                {formik.touched.title && formik.errors.title ? (
                  <div className="text-danger mt-1 ml-1">
                    {formik.errors.title}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="row mt-4 pt-4 ">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">
              Content
            </div>
            <div className="col-8 ">
              <div className="">
                <textarea
                  className="form-control"
                  id="inputText"
                  rows={3}
                  value={formik.values.content}
                  name="content"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                ></textarea>

                {formik.touched.content && formik.errors.content ? (
                  <div className="text-danger mt-1 ml-1">
                    {formik.errors.content}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </CardBody>

        <CardFooter>
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <div className="mt-4 mt-sm-0">
              <button
                type="submit"
                className="btn btn-success mr-2 mx-sm-2"
                onClick={() => formik.handleSubmit()}
              >
                Send
              </button>
            </div>
            <div className="mt-4 mt-sm-0">
              <Link className="btn btn-primary" to="/notification">
                Back
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddNotification;
