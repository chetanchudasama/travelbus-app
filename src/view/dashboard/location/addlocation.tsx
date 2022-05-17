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
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import { Select } from "../../../common/components/Select";
import { api } from "../../../common/api";
import { toast } from "react-toastify";
interface Values {
  code: string;
  name: string;
  siteId: string;
  status: string;
  lat: string;
  lng: string;
  fullNameEN: string;
  fullNameCH: string;
  addressEN: string;
  addressCH: string;
}
interface Params {
  id?: string;
}

const AddLocation = () => {
  const params: Params = useParams();
  const history = useHistory();

  const [entities, setEntities] = useState<any>([]);
  const [editEntities, setEditEntities] = useState<any>();

  const getLocationData = async () => {
    try {
      const { data }: any = await api({
        url: `/location/details/${params.id}`,
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

  const getEntities = async () => {
    try {
      const { data }: any = await api({
        url: "/site/list?isActive=true",
        method: "get",
      });

      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        const entities = data.result.data.siteData.map(
          (entity: any, ind: number) => {
            return {
              id: entity._id,
              name: entity.name,
              // status: entity.isActive ? "ACTIVE" : "INACTIVE",
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

  useEffect(() => {
    getEntities();
    params.id && getLocationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const AddLocationData = async (values: Values) => {
    let body = {
      code: values.code,
      name: values.name,
      siteId: values.siteId,
      lat: values.lat,
      lng: values.lng,
      fullNameEN: values.fullNameEN,
      fullNameCH: values.fullNameCH,
      addressEN: values.addressEN,
      addressCH: values.addressCH,
    };
    try {
      const { data }: any = await api({
        url: `/location/add`,
        method: "post",
        body,
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        toast.success("Data added successfully");
        history.push("/location");
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  const UpdateLocationData = async (values: Values) => {
    let body = {
      code: values.code,
      name: values.name,
      siteId: values.siteId,
      lat: values.lat,
      lng: values.lng,
      fullNameEN: values.fullNameEN,
      fullNameCH: values.fullNameCH,
      addressEN: values.addressEN,
      addressCH: values.addressCH,
      isActive: values.status,
    };
    try {
      const { data }: any = await api({
        url: `/location/update/${params.id}`,
        method: "put",
        body,
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        toast.success("Data updated successfully");
        history.push("/location");
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      code: params.id ? editEntities && editEntities?.code : "",
      name: params.id ? editEntities && editEntities?.name : "",
      siteId: params.id ? editEntities && editEntities?.siteId?._id : "",
      status: params.id ? editEntities && editEntities?.isActive : true,
      lat: params.id ? editEntities && editEntities?.lat : "",
      lng: params.id ? editEntities && editEntities?.lng : "",
      fullNameEN: params.id ? editEntities && editEntities?.fullNameEN : "",
      fullNameCH: params.id ? editEntities && editEntities?.fullNameCH : "",
      addressEN: params.id ? editEntities && editEntities?.addressEN : "",
      addressCH: params.id ? editEntities && editEntities?.addressCH : "",
    },
    validationSchema: Yup.object({
      code: Yup.string()
        .required("Code is required")
        .matches(
          /^[A-Z0-9]*$/,
          "Must contain only uppercase letter with no blank space"
        ),
      name: Yup.string().required(" Name is required"),
      siteId: Yup.string().required("Site is required"),
      status: Yup.string().required("Status is required"),
      lat: Yup.string().required("Lat is required"),
      lng: Yup.string().required("Lng is required"),
      fullNameEN: Yup.string().required("Fullname (EN) is required"),
      fullNameCH: Yup.string().required("Fullname (CH) is required"),
      addressEN: Yup.string().required("Address (EN) is required"),
      addressCH: Yup.string().required("Address (CH) is required"),
    }),
    onSubmit: (values: Values) => {
      params.id ? UpdateLocationData(values) : AddLocationData(values);
    },
  });

  return (
    <div>
      <Card>
        <CardHeader
          title={params.id ? "Edit Location" : "Add Location"}
        ></CardHeader>
        <CardBody>
          <div className="row mt-4">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">
              Location Code
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
              Location Name
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
              Full Name (CH)
            </div>
            <div className="col-4">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="fullNameCH"
                  name="fullNameCH"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.fullNameCH || ""}
                />
                {formik.touched.fullNameCH && formik.errors.fullNameCH ? (
                  <div className="text-danger mt-1 ml-1">
                    {formik.errors.fullNameCH}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">
              Full Name (EN)
            </div>
            <div className="col-4">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="fullNameEN"
                  name="fullNameEN"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.fullNameEN || ""}
                />
                {formik.touched.fullNameEN && formik.errors.fullNameEN ? (
                  <div className="text-danger mt-1 ml-1">
                    {formik.errors.fullNameEN}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="row mt-4 ">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">Site</div>
            <div className="col-10 col-sm-4">
              <select
                className="form-control top-select rounded"
                name="siteId"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.siteId}
                style={{ paddingRight: "3rem" }}
                disabled={params.id ? true : false}
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
              {formik.touched.siteId && formik.errors.siteId ? (
                <div className="text-danger mt-1 ml-1">
                  {formik.errors.siteId}
                </div>
              ) : null}
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">x</div>
            <div className="col-4">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="lat"
                  name="lat"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lat || ""}
                />
                {formik.touched.lat && formik.errors.lat ? (
                  <div className="text-danger mt-1 ml-1">
                    {formik.errors.lat}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">y</div>
            <div className="col-4">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="lng"
                  name="lng"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lng || ""}
                />
                {formik.touched.lng && formik.errors.lng ? (
                  <div className="text-danger mt-1 ml-1">
                    {formik.errors.lng}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="row mt-4 ">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">
              Address (EN)
            </div>
            <div className="col-4 ">
              <div className="">
                <textarea
                  className="form-control"
                  id="addressEN"
                  rows={3}
                  value={formik.values.addressEN || ""}
                  name="addressEN"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                ></textarea>

                {formik.touched.addressEN && formik.errors.addressEN ? (
                  <div className="text-danger mt-1 ml-1">
                    {formik.errors.addressEN}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="row mt-4 ">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">
              Address (CH)
            </div>
            <div className="col-4 ">
              <div className="">
                <textarea
                  className="form-control"
                  id="addressCH"
                  rows={3}
                  value={formik.values.addressCH || ""}
                  name="addressCH"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                ></textarea>

                {formik.touched.addressCH && formik.errors.addressCH ? (
                  <div className="text-danger mt-1 ml-1">
                    {formik.errors.addressCH}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {params.id ? (
            <div className="row mt-4 ">
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
                {formik.touched.status && formik.errors.status ? (
                  <div className="text-danger mt-1 ml-1">
                    {formik.errors.status}
                  </div>
                ) : null}
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
              <Link className="btn btn-primary" to="/location">
                Back
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddLocation;
