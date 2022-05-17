import React, { useEffect, useState } from "react";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import { Link } from "react-router-dom";
import { Table } from "../../../common/table";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { sortCaret, headerSortingClasses } from "../../../helpers";
import { useHistory } from "react-router-dom";
import ActionIcon from "../../../../src/assets/Icons/action.svg";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from "../../../partials/controls";
import {
  sortDateString,
  sortNumber,
  sortString,
} from "../../../common/table/sorter";
import { api } from "../../../common/api";
import { toast } from "react-toastify";
import moment from "moment";

const LateReport = () => {
  const history = useHistory();

  const [totalData, setTotalData] = useState<number>(0);
  const [entities, setEntities] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);

  const renderActionButton = () => {
    return <img src={ActionIcon} alt="action"></img>;
  };

  const getEntities = async (page = 1, sizePerPage = 10) => {
    try {
      const { data }: any = await api({
        url: `/issue/report/list/?page=${page}&size=${sizePerPage}`,
        method: "get",
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        const entities = data.result.data.issueReportData.map(
          (entity: any, ind: number) => {
            return {
              ...entity,
              id: ++ind + (page - 1) * sizePerPage,
              status: entity.isActive ? "ACTIVE" : "INACTIVE",
              date: moment(entity.createdAt).format("YYYY/MM/DD"),
              name: entity?.user?.name,
              action: renderActionButton(),
              path: entity?.path?.title,
            };
          }
        );
        setTotalData(data.result.data.count);
        setEntities(entities);
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };
  useEffect(() => {
    getEntities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      dataField: "name",
      text: "Driver",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      onSort: (field: string, order: string) =>
        sortString(field, order, setEntities),
    },
    {
      dataField: "path",
      text: "Path",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      onSort: (field: string, order: string) =>
        sortDateString(field, order, setEntities),
    },
    {
      dataField: "date",
      text: "Date",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      onSort: (field: string, order: string) =>
        sortDateString(field, order, setEntities),
    },
    {
      dataField: "action",
      text: "Action",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      onSort: (field: string, order: string) =>
        sortString(field, order, setEntities),
    },
  ];

  const customTotal = (from: any, to: any, size: any) => (
    <span className="react-bootstrap-table-pagination-total">
      {totalData} records ({totalData === 0 ? 0 : (page - 1) * sizePerPage + 1}{" "}
      to {to})
    </span>
  );

  const onTableChange = async (type: any, props: any, paginationProps: any) => {
    if (type !== "sort") {
      setSizePerPage(props.sizePerPage);
      if (props.sizePerPage > paginationProps.totalSize) {
        getEntities(1, props.sizePerPage);
        setPage(1);
      } else {
        setPage(props.page);
        getEntities(props.page, props.sizePerPage);
      }
    }
  };

  const getSelectRow = {
    mode: "radio",
    clickToSelect: true,
    hideSelectColumn: true,
    onSelect: (data: any) => history.push(`/lateReport/edit/${data._id}`),
  };

  const paginationOptions = {
    custom: true,
    totalSize: totalData,
    hideSizePerPage: true,
    showTotal: true,
    page,
    sizePerPage,
    paginationTotalRenderer: customTotal,
  };

  return (
    <div>
      <Card>
        <CardHeader title={"Late Report"}></CardHeader>
        <CardBody>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="row">
                <div className="col-lg-4 ws-nowrap">Start Date</div>
                <div className="col-lg-8">
                  {" "}
                  <div className="form-group">
                    <input
                      type="date"
                      className="form-control"
                      id="title"
                      name="title"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="row">
                <div className="col-lg-4 ws-nowrap">End Date</div>
                <div className="col-lg-8">
                  {" "}
                  <div className="form-group">
                    <input
                      type="date"
                      className="form-control"
                      id="title"
                      name="title"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="row">
                <div className="col-lg-4 ws-nowrap">Driver</div>
                <div className="col-lg-8">
                  {" "}
                  <div className="input-group relative d-flex align-items-center">
                    <select
                      className="form-control top-select rounded"
                      name="status"
                      style={{ paddingRight: "3rem" }}
                    >
                      <option value="" disabled>
                        -- Select --
                      </option>
                      <option>1</option>
                      <option>2</option>
                    </select>
                    <ExpandMoreRoundedIcon
                      style={{
                        position: "absolute",
                        right: "1rem",
                        zIndex: 10,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="row">
                <div className="col-lg-4 ws-nowrap">Path</div>
                <div className="col-lg-8">
                  {" "}
                  <div className="input-group relative d-flex align-items-center">
                    <select
                      className="form-control top-select rounded"
                      name="status"
                      style={{ paddingRight: "3rem" }}
                    >
                      <option value="" disabled>
                        -- Select --
                      </option>
                      <option>1</option>
                      <option>2</option>
                    </select>
                    <ExpandMoreRoundedIcon
                      style={{
                        position: "absolute",
                        right: "1rem",
                        zIndex: 10,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>

        <CardFooter>
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <div className="mt-4 mt-sm-0">
              {/* <button className="btn btn-success mr-2 mx-sm-2">Save</button> */}
            </div>
            <div className="mt-4 mt-sm-0">
              <Link className="btn btn-primary" to="/">
                Export
              </Link>
            </div>
          </div>
        </CardFooter>
        <PaginationProvider pagination={paginationFactory(paginationOptions)}>
          {({ paginationProps, paginationTableProps }) => (
            <>
              <Table
                getSelectRow={getSelectRow}
                paginationProps={paginationProps}
                paginationOptions={paginationOptions}
                paginationTableProps={paginationTableProps}
                data={entities}
                columns={columns}
                remote
                onTableChange={(type: any, props: any) =>
                  onTableChange(type, props, paginationProps)
                }
              />
            </>
          )}
        </PaginationProvider>
      </Card>
    </div>
  );
};

export default LateReport;
