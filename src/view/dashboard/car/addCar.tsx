import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "../../../partials/controls";
import { api } from "../../../common/api";
import { toast } from "react-toastify";
import { Select } from "../../../common/components/Select";
import "react-quill/dist/quill.snow.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import Selects from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";

interface Values {
  licPlateNoHk: string;
  status: string;
  code: string;
  name: string;
  site: string[];
}
interface Params {
  id?: string;
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
  if (personName && personName.length) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  } else {
    return { fontWeight: theme.typography.fontWeightMedium };
  }
}

const AddCar = () => {
  const params: Params = useParams();
  const history = useHistory();

  const [editEntities, setEditEntities] = useState<any>();
  const [entities, setEntities] = useState<any>([]);
  const [driverId, setDriverId] = useState<any>([]);

  const classes = useStyles();
  const theme = useTheme();

  const getCarData = async () => {
    try {
      const { data }: any = await api({
        url: `/car/details/${params.id}`,
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

  const AddCarData = async (values: Values) => {
    let body = {
      name: values.name,
      code: values.code,
      siteId: values.site,
      licPlateNoHk: values.licPlateNoHk,
    };
    try {
      const { data }: any = await api({
        url: `/car/add`,
        method: "post",
        body,
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        toast.success("Data added successfully");
        history.push("/car");
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  const UpdateCarData = async (values: Values) => {
    let body = {
      name: values.name,
      code: values.code,
      siteId: values.site,
      isActive: values.status,
      licPlateNoHk: values.licPlateNoHk,
    };
    try {
      const { data }: any = await api({
        url: `/car/update/${params.id}`,
        method: "put",
        body,
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        toast.success("Data updated successfully");
        history.push("/car");
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
              siteId: entity.name,
              id: entity._id,
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

  const numberPlateList = async () => {
    try {
      const { data }: any = await api({
        url: "/number/plate/list",
        method: "get",
      });

      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        const entities = data.data.map((entity: any, ind: number) => {
          return {
            deviceId: entity.deviceId,
            licPlateHk: entity.licPlateNoHk,
          };
        });

        setDriverId(entities);
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  useEffect(() => {
    numberPlateList();
    getEntities();
    params.id && getCarData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      licPlateNoHk: params.id ? editEntities && editEntities?.licPlateNoHk : "",
      status: params.id ? editEntities && editEntities?.isActive : true,
      code: params.id ? editEntities && editEntities?.code : "",
      name: params.id ? editEntities && editEntities?.name : "",
      site: params.id ? editEntities && editEntities?.siteId : [],
    },
    validationSchema: Yup.object({
      code: Yup.string()
        .required("Car code is required")
        .matches(
          /^[A-Z0-9]*$/,
          "Must contain only uppercase letter with no blank space"
        ),
      name: Yup.string().required(" Car name is required"),
      licPlateNoHk: Yup.string().required("Car Licence no is required"),
      site: Yup.array()
        .min(1, "Atleast choose one site.")
        .required("Atleast choose one site.")
        .nullable(),
    }),
    onSubmit: (values: Values) => {
      params.id ? UpdateCarData(values) : AddCarData(values);
    },
  });

  const options =
    entities?.map((item: any) => ({
      label: item.siteId,
      value: item.id,
    })) || [];

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    formik.setFieldValue("site", event.target.value as string[]);
  };

  return (
    <div>
      <Card>
        <CardHeader title={params.id ? "Edit Car" : "Add Car"}></CardHeader>
        <CardBody>
          <div className="row mt-4 ">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">
              Car License Code
            </div>
            <div className="col-10 col-sm-4">
              <select
                className="form-control top-select rounded"
                name="licPlateNoHk"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.licPlateNoHk}
                style={{ paddingRight: "3rem" }}
              >
                <option value="" disabled>
                  -- Select --
                </option>
                {entities?.length > 0 &&
                  driverId?.map((option: any) => (
                    <option key={option.licPlateNoHk} value={option.licPlateHk}>
                      {option.licPlateHk}
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
              {formik.touched.licPlateNoHk && formik.errors.licPlateNoHk ? (
                <div className="text-danger mt-1 ml-1">
                  {formik.errors.licPlateNoHk}
                </div>
              ) : null}
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">
              Car Code
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
              Car Name
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
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">Site</div>
            <div className="col-4">
              <div className="form-group">
                <Selects
                  labelId="demo-mutiple-chip-label"
                  id="demo-mutiple-chip"
                  multiple
                  value={formik.values.site || []}
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
                      style={getStyles(
                        option.value,
                        formik?.values?.site,
                        theme
                      )}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Selects>

                {formik.touched.site && formik.errors.site ? (
                  <div className="text-danger mt-1 ml-1">
                    {formik.errors.site}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {params?.id && (
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
              <Link className="btn btn-primary" to="/car">
                Back
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddCar;
