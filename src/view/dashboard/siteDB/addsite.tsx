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
import { api } from "../../../common/api";
import { toast } from "react-toastify";
import { Select } from "../../../common/components/Select";
interface Values {
  code: string;
  name: string;
  routeCode: string;
  status: string;
}
interface Params {
  id?: string;
}
const AddSite = () => {
  const params: Params = useParams();
  const history = useHistory();

  const [entities, setEntities] = useState<any>();

  const getSiteData = async () => {
    try {
      const { data }: any = await api({
        url: `/site/details/${params.id}`,
        method: "get",
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        let item: any = data.result.data;
        setEntities({
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
    params.id && getSiteData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const AddSiteDB = async (values: Values) => {
    let body = {
      name: values.name,
      code: values.code,
      routeCode: values.routeCode,
    };
    try {
      const { data }: any = await api({
        url: `/site/add`,
        method: "post",
        body,
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        toast.success("Data added successfully");
        history.push("/site");
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  const UpdateSiteDB = async (values: Values) => {
    let body = {
      name: values.name,
      code: values.code,
      routeCode: values.routeCode,
      isActive: values.status,
    };
    try {
      const { data }: any = await api({
        url: `/site/update/${params.id}`,
        method: "put",
        body,
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        toast.success("Data updated successfully");
        history.push("/site");
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      code: params.id ? entities && entities?.code : "",
      name: params.id ? entities && entities?.name : "",
      routeCode: params.id ? entities && entities?.routeCode : "",
      status: params.id ? entities && entities?.isActive : true,
    },
    validationSchema: Yup.object({
      code: Yup.string()
        .required("Code is required")
        .matches(
          /^[A-Z0-9]*$/,
          "Must contain only uppercase letter with no blank space"
        ),
      name: Yup.string().required(" Name is required"),
      routeCode: Yup.string().required("Route Code is required"),
    }),
    onSubmit: (values: Values) => {
      params.id ? UpdateSiteDB(values) : AddSiteDB(values);
    },
  });

  return (
    <div>
      <Card>
        <CardHeader
          title={params.id ? "Edit Site DB" : "Add Site DB"}
        ></CardHeader>
        <CardBody>
          <div className="row mt-4">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">
              Site Code
            </div>
            <div className="col-4">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="code"
                  name="code"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.code || ""}
                />
                {formik.touched.code && formik.errors.code ? (
                  <div className="text-danger mt-1 ml-1">
                    {formik.errors.code}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">
              Site Name
            </div>
            <div className="col-4">
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

          <div className="row mt-4">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">
              Route Code
            </div>
            <div className="col-4">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="routeCode"
                  name="routeCode"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.routeCode || ""}
                />
                {formik.touched.routeCode && formik.errors.routeCode ? (
                  <div className="text-danger mt-1 ml-1">
                    {formik.errors.routeCode}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {params?.id && (
            <div className="row mt-4">
              <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">
                Status
              </div>
              <div className="col-10 col-sm-4">
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
              <Link className="btn btn-primary" to="/site">
                Back
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddSite;
