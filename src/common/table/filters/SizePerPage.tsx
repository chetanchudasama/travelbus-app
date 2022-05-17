import React, { FC } from "react";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";

interface Props {
  paginationProps: any;
  handleSizePerPage: any;
  entities: any;
}

export const SizePerPage: FC<Props> = ({
  paginationProps,
  handleSizePerPage,
  entities,
}) => {
  const { sizePerPageList, sizePerPage } = paginationProps;
  return (
    <div className="mt-4 mr-5">
      <div className="d-flex align-items-center">
        <span>Show</span>
        <div
          className="d-flex align-items-center ml-4 top-select"
          style={{ width: "6rem", position: "relative" }}
        >
          <select
            className="form-control"
            name="size-per-page"
            onChange={(e) => {
              e.preventDefault();
              // if (
              //   paginationProps.page * parseInt(e.target.value) >
              //   entities.length
              // ) {
              //   handleSizePerPage(
              //     paginationProps,
              //     parseInt(paginationProps.sizePerPageList[0])
              //   );
              //   onPageChange(1);
              // } else {
              handleSizePerPage(paginationProps, parseInt(e.target.value));
              // }
            }}
            value={sizePerPage}
          >
            {sizePerPageList.map((option: string, ind: number) => (
              <option key={ind} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ExpandMoreRoundedIcon
            style={{ position: "absolute", right: "1rem", zIndex: 10 }}
          />
        </div>
        {/* <span>records</span> */}
      </div>
    </div>
  );
};
