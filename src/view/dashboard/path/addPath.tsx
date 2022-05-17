import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "../../../partials/controls";
import "react-quill/dist/quill.snow.css";
import ColorPicker from "material-ui-rc-color-picker";
import { Select } from "../../../common/components/Select";
import { useFormik } from "formik";
import * as Yup from "yup";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import { api } from "../../../common/api";
import { toast } from "react-toastify";
interface Values {
  title: string;
  color: string;
  siteId: string;
  from: string;
  to: string;
  durationMin: number;
  remark: string;
  status: string;
  frompath: string;
  topath: string;
}
interface Params {
  id?: string;
}
interface IDropdown {
  code: any;
  id: string;
  name: string;
}
const AddPath = () => {
  const params: Params = useParams();
  const history = useHistory();

  const [entities, setEntities] = useState<any>([]);
  const [locationEntities, setLocationEntities] = useState<IDropdown[]>([]);
  const [editEntities, setEditEntities] = useState<any>();

  const getPathData = async () => {
    try {
      const { data }: any = await api({
        url: `/path/details/${params.id}`,
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

  const getSiteEntities = async () => {
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

  const AddPathData = async (values: Values) => {
    let body = {
      title: values.title,
      from: values.from,
      to: values.to,
      durationMin: values.durationMin,
      colorHex: values.color,
      siteId: values.siteId,
      remark: values.remark,
    };
    try {
      const { data }: any = await api({
        url: `/path/add`,
        method: "post",
        body,
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        toast.success("Data added successfully");
        history.push("/path");
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  const UpdatePathData = async (values: Values) => {
    let body = {
      title: values.title,
      from: values.from,
      to: values.to,
      durationMin: values.durationMin,
      colorHex: values.color,
      siteId: values.siteId,
      remark: values.remark,
      isActive: values.status,
    };
    try {
      const { data }: any = await api({
        url: `/path/update/${params.id}`,
        method: "put",
        body,
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        toast.success("Data updated successfully");
        history.push("/path");
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  const getLocationEntities = async () => {
    try {
      const { data }: any = await api({
        url: `/location/site/${locationId}`,
        method: "get",
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        const entities = data.result.data.locationData.map(
          (entity: any, ind: number) => {
            return {
              id: entity._id,
              name: entity.name,
              code: entity.code,
            };
          }
        );
        setLocationEntities(entities);
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  useEffect(() => {
    getSiteEntities();
    params.id && getPathData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: params.id ? editEntities && editEntities?.title : "",
      color: params.id ? editEntities && editEntities?.colorHex : "#b78989",
      siteId: params.id ? editEntities && editEntities?.siteId : "",
      from: params.id ? editEntities && editEntities?.from : "",
      to: params.id ? editEntities && editEntities?.to : "",
      durationMin: params.id ? editEntities && editEntities?.durationMin : 0,
      remark: params.id ? editEntities && editEntities?.remark : "",
      frompath: "",
      topath: "",
      status: params.id ? editEntities && editEntities?.isActive : true,
    },
    validationSchema: Yup.object({
      siteId: Yup.string().required("Site is required"),
      from: Yup.string().required("From is required"),
      to: Yup.string()
        .notOneOf(
          [Yup.ref("from"), null],
          "Form and To location must be different"
        )
        .required("To is required"),
      durationMin: Yup.number().required("Duration is required"),
      remark: Yup.string().required("Remark is required"),
    }),
    onSubmit: (values: Values) => {
      params.id ? UpdatePathData(values) : AddPathData(values);
    },
  });

  const onChangeColor = (e: any) => {
    formik.setFieldValue("color", e.color);
  };

  const handleFromValue = (e: any) => {
    formik.setFieldValue("from", e.target.value);
    const locationEntity = locationEntities.find(
      (x) => x.id === e?.target.value
    );
    formik.setFieldValue("frompath", locationEntity ? locationEntity.code : "");
    const pathTitle = `${locationEntity && locationEntity.code} > ${
      formik.values.topath
    }`;
    formik.setFieldValue("title", pathTitle);
  };

  const handleToValue = (e: any) => {
    formik.setFieldValue("to", e.target.value);
    const locationEntity = locationEntities.find(
      (x) => x.id === e?.target.value
    );
    formik.setFieldValue("topath", locationEntity ? locationEntity.code : "");
    const pathTitle = `${formik.values.frompath} > ${locationEntity &&
      locationEntity.code}`;
    formik.setFieldValue("title", pathTitle);
  };

  const locationId = formik.values.siteId;
  useEffect(() => {
    if (formik.values.siteId) {
      getLocationEntities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.siteId]);

  return (
    <div>
      <Card>
        <CardHeader title={params.id ? "Edit Path" : "Add Path"}></CardHeader>
        <CardBody>
          <div className="row mt-4">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">
              Path Title
            </div>
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
                  // readOnly
                />
                {formik.touched.title && formik.errors.title ? (
                  <div className="text-danger mt-1 ml-1">
                    {formik.errors.title}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">Color</div>
            <div className="col-4">
              <div className="form-group">
                <ColorPicker
                  enableAlpha={false}
                  mode="RGB"
                  name="color"
                  color={formik.values.color}
                  onChange={onChangeColor}
                />
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">Site</div>
            <div className="col-4">
              <select
                className="form-control top-select rounded"
                name="siteId"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.siteId || ""}
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
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">From</div>
            <div className="col-4">
              <select
                className="form-control top-select rounded"
                name="from"
                onChange={(e) => handleFromValue(e)}
                onBlur={formik.handleBlur}
                value={formik.values.from || ""}
                style={{ paddingRight: "3rem" }}
              >
                <option value="" disabled>
                  -- Select --
                </option>
                {entities?.length > 0 &&
                  locationEntities.map((option: any) => (
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
              {formik.touched.from && formik.errors.from ? (
                <div className="text-danger mt-1 ml-1">
                  {formik.errors.from}
                </div>
              ) : null}
            </div>

            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">To</div>
            <div className="col-4">
              <select
                className="form-control top-select rounded"
                name="to"
                // onChange={formik.handleChange}
                onChange={(e) => handleToValue(e)}
                onBlur={formik.handleBlur}
                value={formik.values.to || ""}
                style={{ paddingRight: "3rem" }}
              >
                <option value="" disabled>
                  -- Select --
                </option>
                {entities?.length > 0 &&
                  locationEntities.map((option: any) => (
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
              {formik.touched.to && formik.errors.to ? (
                <div className="text-danger mt-1 ml-1">{formik.errors.to}</div>
              ) : null}
            </div>
          </div>

          <div className="row mt-5 ">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">
              Duration
            </div>
            <div className="col-4">
              <div className="form-group">
                <input
                  type="number"
                  min={0}
                  className="form-control"
                  id="durationMin"
                  name="durationMin"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.durationMin || ""}
                />
                {formik.touched.durationMin && formik.errors.durationMin ? (
                  <div className="text-danger mt-1 ml-1">
                    {formik.errors.durationMin}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="row pt-4 ">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">
              Remarks
            </div>
            <div className="col-8 ">
              <div className="">
                <textarea
                  className="form-control"
                  id="inputText"
                  rows={3}
                  value={formik.values.remark || ""}
                  name="remark"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                ></textarea>

                {formik.touched.remark && formik.errors.remark ? (
                  <div className="text-danger mt-1 ml-1">
                    {formik.errors.remark}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {params.id ? (
            <div className="row mt-5 ">
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
              <Link className="btn btn-primary" to="/path">
                Back
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddPath;
