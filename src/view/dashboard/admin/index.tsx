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
import { sortNumber, sortString } from "../../../common/table/sorter";
import { FilterQuery } from "../../../common/table/filters/FilterQuery";
import { StatusFilter } from "../../../common/table/filters/StatusFilter";
import { api } from "../../../common/api";
import { toast } from "react-toastify";
import { IconButton } from "@material-ui/core";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import { PasswordDialog } from "../../../common/changePasswordModal";

const Admin: FC = () => {
  const history = useHistory();

  const [query, setQuery] = useState<string>("");
  const [totalData, setTotalData] = useState<number>(0);
  const [entities, setEntities] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [type, setType] = useState<string>("true");
  const [passwordModal, setPasswordModal] = useState<string | null>(null);

  const renderEditButton = (password: any) => {
    return (
      <IconButton
        disableRipple
        disableFocusRipple
        className="btn action-btn edit-action-btn "
        onClick={(e) => {
          setPasswordModal(password);
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
        url: `/user/list/?role=ADMIN&page=${page}&size=${sizePerPage}${isQuery}${isType}`,
        method: "get",
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        const entities = data.result.data.userData.filter(
          (admin: any) => admin.role === "ADMIN"
        );
        const AdminEntities = entities.map((entity: any, ind: number) => {
          return {
            ...entity,
            id: ++ind + (page - 1) * sizePerPage,
            status: entity.isActive ? "ACTIVE" : "INACTIVE",
            edit: renderEditButton(entity._id),
          };
        });
        setTotalData(data.result.data.countUser);
        setEntities(AdminEntities);
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
      dataField: "id",
      text: "Number",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      onSort: (field: string, order: string) =>
        sortNumber(field, order, setEntities),
    },
    {
      dataField: "name",
      text: "Username",
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
    {
      dataField: "edit",
      text: "Edit Password",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
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

  const getSelectRow = {
    mode: "radio",
    clickToSelect: true,
    hideSelectColumn: true,
    onSelect: (data: any) => history.push(`/admin/update/${data._id}`),
  };

  return (
    <Card>
      <CardHeader title="Admin">
        <CardHeaderToolbar>
          <Link className="btn btn-primary" to="/admin/add">
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
      {Boolean(passwordModal) && (
        <PasswordDialog
          name="edit"
          show={passwordModal}
          onHide={() => setPasswordModal(null)}
          action=""
          headerText="Password"
          bodyText="Are you sure you want to edit password?"
          loadingText="Password changed..."
          actionText="Modify"
          actionStyle="primary"
        />
      )}
    </Card>
  );
};

export default Admin;
