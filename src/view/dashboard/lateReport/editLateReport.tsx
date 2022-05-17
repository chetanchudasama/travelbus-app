import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "../../../partials/controls";
import "react-quill/dist/quill.snow.css";
import { api } from "../../../common/api";
import { toast } from "react-toastify";

interface Params {
  id?: string;
}
const EditReport = () => {
  const params: Params = useParams();

  const [entities, setEntities] = useState<any>();

  const getReportData = async () => {
    try {
      const { data }: any = await api({
        url: `/issue/report/details/${params.id}`,
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
    params.id && getReportData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Card>
        <CardHeader title={"Late Report"}></CardHeader>
        <CardBody>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="row">
                <div className="col-lg-4 ws-nowrap">Driver</div>
                <div className="col-lg-8">
                  {" "}
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      id="driverId"
                      name="driverId"
                      value={
                        params.id ? entities && entities?.driverId?.name : ""
                      }
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="row">
                <div className="col-lg-4 ws-nowrap">Path </div>
                <div className="col-lg-8">
                  {" "}
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      id="pathId"
                      name="pathId"
                      value={
                        params.id ? entities && entities?.pathId?.title : ""
                      }
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">
              GPS Location
            </div>
            <div className="col-10">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="gpsString"
                  name="gpsString"
                  value={params.id ? entities && entities?.gpsString : ""}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-sm-2 mb-4 mb-sm-0  ws-nowrap">Photo</div>
            <div className="col-sm-6">
              <img
                src={entities && entities?.image}
                width="250px"
                height="200px"
                className="figure-img img-fluid rounded mt-3"
                alt="Not Found"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = "/media/bg/image-not-found.jpeg";
                }}
              />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="row">
                <div className="col-lg-4 ws-nowrap">Late Reason </div>
                <div className="col-lg-8">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      id="remark"
                      name="remark"
                      value={params.id ? entities && entities?.remark : ""}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="row">
                <div className="col-lg-4 ws-nowrap">Type</div>
                <div className="col-lg-8">
                  {" "}
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      id="type"
                      name="type"
                      value={params.id ? entities && entities?.type : ""}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
        <CardFooter>
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <div className="mt-4 mt-sm-0"></div>
            <div className="mt-4 mt-sm-0">
              <Link className="btn btn-primary" to="/lateReport">
                Back
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EditReport;
