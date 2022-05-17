import React, { FC, useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import {
  sortCaret,
  headerSortingClasses,
  toAbsoluteUrl,
} from "../../../helpers";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../partials/controls";
import { Link, useHistory } from "react-router-dom";
import { SizePerPage } from "../../../common/table/filters/SizePerPage";
import { Table } from "../../../common/table";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import {
  sortDateString,
  sortNumber,
  sortString,
} from "../../../common/table/sorter";
import { FilterQuery } from "../../../common/table/filters/FilterQuery";
import { StatusFilter } from "../../../common/table/filters/StatusFilter";
import { api } from "../../../common/api";
import { toast } from "react-toastify";
import { IconButton } from "@material-ui/core";
import EditRoundedIcon from "@material-ui/icons/Restore";
import moment from "moment";

const ScheduleDaily: FC = () => {
  const history = useHistory();

  const [query, setQuery] = useState<string>("");
  const [totalData, setTotalData] = useState<number>(0);
  const [entities, setEntities] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [type, setType] = useState<string>("true");

  const dayNameList = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ] as any;

  const renderScheduleButton = (siteId: any) => {
    return (
      <IconButton
        disableRipple
        disableFocusRipple
        className="btn action-btn edit-action-btn "
        onClick={(e) => {
          runManualSchedule(siteId);
          e.stopPropagation();
        }}
      >
        <EditRoundedIcon />
      </IconButton>
    );
  };

  const getEntities = async (page = 1, sizePerPage = 10) => {
    const isQuery = query !== "" ? `&search=${query}` : "";
    const isType = type !== "" ? `&isActive=${type}` : "";
    try {
      const { data }: any = await api({
        url: `site/list/template/days/?page=${page}&size=${sizePerPage}${isQuery}${isType}`,
        method: "get",
      });

      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        const entitiesTemp = data.result.data.siteData.map(
          (entity: any, ind: number) => {
            return {
              ...entity,
              id: ++ind + (page - 1) * sizePerPage,
              status: entity.isActive ? "ACTIVE" : "INACTIVE",
              edit: renderScheduleButton(entity._id),
            };
          }
        );
        const dayName = moment().format("dddd, MMMM Do YYYY, h:mm:ss a").split(",")[0];
        const index = dayNameList.findIndex((x) => x.label === dayName);
        const entitiesData: any = [];
        for (const element of entitiesTemp) {
          const selectedAvailableDaysTemp = new Array(7).fill(0);
          if (element.templates) {
            for (const elementChild of element.templates) {
              for (let i=0; i < elementChild.length; i++) {
                if (elementChild[i] === 1)
                selectedAvailableDaysTemp[i] = 1;
              }
            }
          }
          if (selectedAvailableDaysTemp[index] === 1) {
            entitiesData.push(element);
          }
        }
        setTotalData(data.result.data.countSite);
        setEntities(entitiesData);
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
      dataField: "code",
      text: "Site Code",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      onSort: (field: string, order: string) =>
        sortString(field, order, setEntities),
    },
    {
      dataField: "name",
      text: "Site Name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      onSort: (field: string, order: string) =>
        sortDateString(field, order, setEntities),
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      onSort: (field: string, order: string) =>
        sortString(field, order, setEntities),
    },
    {
      dataField: "edit",
      text: "Run Schedule",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
  ];

  const runManualSchedule = async (siteId: any) => {
    try {
      const { data }: any = await api({
        url: `/schedule/create/${siteId}`,
        method: "patch",
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        toast.success("Schedule created successfully");
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

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
    onSelect: (data: any) =>
      history.push({ pathname: `/schedule/daily/${data._id}/template`, state: { siteName: data.name }})
  };

  const handleSizePerPage = (
    { page, onSizePerPageChange }: any,
    newSizePerPage: any
  ) => {
    onSizePerPageChange(newSizePerPage, page);
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
    <Card>
      <CardHeader title="Daily Schedule">
        <CardHeaderToolbar>
          <Link className="btn btn-primary" to="/site/add">
            Add
          </Link>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <PaginationProvider pagination={paginationFactory(paginationOptions)}>
          {({ paginationProps, paginationTableProps }) => (
            <>
              <div className="d-flex flex-column flex-sm-row">
                <SizePerPage
                  paginationProps={paginationProps}
                  handleSizePerPage={handleSizePerPage}
                  entities={entities}
                />
                <FilterQuery query={query} setQuery={setQuery} title="Search" />
                <StatusFilter
                  status={type}
                  setStatus={setType}
                  options={[
                    { label: "All", value: "" },
                    { label: "Active", value: "true" },
                    { label: "Inactive", value: "false" },
                  ]}
                  title="Type"
                />
                <button
                  className="btn btn-primary mt-4"
                  onClick={() => {
                    setPage(1);
                    getEntities(1, sizePerPage);
                  }}
                >
                  <span className="navigation-icon icon-white">
                    <SVG
                      src={toAbsoluteUrl("/media/svg/icons/General/Search.svg")}
                    />
                  </span>
                </button>
              </div>
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
      </CardBody>
    </Card>
  );
};

export default ScheduleDaily;
