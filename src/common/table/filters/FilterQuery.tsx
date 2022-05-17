import React, { FC } from "react";

interface Props {
  query: string;
  setQuery: any;
  title: string;
}

export const FilterQuery: FC<Props> = (props) => {
  const { title, query, setQuery } = props;
  return (
    <div className="mt-4">
      <div className="ml-sm-2 d-flex align-items-center mt-4 mt-sm-0 mr-4">
        <span className="mr-3 ws-nowrap">{title}</span>
        <div className="form-group mb-0">
          <input
            type="text"
            className="form-control top-select"
            value={query}
            onChange={(e) => {
              e.preventDefault();
              setQuery(e.currentTarget.value);
            }}
          />
        </div>
      </div>
    </div>
  );
};
