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
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import { Select } from "../../../common/components/Select";
import { api } from "../../../common/api";
import { toast } from "react-toastify";
import moment from "moment";
import Checkbox from '@material-ui/core/Checkbox';
interface Values {
  title: string;
  type: string;
  siteId: string;
  deadline: string;
  content: string;
  status: string;
  sendAsPush: boolean;
}
interface Params {
  id?: string;
}
const AddNews = () => {
  const history = useHistory();
  const params: Params = useParams();

  const [entities, setEntities] = useState<any>([]);
  const [editEntities, setEditEntities] = useState<any>();

  const getNewsData = async () => {
    try {
      const { data }: any = await api({
        url: `/news/details/${params.id}`,
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

  const AddNewsData = async (values: Values) => {
    try {
      let body: any = {
        type: values.type,
        title: values.title,
        content: values.content
          .replace(/<p>/g, "")
          .replace(/<\/p>/g, "")
          .replaceAll("<p><br></p>", "<p></p>"),
        siteId: values.siteId,
        sendAsPush: values.sendAsPush,
      };
      if (values.type === "HIGHLIGHTED") {
        body = {
          ...body,
          deadline: values.deadline,
        };
      }
      const { data }: any = await api({
        url: "/news/add",
        method: "post",
        body,
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        toast.success("Data added successfully");
        history.push("/news");
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  const UpdateNewsData = async (values: Values) => {
    try {
      let body: any = {
        type: values.type,
        title: values.title,
        content: values.content
          .replace(/<p>/g, "")
          .replace(/<\/p>/g, "")
          .replaceAll("<p><br></p>", "<p></p>"),
        siteId: values.siteId,
        isActive: values.status,
      };
      if (values.type === "HIGHLIGHTED") {
        body = {
          ...body,
          deadline: values.deadline,
        };
      }
      const { data }: any = await api({
        url: `/news/update/${params.id}`,
        method: "put",
        body,
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        toast.success("Data updated successfully");
        history.push("/news");
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
        const entities = data.result.data.siteData.map((entity: any) => {
          return {
            id: entity._id,
            name: entity.name,
          };
        });
        setEntities(entities);
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };
  useEffect(() => {
    getSiteEntities();
    params.id && getNewsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: params.id ? editEntities && editEntities?.title : "",
      type: params.id ? editEntities && editEntities?.type : "HIGHLIGHTED",
      siteId: params.id ? editEntities && editEntities?.siteId : "",
      deadline: params.id ? editEntities && editEntities?.deadline : "",
      content: params.id ? editEntities && editEntities?.content : "",
      status: params.id ? editEntities && editEntities?.isActive : true,
      sendAsPush: true,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      type: Yup.string().required(" Type is required"),
      siteId: Yup.string().required("Site is required"),
      content: Yup.string().required("Content is required"),
      status: Yup.string().required("Status is required"),
      deadline: Yup.string().when("type", {
        is: "HIGHLIGHTED",
        then: Yup.string().required("Deadline is required"),
      }),
    }),
    onSubmit: (values: Values) => {
      params.id ? UpdateNewsData(values) : AddNewsData(values);
    },
  });

  return (
    <div>
      <Card>
        <CardHeader title={params.id ? "Edit News" : "Add News"}></CardHeader>
        <CardBody>
          <div className="row mt-4">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">Title</div>
            <div className="col-4">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  placeholder="Add title"
                  name="title"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.title || ""}
                />
                {formik.touched.title && formik.errors.title ? (
                  <div className="text-danger mt-1 ml-1">
                    {formik.errors.title}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">Type</div>
            <div className="col-4">
              <div className="form-group">
                <Select
                  value={formik.values.type}
                  setValue={(value: string) =>
                    formik.setFieldValue("type", value)
                  }
                  options={[
                    { label: "HIGHLIGHTED", value: "HIGHLIGHTED" },
                    { label: "NORMAL", value: "NORMAL" },
                  ]}
                />
                {formik.touched.type && formik.errors.type ? (
                  <div className="text-danger mt-1 ml-1">
                    {formik.errors.type}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">Site</div>
            <div className="col-4">
              <div className="form-group">
                <select
                  className="form-control top-select rounded"
                  name="siteId"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.siteId || ""}
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
                {formik.touched.siteId && formik.errors.siteId ? (
                  <div className="text-danger mt-1 ml-1">
                    {formik.errors.siteId}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {formik.values.type === "HIGHLIGHTED" ? (
            <div className="row mt-4">
              <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">
                Deadline
              </div>
              <div className="col-4">
                <div className="form-group">
                  <input
                    type="date"
                    className="form-control"
                    name="deadline"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={moment(
                      new Date(formik.values.deadline).toUTCString()
                    ).format("YYYY-MM-DD")}
                  />
                </div>
                {formik.touched.deadline && formik.errors.deadline ? (
                  <div className="text-danger mt-1 ml-1">
                    {formik.errors.deadline}
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            ""
          )}

          {!params.id ? (
            <div className="row mt-4">
              <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">
                Send as Push
              </div>
              <div className="col-4">
                <div className="form-group">
                  <Checkbox name="sendAsPush" checked={formik.values.sendAsPush} onChange={formik.handleChange}/>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="row mt-4 pt-4 ">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">
              Content
            </div>
            <div className="col-10 ">
              <div className="">
                <div>
                  <textarea
                    className="form-control"
                    id="content"
                    rows={3}
                    value={formik.values.content || ""}
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
              <div></div>
            </div>
          </div>

          {params.id ? (
            <div className="row mt-4">
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
              <Link className="btn btn-primary" to="/news">
                Back
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddNews;
