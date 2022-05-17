import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "../../../partials/controls";
import { useFormik } from "formik";
import * as Yup from "yup";
import { api } from "../../../common/api";
import { toast } from "react-toastify";
interface Values {
  reachedThresholdValue: number;
}
const ReachedValue = () => {
  const saveReachThresholdData = async (values: Values) => {
    let body = {
      reachedThresholdValue: values.reachedThresholdValue,
    };
    try {
      const { data }: any = await api({
        url: `/system/configUpdate`,
        method: "post",
        body,
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        toast.success("Updated successfully");
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  useEffect(() => {
    getReachThresholdData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getReachThresholdData = async () => {
    try {
      const { data }: any = await api({
        url: `/system/getConfig`,
        method: "get",
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        let item: any = data.result.data;
        formik.setFieldValue("reachedThresholdValue", item.reachedThresholdValue)

      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      reachedThresholdValue: 0
    },
    validationSchema: Yup.object({
      reachedThresholdValue: Yup.string().required("Distance is required"),
    }),
    onSubmit: (values: Values) => {
      saveReachThresholdData(values);
    },
  });

  return (
    <div>
      <Card>
        <CardHeader title={"Arrived Line"}></CardHeader>
        <CardBody>
          <div className="row mt-4">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">Value (in meters)</div>
            <div className="col-4">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="reachedThresholdValue"
                  name="reachedThresholdValue"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.reachedThresholdValue}
                />
                {formik.touched.reachedThresholdValue && formik.errors.reachedThresholdValue ? (
                  <div className="text-danger mt-1 ml-1">
                    {formik.errors.reachedThresholdValue}
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
                Send
              </button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ReachedValue;
