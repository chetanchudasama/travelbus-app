import React, { FC } from "react";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";

interface Select {
  value: any;
  label: string;
}

interface Props {
  value: any;
  setValue: (value: any) => void;
  options: Select[];
  className?: string;
}

export const Select: FC<Props> = (props) => {
  const { value, setValue, options, className } = props;
  return (
    <div
      className={`d-flex align-items-center ${className}`}
      style={{ position: "relative", minWidth: "8rem" }}
    >
      <select
        className="form-control rounded"
        name="Status"
        onChange={(e) => {
          setValue(e.target.value);
        }}
        value={value}
        style={{ paddingRight: "3rem" }}
      >
        {options.map((option: Select, ind: number) => (
          <option key={ind} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ExpandMoreRoundedIcon style={{ position: "absolute", right: "1rem" }} />
    </div>
  );
};
