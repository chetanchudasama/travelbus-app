import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "../../../partials/controls";
import "react-quill/dist/quill.snow.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Select } from "../../../common/components/Select";
import { api } from "../../../common/api";
import { toast } from "react-toastify";

interface Values {
  name: string;
  password: string;
  status: string;
}
interface Params {
  id?: string;
}
const AddAdmin = () => {
  const params: Params = useParams();
  const history = useHistory();

  const [editEntities, setEditEntities] = useState<any>();

  const getAdminData = async () => {
    try {
      const { data }: any = await api({
        url: `/user/details/${params.id}`,
        method: "get",
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        let item: any = data.result.data;
        setEditEntities({
          ...item,
          status: item.isActive ? "Active" : "Inactive",
        });
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };
  useEffect(() => {
    params.id && getAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const AddAdminData = async (values: Values) => {
    let body = {
      name: values.name,
      password: values.password,
    };
    try {
      const { data }: any = await api({
        url: `/user/admin/register`,
        method: "post",
        body,
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        toast.success("Data added successfully");
        history.push("/admin");
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  const UpdateAdminData = async (values: Values) => {
    let body = {
      name: values.name,
      password: values.password,
      isActive: values.status,
    };
    try {
      const { data }: any = await api({
        url: `/user/update/${params.id}`,
        method: "put",
        body,
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        toast.success("Data updated successfully");
        history.push("/admin");
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: params.id ? editEntities && editEntities?.name : "",
      password: params.id ? editEntities && editEntities?.password : "",
      status: params.id ? editEntities && editEntities?.isActive : true,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      password: Yup.string().required("Password Code is required"),
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: (values: Values) => {
      params.id ? UpdateAdminData(values) : AddAdminData(values);
    },
  });

  return (
    <div>
      <Card>
        <CardHeader title={params.id ? "Edit Admin" : "Add Admin"}></CardHeader>
        <CardBody>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="row">
                <div className="col-lg-4 ws-nowrap">Username</div>
                <div className="col-lg-8">
                  {" "}
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.name || ""}
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <div className="text-danger mt-1 ml-1">
                        {formik.errors.name}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {!params.id ? (
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="row">
                  <div className="col-lg-4 ws-nowrap">Password</div>
                  <div className="col-lg-8">
                    {" "}
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        id="password"
                        name="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password || ""}
                      />
                      {formik.touched.password && formik.errors.password ? (
                        <div className="text-danger mt-1 ml-1">
                          {formik.errors.password}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>

          {params.id ? (
            <div className="row">
              <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">
                Status
              </div>
              <div className="col-4">
                <div className="form-group">
                  <Select
                    value={formik.values.status}
                    setValue={(value: string) =>
                      formik.setFieldValue("status", value)
                    }
                    options={[
                      { label: "Active", value: true },
                      { label: "Inactive", value: false },
                    ]}
                  />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </CardBody>
        <CardFooter>
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <div className="mt-4 mt-sm-0">
              <button
                type="submit"
                className="btn btn-success mr-2 mx-sm-2"
                onClick={() => formik.handleSubmit()}
              >
                {params?.id ? "Save" : "Add"}
              </button>
            </div>
            <div className="mt-4 mt-sm-0">
              <Link className="btn btn-primary" to="/admin">
                Back
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddAdmin;
