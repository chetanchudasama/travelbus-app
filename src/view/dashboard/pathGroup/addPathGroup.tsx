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
import Selects from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";

interface Values {
  title: string;
  path: string[];
  color: string;
  siteId: string;
  remark: string;
  status: string;
  frompath: string;
  topath: string;
}
interface Params {
  id?: string;
}
interface IDropdown {
  id: string;
  name: string;
  from: string;
  to: string;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
    chips: {
      display: "flex",
      flexWrap: "wrap",
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
  })
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const AddPathGroup = () => {
  const params: Params = useParams();
  const history = useHistory();

  const [entities, setEntities] = useState<any>([]);
  const [pathLineEntities, setPathLineEntities] = useState<IDropdown[]>([]);
  const [editEntities, setEditEntities] = useState<any>();

  const classes = useStyles();
  const theme = useTheme();

  const getPathGroupData = async () => {
    try {
      const { data }: any = await api({
        url: `/pathGroup/details/${params.id}`,
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
        url: "/site/list",
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

  const AddPathGroupData = async (values: Values) => {
    let body = {
      pathId: values.path,
      title: values.title,
      siteId: values.siteId,
      remark: values.remark,
      color: values.color,
    };
    try {
      const { data }: any = await api({
        url: `/pathGroup/add`,
        method: "post",
        body,
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        toast.success("Data added successfully");
        history.push("/pathGroup");
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  const UpdatePathGroupData = async (values: Values) => {
    let body = {
      title: values.title,
      color: values.color,
      siteId: values.siteId,
      remark: values.remark,
      isActive: values.status,
      pathId: values.path,
    };
    try {
      const { data }: any = await api({
        url: `/pathGroup/update/${params.id}`,
        method: "put",
        body,
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        toast.success("Data updated successfully");
        history.push("/pathGroup");
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  const getPathLineEntities = async () => {
    try {
      const { data }: any = await api({
        url: `/path/site/${PathLineId}`,
        method: "get",
      });

      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        const entities = data.result.data.pathData.map(
          (entity: any, ind: number) => {
            return {
              id: entity._id,
              name: entity.title,
              from: entity?.from?.code,
              to: entity?.to?.code,
            };
          }
        );
        setPathLineEntities(entities);
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  useEffect(() => {
    getSiteEntities();

    params.id && getPathGroupData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: params.id ? editEntities && editEntities?.title : "",
      color: params.id ? editEntities && editEntities?.color : "#b78989",
      siteId: params.id ? editEntities && editEntities?.siteId?._id : "",
      remark: params.id ? editEntities && editEntities?.remark : "",
      path: params.id ? editEntities && editEntities?.pathId : [],
      status: params.id ? editEntities && editEntities?.isActive : true,
      frompath: "",
      topath: "",
    },
    validationSchema: Yup.object({
      siteId: Yup.string().required("Site is required"),
      remark: Yup.string().required("Remark is required"),
      path: Yup.array()
        .min(2, "Atleast choose two path")
        .required("Path is required")
        .nullable(),
    }),

    onSubmit: (values: Values) => {
      params.id ? UpdatePathGroupData(values) : AddPathGroupData(values);
    },
  });

  const onChangeColor = (e: any) => {
    formik.setFieldValue("color", e.color);
  };

  const options =
    pathLineEntities?.map((item: any) => ({
      label: item.name,
      value: item.id,
    })) || [];
  const locationEntity: any = [];

  const handleChange = (event: React.ChangeEvent<{ value: any }>) => {
    formik.setFieldValue("path", event.target.value);
    let eventTarget = event.target.value;
    // const locationEntity: any = [];
    eventTarget.map((digit) => {
      let found: any = pathLineEntities.find((o1) => o1.id === digit);
      if (found) {
        locationEntity.push(found);
      }
    });

    formik.setFieldValue(
      "title",
      `${locationEntity[0].from} > ${
        locationEntity[locationEntity.length - 1].to
      }`
    );
  };

  const PathLineId = formik.values.siteId;
  useEffect(() => {
    if (formik.values.siteId) {
      getPathLineEntities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.siteId]);

  return (
    <div>
      <Card>
        <CardHeader
          title={params.id ? "Edit Path Group" : "Add Path Group"}
        ></CardHeader>
        <CardBody>
          <div className="row mt-4">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">
              Path Group Title
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
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">Site</div>
            <div className="col-4">
              <select
                className="form-control top-select rounded"
                name="siteId"
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldValue("path", "");
                }}
                // onChange={(e: any) => onChangeSiteId(e, formik.values.siteId)}
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
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">
              Select Path
            </div>
            <div className="col-4">
              <div className="form-group">
                <Selects
                  labelId="demo-mutiple-chip-label"
                  id="demo-mutiple-chip"
                  multiple
                  value={formik.values.path || []}
                  onChange={handleChange}
                  input={<Input id="select-multiple-chip" />}
                  renderValue={(selected) => (
                    <div className={classes.chips}>
                      {(selected as string[]).map((value) => (
                        <Chip
                          key={value}
                          label={
                            options.find((option) => option.value === value)
                              ?.label || ""
                          }
                          className={classes.chip}
                        />
                      ))}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  {options.map((option: any) => (
                    <MenuItem
                      key={option.value}
                      value={option.value}
                      style={getStyles(option.value, formik.values.path, theme)}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Selects>

                {formik.touched.path && formik.errors.path ? (
                  <div className="text-danger mt-1 ml-1">
                    {formik.errors.path}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="row pt-4 ">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">
              Remark
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
          <div className="row pt-4 ">
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
              <Link className="btn btn-primary" to="/pathGroup">
                Back
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddPathGroup;
