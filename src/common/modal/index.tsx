import React, { FC, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { ErrorMessage, FieldArray, FormikProvider, useFormik } from "formik";
import { toast } from "react-toastify";
import { api } from "../api";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import * as Yup from "yup";
import moment from "moment";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../helpers";

interface Props {
  name: string;
  show: any;
  onHide: any;
  action: any;
  headerText: string;
  bodyText?: string;
  loadingText?: string;
  actionText: string;
  actionStyle: string;
  dangerActionText: string;
  dangerActionStyle: string;
  onRemovelick?: any;
  siteId: string;
  templateId: any;
  pathData?: any;
  saveAndRemoveClick: any;
}

export const Dialog: FC<Props> = (props) => {
  const {
    show,
    onHide,
    headerText,
    actionText,
    actionStyle,
    dangerActionText,
    dangerActionStyle,
    siteId,
    templateId,
    pathData,
    saveAndRemoveClick
  } = props;

  const [locationList, setLocationList] = useState<any>([]);
  const [carList, setCarList] = useState<any>([]);
  const [pathId, setPathId] = useState<string>();

  const getLocationList = async () => {
    try {
      const { data }: any = await api({
        url: `/location/site/${siteId}`,
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
        setLocationList(entities);
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };
  const getCarList = async () => {
    try {
      const { data }: any = await api({
        url: `/car/site/${siteId}`,
        method: "get",
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        const carListResponse = data.result.data.carData;
        setCarList(carListResponse);
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      siteId: siteId,
      selectedCar: "",
      selectedPathList: [
        {
          location_id: "",
          start: null,
          end: null,
          seat: "",
          station_code: ""
        },
        {
          location_id: "",
          start: null,
          end: null,
          seat: "",
          station_code: ""
        },
        {
          location_id: "",
          start: null,
          end: null,
          seat: "",
          station_code: ""
        }
      ],
    },
    validationSchema: Yup.object({
      selectedCar: Yup.string().required("Please select car"),
      selectedPathList: Yup.array(
        Yup.object().shape({
          location_id: Yup.string().required("Please select location"),
          start: Yup.string().nullable().test("startTest", "Invalid Time", function (
            value
          ) {
            if ((this.options as any).index === formik.values.selectedPathList.length - 1) {
              return true
            }

            if (!value) return this.createError({
              message: "Start time is Required"
            });

            return true;
          }),
          end: Yup.string().nullable().test("endTest", "Invalid Time", function (
            value
          ) {
            if ((this.options as any).index === formik.values.selectedPathList.length - 1) {
              return true
            }

            if (!value) return this.createError({
              message: "End time is Required"
            });

            if (
              moment(this.parent.start, "HH:mm").isSameOrAfter(
                moment(this.parent.end, "HH:mm")
              )
            ) {
              return this.createError({
                message: "End time must be after start time"
              });
            }

            return true;
          })
        })
      ),
    }),
    onSubmit: (values: any) => {
      handleEdit(values);
    },
  });

  const removeAction = async () => {
    try {
      const { data }: any = await api({
        url: `/path/delete/${pathId}`,
        method: "delete",
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        saveAndRemoveClick();
        toast.success("Template removed successfully");
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  const handleEdit = async (values) => {
    if (isValidTimeSelection(values.selectedPathList) !== "" || isValidLocationSelection(values.selectedPathList) !== "") {
      return;
    }
    let locationTitle = "";
    if (values.selectedPathList && values.selectedPathList.length) {
      // eslint-disable-next-line array-callback-return
      const firstLocationCode = locationList.map((location) => {
        if (values.selectedPathList[0].location_id === location.id) {
          return location.code;
        }
      }).filter(Boolean);
      // eslint-disable-next-line array-callback-return
      const lastLocationCode = locationList.map((location) => {
        if (values.selectedPathList[values.selectedPathList.length - 1].location_id === location.id) {
          return location.code;
        }
      }).filter(Boolean);
      locationTitle = `${firstLocationCode[0]} > ${lastLocationCode[0]}`;
    }

    const reqBody = {
      siteId,
      title: locationTitle,
      carId: values.selectedCar,
      location: values.selectedPathList,
    }

    if (pathId) {
      try {
        reqBody['templateId'] = templateId
        const { data }: any = await api({
          url: `/path/update/${pathId}`,
          method: "put",
          body: reqBody,
        });
        if (data.serverResponse.isError) {
          toast.error(data.serverResponse.message);
        } else {
          saveAndRemoveClick();
          toast.success("Template updated successfully");
        }
      } catch (err) {
        // @ts-ignore
        err.response && toast.error(err.message);
      }
    } else {
      try {
        const { data }: any = await api({
          url: `/td/add/${templateId}`,
          method: "post",
          body: reqBody,
        });
        if (data.serverResponse.isError) {
          toast.error(data.serverResponse.message);
        } else {
          saveAndRemoveClick();
          toast.success("Template created successfully");
        }
      } catch (err) {
        // @ts-ignore
        err.response && toast.error(err.message);
      }
    }

  };

  const handleLocationValue = (e: any, index: number) => {
    formik.setFieldValue(`selectedPathList[${index}].location_id`, e.target.value);
  }
  const getPathData = async (pathId) => {
    try {
      const { data }: any = await api({
        url: `/path/details/${pathId}`,
        method: "get",
      });

      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        let item: any = data.result.data;
        const locationData: any = [];
        for (const itemData of item.location) {
          locationData.push({
            location_id: itemData.location_id._id,
            start: itemData.start,
            end: itemData.end,
            seat: itemData.seat,
            station_code: itemData.station_code,
          })
        }
        formik.setFieldValue('selectedCar', item.carId._id);
        formik.setFieldValue('selectedPathList', locationData);
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  const isValidTimeSelection = (timeSlots) => {
    if (!timeSlots) return;

    // compare each slot to every other slot
    for (let i = 0; i < timeSlots.length; i++) {
      const slot1 = timeSlots[i];

      if (!slot1.start || !slot1.end) continue;

      const start1 = moment(slot1.start, "HH:mm");
      const end1 = moment(slot1.end, "HH:mm");

      for (let j = 0; j < timeSlots.length; j++) {
        // prevent comparision of slot with itself
        if (i === j) continue;

        const slot2 = timeSlots[j];

        if (!slot2.start || !slot2.end) continue;
        const start2 = moment(slot2.start, "HH:mm");
        const end2 = moment(slot2.end, "HH:mm");

        if (
          start2.isBetween(start1, end1, undefined, "()") ||
          end2.isBetween(start1, end1, undefined, "()")
        ) {
          return `Overlapping time in slot ${j + 1}`;
        }
      }
    }
    // All time slots are are valid
    return "";
  };

  const isValidLocationSelection = (locationSlots) => {
    if (!locationSlots) return;

    // compare each slot to every other slot
    for (let i = 0; i < locationSlots.length; i++) {
      const slot1 = locationSlots[i];

      if (!slot1.location_id) continue;

      for (let j = 0; j < locationSlots.length; j++) {
        // prevent comparision of slot with itself
        if (i === j) continue;

        const slot2 = locationSlots[j];

        if (!slot2.location_id) continue;

        if (
          slot2.location_id === slot1.location_id
        ) {
          return `Overlapping location in slot ${j + 1}`;
        }
      }
    }
    // All time slots are are valid
    return "";
  };

  useEffect(() => {
    getLocationList();
    getCarList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pathData && pathData._def && pathData._def.extendedProps && pathData._def.extendedProps.pathId) {
      setPathId(pathData._def.extendedProps.pathId);
      getPathData(pathData._def.extendedProps.pathId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathData])

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="remove-from-blacklist-modal"
      dialogClassName="modal-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          {headerText}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormikProvider value={formik}>
          <div>
            <div className="form-group mb-5">
              <div className="row">
                <div className="align-items-center col-1 text-center">
                  <label className="font-size-h4">Car</label>
                </div>
                <div className="col-3">
                  <select
                    className="form-control top-select rounded"
                    name="selectedCar"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.selectedCar}
                    style={{ paddingRight: "3rem" }}
                  >
                    <option value="" disabled>
                      -- Select --
                    </option>
                    {carList?.length > 0 &&
                      carList?.map((option: any) => (
                        <option key={option._id} value={option._id}>
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
                  {formik.touched.selectedCar && formik.errors.selectedCar ? (
                    <div className="text-danger mt-1 ml-1">
                      {formik.errors.selectedCar}
                    </div>
                  ) : null}
                </div>
              </div>

            </div>
            <div>
              <FieldArray name="selectedPathList" validateOnChange>
                {({
                  form: { values, setValues, validateForm },
                  ...fieldArrayHelpers
                }) => {
                  const onAddClick = async () => {
                    await fieldArrayHelpers.push({
                      location_id: "",
                      start: null,
                      end: null,
                      seat: "",
                      station_code: ""
                    });
                  };

                  const closeClick = async (removeIndex) => {
                    await fieldArrayHelpers.remove(removeIndex);
                  };

                  return (
                    <>
                      <div className="row" style={{ paddingBottom: 2 }}>
                        <div className="col-1"></div>
                        <div className="col-2 font-size-h4">Location</div>
                        <div className="col-2 font-size-h4">Start Time</div>
                        <div className="col-2 font-size-h4">End Time</div>
                        <div className="col-2 font-size-h4">Seat</div>
                        <div className="col-2 font-size-h4">Station Code</div>
                        <div className="col-1"></div>
                      </div>
                      {formik.values.selectedPathList.map((pathData: any, index) => (
                        <div className="row" key={`content-${index}`}>
                          <div className="col-1 text-center" key={`label-${index}`}>{index === formik.values.selectedPathList.length - 1 ? "Last" : index + 1}</div>
                          <div className="col-2">
                            <select
                              className="form-control top-select rounded"
                              name={`selectedPathList[${index}].location_id`}
                              onChange={(e) => handleLocationValue(e, index)}
                              onBlur={formik.handleBlur}
                              value={pathData.location_id || ""}
                              style={{ paddingRight: "3rem" }}
                            >
                              <option value="" disabled>
                                -- Select --
                              </option>
                              {locationList?.length > 0 &&
                                locationList.map((option: any) => (
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
                            <ErrorMessage
                              name={`selectedPathList[${index}].location_id`}
                              component="div"
                              className="text-danger"
                            />
                          </div>
                          <div className="col-2">
                            <div className="form-group">
                              <input
                                type="time"
                                className="form-control"
                                id={`selectedPathList[${index}].start`}
                                name={`selectedPathList[${index}].start`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={pathData.start || ""}
                                disabled={index === formik.values.selectedPathList.length - 1}
                              />
                              <ErrorMessage
                                name={`selectedPathList[${index}].start`}
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          </div>
                          <div className="col-2">
                            <div className="form-group">
                              <input
                                type="time"
                                className="form-control"
                                id={`selectedPathList[${index}].end`}
                                name={`selectedPathList[${index}].end`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={pathData.end || ""}
                                disabled={index === formik.values.selectedPathList.length - 1}
                              />
                              <ErrorMessage
                                name={`selectedPathList[${index}].end`}
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          </div>
                          <div className="col-2">
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control"
                                id={`selectedPathList[${index}].seat`}
                                name={`selectedPathList[${index}].seat`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={pathData.seat || ""}
                                disabled={index === 0}
                              />
                              <ErrorMessage
                                name={`selectedPathList[${index}].seat`}
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          </div>
                          <div className="col-2">
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control"
                                id={`selectedPathList[${index}].station_code`}
                                name={`selectedPathList[${index}].station_code`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={pathData.station_code || ""}
                                disabled={index === 0}
                              />
                              <ErrorMessage
                                name={`selectedPathList[${index}].station_code`}
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          </div>
                          {formik.values.selectedPathList && formik.values.selectedPathList.length > 2 ?
                            <div className="col-1">
                              <span
                                className="cursor-pointer"
                                onClick={() => closeClick(index)}>
                                <SVG src={toAbsoluteUrl("/media/svg/icons/General/Delete.svg")} width={20} height={20} />
                              </span>
                            </div> : ""}
                        </div>
                      ))}
                      <div className="text-danger text-center">
                        {isValidTimeSelection(values.selectedPathList)}
                      </div>
                      <div className="text-danger text-center">
                        {isValidLocationSelection(values.selectedPathList)}
                      </div>
                      <div className="row m-2">
                        <div className="col-12 d-flex justify-content-center align-items-center text-center">
                          <span
                            className="cursor-pointer"
                            onClick={() => onAddClick()}>
                            <SVG src={toAbsoluteUrl("/media/svg/icons/General/Add.svg")} />
                          </span>
                          <span
                            className="mr-2 mx-sm-2 font-size-h3 cursor-pointer"
                            onClick={() => onAddClick()}
                          >
                            Add Location
                          </span>
                        </div>
                      </div>
                    </>
                  );
                }}
              </FieldArray>
            </div>
          </div>
        </FormikProvider>
      </Modal.Body>
      <Modal.Footer className="cust-mdl-ftr d-block">
        <div className="row">
          <div className="col-6">
            {Boolean(pathId) ? (
              <button
                type="button"
                onClick={removeAction}
                className={`btn btn-${dangerActionStyle} btn-elevate mr-2`}
              >
                {dangerActionText}
              </button>
            ) : ("")}
          </div>
          <div className="col-6 col-6 d-flex justify-content-end">
            <button
              type="button"
              onClick={() => formik.handleSubmit()}
              className={`btn btn-${actionStyle} btn-elevate mr-2`}
            >
              {actionText}
            </button>
            <button
              type="button"
              onClick={onHide}
              className="btn btn-light btn-elevate mr-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
