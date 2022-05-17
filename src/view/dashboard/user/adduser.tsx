import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "../../../partials/controls";
import { useFormik } from "formik";
import * as Yup from "yup";
import "react-quill/dist/quill.snow.css";
import { Select } from "../../../common/components/Select";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import { api } from "../../../common/api";
import { toast } from "react-toastify";

interface Values {
  name: string;
  carId: string;
  password: string;
  routeCode: string;
  status: string;
}
interface Params {
  id?: string;
}
const AddUser = () => {
  const params: Params = useParams();
  const [entities, setEntities] = useState<any>([]);
  const [editEntities, setEditEntities] = useState<any>();
  const history = useHistory();

  const getEntities = async () => {
    try {
      const { data }: any = await api({
        url: "/car/list?isActive=true",
        method: "get",
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        const entities = data.result.data.carData.map(
          (entity: any, ind: number) => {
            return {
              id: entity._id,
              name: entity.name,
            };
          }
        );
        setEntities(entities);
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  const getDriverData = async () => {
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
    getEntities();
    params.id && getDriverData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const AddDriverData = async (values: Values) => {
    let body = {
      name: values.name,
      carId: values.carId,
      password: values.password,
      routeCode: values.routeCode,
    };

    try {
      const { data }: any = await api({
        url: `/user/driver/register`,
        method: "post",
        body,
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        toast.success("Data added successfully");
        history.push("/user");
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };
  const UpdateDriverData = async (values: Values) => {
    let body = {
      name: values.name,
      carId: values.carId,
      password: values.password,
      routeCode: values.routeCode,
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
        history.push("/user");
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
      carId: params.id ? editEntities && editEntities?.carId : "",
      password: params.id ? editEntities && editEntities?.password : "",
      routeCode: params.id ? editEntities && editEntities?.routeCode : "",
      status: params.id ? editEntities && editEntities?.isActive : true,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      carId: Yup.string().required("Car id is required"),
      password: Yup.string().required("Password Code is required"),
      routeCode: Yup.string().required("Route code is required"),
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: (values: Values) => {
      params.id ? UpdateDriverData(values) : AddDriverData(values);
    },
  });
  const option =
    entities?.map((item: any) => ({
      label: item.name,
      value: item.id,
    })) || [];
  return (
    <div>
      <Card>
        <CardHeader
          title={params?.id ? "Edit Driver" : "Add Driver"}
        ></CardHeader>
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
                      value={formik.values.name}
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
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="row">
                <div className="col-lg-4 ws-nowrap">Car</div>
                <div className="col-lg-8">
                  {" "}
                  <div className="form-group">
                    <select
                      className="form-control top-select rounded"
                      name="carId"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.carId}
                      style={{ paddingRight: "3rem" }}
                    >
                      <option value="" disabled>
                        -- Select --
                      </option>
                      {entities?.length > 0 &&
                        entities.map((option: any) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                    </select>
                    <ExpandMoreRoundedIcon
                      style={{
                        position: "absolute",
                        right: "2rem",
                        zIndex: 9,
                        top: "6px",
                      }}
                    />
                    {formik.touched.carId && formik.errors.carId ? (
                      <div className="text-danger mt-1 ml-1">
                        {formik.errors.carId}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="row">
                <div className="col-lg-4 ws-nowrap">Route Code</div>
                <div className="col-lg-8">
                  {" "}
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      id="routeCode"
                      name="routeCode"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.routeCode}
                    />
                    {formik.touched.routeCode && formik.errors.routeCode ? (
                      <div className="text-danger mt-1 ml-1">
                        {formik.errors.routeCode}
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
                        value={formik.values.password}
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
                {formik.touched.status && formik.errors.status ? (
                  <div className="text-danger mt-1 ml-1">
                    {formik.errors.status}
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
                {params?.id ? "Save" : "Add"}
              </button>
            </div>
            <div className="mt-4 mt-sm-0">
              <Link className="btn btn-primary" to="/user">
                Back
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddUser;
