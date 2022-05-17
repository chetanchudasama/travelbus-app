import React, { FC } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import {
  PaginationListStandalone,
  PaginationTotalStandalone,
} from "react-bootstrap-table2-paginator";

interface Props {
  data: any;
  getSelectRow?: any;
  columns: any;
  approveBtn?: any;
  paginationProps: any;
  paginationOptions: any;
  paginationTableProps: any;
  remote?: boolean;
  onTableChange?: any;
  keyField?: string;
}

export const Table: FC<Props> = (props) => {
  const {
    data,
    getSelectRow,
    columns,
    approveBtn,
    paginationProps,
    paginationTableProps,
    remote,
    onTableChange,
    keyField,
  } = props;

  return (
    <div>
      <BootstrapTable
        wrapperClasses="table-responsive"
        bordered={false}
        classes={`mt-4 table table-head-custom table-vertical-center overflow-hidden ${data.length >
          0 && "row-hover"}`}
        bootstrap4
        defaultSorted={[
          {
            dataField: "id",
            order: "asc",
          },
        ]}
        // @ts-ignore
        keyField={Boolean(keyField) ? keyField : "id"}
        // @ts-ignore
        data={data === null ? [] : data}
        // @ts-ignore
        columns={columns}
        selectRow={getSelectRow}
        remote={Boolean(remote)}
        onTableChange={onTableChange}
        noDataIndication="No data found"
        {...paginationTableProps}
      />

      {Boolean(approveBtn) && approveBtn}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <div>
          <PaginationTotalStandalone {...paginationProps} />
        </div>
        <div>
          <PaginationListStandalone {...paginationProps} />
        </div>
      </div>
    </div>
  );
};
