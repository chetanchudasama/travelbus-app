import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "../../../partials/controls";
import "react-quill/dist/quill.snow.css";
import { Select } from "../../../common/components/Select";
import { useFormik } from "formik";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import * as Yup from "yup";
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
import { forEach } from "lodash";
import { parseDragMeta } from "@fullcalendar/react";

interface Values {
  name: string;
  code: string;
  status: string;
  siteId: string;
  useTo: string[];
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

const AddTemplate = () => {
  const params: Params = useParams();
  const history = useHistory();

  const [entities, setEntities] = useState<any>([]);
  const [editEntities, setEditEntities] = useState<any>();
  const [showEditTemplate, setShowEditTemplate] = useState<boolean>(false);
  const [templateId, setTemplateId] = useState<string>("");
  const [selectedAvailableDays, setSelectedAvailableDays] = useState<number[]>(new Array(7).fill(0));

  const classes = useStyles();
  const theme = useTheme();

  const getTemplateData = async () => {
    try {
      const { data }: any = await api({
        url: `/template/details/${params.id}`,
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
        url: "site/list/template/days",
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
              templates: entity.templates
            };
          }
        );
        setEntities(entities);
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  }

  // const getEntities = async () => {
  //   try {
  //     const { data }: any = await api({
  //       url: "/site/list?isActive=true",
  //       method: "get",
  //     });
  //     if (data.serverResponse.isError) {
  //       toast.error(data.serverResponse.message);
  //     } else {
  //       const entities = data.result.data.siteData.map(
  //         (entity: any, ind: number) => {
  //           return {
  //             id: entity._id,
  //             name: entity.name,
  //           };
  //         }
  //       );
  //       // entities.map(item => ({ ...item, availableDays: [] }))
  //       const a1 = [1,0,0,0,1,1,0];
  //       const a2 = [0,0,1,1,1,0,0];
  //       entities.forEach((element, index) =>  {
  //         element.availableDays = index % 2 == 0 ? a1 : a2;
  //       });
  //       console.log(entities);
  //       setEntities(entities);
  //     }
  //   } catch (err) {
  //     // @ts-ignore
  //     err.response && toast.error(err.message);
  //   }
  // };

  const setAvailability = (entities, editEntities) => {
    const siteData = entities.find((site) => site.id === editEntities.siteId._id);
    if (siteData) {
      for (let i = 0; i< siteData.templates.length; i++) {
        if (JSON.stringify(siteData.templates[i]) === JSON.stringify(editEntities.days)) {
          siteData.templates.splice(i, 1);
          break;
        }
      }
      const selectedAvailableDaysTemp = new Array(7).fill(0);
      siteData.templates.forEach(element => {
        for (let i=0; i< element.length; i++) {
          if (element[i] === 1) {
            selectedAvailableDaysTemp[i] = 1
          }
        }
      });
      setSelectedAvailableDays(selectedAvailableDaysTemp)
    }
  }

  useEffect(() => {
    if (editEntities && entities && entities.length > 0) {
      setAvailability(entities, editEntities);
    }
  }, [editEntities, entities])

  useEffect(() => {
    getEntities();
    params.id && getTemplateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const AddTemplateData = async (values: Values) => {
    let body = {
      code: values.code,
      name: values.name,
      siteId: values.siteId,
      days: values.useTo,
    };
    try {
      const { data }: any = await api({
        url: `/template/add`,
        method: "post",
        body,
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        setShowEditTemplate(true);
        console.log(data);

        setTemplateId(data.result.data._id)
        toast.success("Template created successfully");
        // history.push("/template");
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  const UpdateTemplateData = async (values: Values) => {
    let body = {
      code: values.code,
      name: values.name,
      siteId: values.siteId,
      days: values.useTo,
      isActive: values.status,
    };
    try {
      const { data }: any = await api({
        url: `/template/update/${params.id}`,
        method: "put",
        body,
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        toast.success("Data updated successfully");
        history.push("/template");
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  const options = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ] as any;

  const ListofDay = editEntities && editEntities?.days;

  const output: any[] = [];

  if (editEntities && editEntities?.days) {
    for (let i = 0; i < options.length; i++) {
      let element = ListofDay[i];
      if (element === 1) {
        output.push(options[i].value);
      }
    }
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: params.id ? editEntities && editEntities?.name : "",
      code: params.id ? editEntities && editEntities?.code : "",
      status: params.id ? editEntities && editEntities?.isActive : true,
      siteId: params.id ? editEntities && editEntities?.siteId._id : "",
      useTo: params.id ? output : [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      status: Yup.string().required(" Status is required"),
      code: Yup.string()
        .required(" Code is required")
        .matches(
          /^[A-Z0-9]*$/,
          "Must contain only uppercase letter with no blank space"
        ),
      siteId: Yup.string().required(" Site is required"),
      useTo: Yup.array()
        .min(1, "Atleast choose one site.")
        .required("Atleast choose one site.")
        .nullable(),
    }),
    onSubmit: (values: Values) => {
      params.id ? UpdateTemplateData(values) : AddTemplateData(values);
    },
  });

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    formik.setFieldValue("useTo", event.target.value as string[]);
  };

  const onSiteChange = (event: any) => {
    formik.setFieldValue("siteId", event.target.value);
    formik.setFieldValue("useTo", []);
    if (params && params.id && event.target.value === editEntities.siteId._id) {
      const selectedIndex: number[] = [];
      for (let j =0; j< editEntities.days.length; j++) {
        if (editEntities.days[j] === 1) {
          selectedIndex.push(j)
        }
      }
      formik.setFieldValue("useTo", selectedIndex);
      setAvailability(entities, editEntities)
    } else {
      const entity = entities.find((x) => x.id === event.target.value)
      if (entity) {
        const selectedAvailableDaysTemp = new Array(7).fill(0);
        if (entity.templates && entity.templates.length > 0) {
          entity.templates.forEach(element => {
            for (let i=0; i< element.length; i++) {
              if (element[i] === 1) {
                selectedAvailableDaysTemp[i] = 1
              }
            }
          });
        }
        setSelectedAvailableDays(selectedAvailableDaysTemp)
      }
    } 
  };

  return (
    <div>
      <Card>
        <CardHeader
          title={params.id ? "Edit Template" : "Add Template"}
        ></CardHeader>
        <CardBody>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="row">
                <div className="col-lg-4 ws-nowrap">Template Code</div>
                <div className="col-lg-8">
                  {" "}
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
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="row">
                <div className="col-lg-4 ws-nowrap">Template Name</div>
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
          </div>

          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="row ">
                <div className="col-lg-4 ws-nowrap">Site</div>
                <div className="col-lg-8">
                  {" "}
                  <div className="form-group">
                    <select
                      className="form-control top-select rounded"
                      name="siteId"
                      onChange={onSiteChange}
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
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="row">
                <div className="col-lg-4 ws-nowrap">Use To</div>
                <div className="col-lg-8">
                  {" "}
                  <div className="form-group">
                    <Selects
                      labelId="demo-mutiple-chip-label"
                      id="demo-mutiple-chip"
                      multiple
                      value={formik.values.useTo || []}
                      onChange={handleChange}
                      disabled={!Boolean(formik.values.siteId)}
                      input={<Input id="w-100" />}
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
                      {options.map((option: any, index) => (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                          style={getStyles(
                            option.value,
                            formik?.values?.useTo || [],
                            theme
                          )}
                          disabled={Boolean(selectedAvailableDays[index])}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </Selects>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {params.id ? (
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="row">
                  <div className="col-lg-4 ws-nowrap">Status</div>
                  <div className="col-lg-8">
                    {" "}
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
              </div>
            </div>
          ) : (
            ""
          )}

          {showEditTemplate || params.id ? (
            <div>
              <Link to={params && params.id ? `/template/update/${params.id}/set/schedule` : `/template/add/${templateId}/set/schedule`}>
                Edit Template
              </Link>
            </div>
          ) : ("")}
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
              <Link className="btn btn-primary" to="/template">
                Back
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddTemplate;