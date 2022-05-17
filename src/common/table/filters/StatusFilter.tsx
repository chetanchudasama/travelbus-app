import React, { FC } from "react";
import { Select } from "../../components/Select";

interface Select {
  value: string;
  label: string;
}

interface Props {
  status: string;
  setStatus: any;
  options: Select[];
  title: string;
}

export const StatusFilter: FC<Props> = (props) => {
  const { status, setStatus, options, title } = props;
  return (
    <div className="mt-4">
      <div className="ml-sm-1 d-flex align-items-center mt-4 mt-sm-0 mr-5">
        <span className="mr-3 ml-2 ws-nowrap text-capitalize">{title}</span>
        <Select
          value={status}
          setValue={setStatus}
          options={options}
          className="top-select"
        />
      </div>
    </div>
  );
};
