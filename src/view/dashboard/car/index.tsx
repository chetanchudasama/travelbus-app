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
import { sortDateString, sortString } from "../../../common/table/sorter";
import { FilterQuery } from "../../../common/table/filters/FilterQuery";
import { StatusFilter } from "../../../common/table/filters/StatusFilter";
import { api } from "../../../common/api";
import { toast } from "react-toastify";

const Car: FC = () => {
  const history = useHistory();

  const [query, setQuery] = useState<string>("");
  const [totalData, setTotalData] = useState<number>(0);
  const [entities, setEntities] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [type, setType] = useState<string>("true");

  const renderName = (data) => {
    let seprateComa = data.map((n) => n.name);
    return seprateComa.join(" , ");
  };

  const getSelectRow = {
    mode: "radio",
    clickToSelect: true,
    hideSelectColumn: true,
    onSelect: (data: any) => history.push(`/car/update/${data._id}`),
  };

  const getEntities = async (page = 1, sizePerPage = 10) => {
    const isQuery = query !== "" ? `&search=${query}` : "";
    const isType = type !== "" ? `&isActive=${type}` : "";
    try {
      const { data }: any = await api({
        url: `/car/list/?page=${page}&size=${sizePerPage}${isQuery}${isType}`,
        method: "get",
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        const entities = data.result.data.carData.map(
          (entity: any, ind: number) => {
            return {
              ...entity,
              id: ++ind + (page - 1) * sizePerPage,
              status: entity.isActive ? "ACTIVE" : "INACTIVE",
              siteName: renderName(entity.siteDetails),
              // siteName: entity.siteDetails.map((n) => n.name),
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
      dataField: "licPlateNoHk",
      text: "Car License Code",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      onSort: (field: string, order: string) =>
        sortString(field, order, setEntities),
    },
    {
      dataField: "code",
      text: "Car Code",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      onSort: (field: string, order: string) =>
        sortString(field, order, setEntities),
    },
    {
      dataField: "name",
      text: "Car Name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      onSort: (field: string, order: string) =>
        sortDateString(field, order, setEntities),
    },
    {
      dataField: "siteName",
      text: "Site Name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      onSort: (field: string, order: string) =>
        sortString(field, order, setEntities),
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
      <CardHeader title="Car">
        <CardHeaderToolbar>
          <Link className="btn btn-primary" to="/car/add">
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

export default Car;
