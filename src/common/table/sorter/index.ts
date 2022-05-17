import moment from "moment";

const fn = (n: number, m: any, fields: any) => {
  return n > 1 ? m[fields[0]][fields[1]] : m[fields[0]];
};

export const sortNumber = (field: string, order: string, setData: any) => {
  const fields = field.split(".");
  const length = fields.length;
  setData((prev: any) =>
    prev.sort((a: any, b: any) => {
      if (order === "asc") {
        return fn(length, a, fields) - fn(length, b, fields);
      } else {
        return fn(length, b, fields) - fn(length, a, fields);
      }
    })
  );
};

export const sortString = (field: string, order: string, setData: any) => {
  const fields = field.split(".");
  const length = fields.length;
  setData((prev: any) =>
    prev.sort((a: any, b: any) => {
      if (order === "asc") {
        if (fn(length, a, fields) < fn(length, b, fields)) {
          return 1;
        } else if (fn(length, a, fields) > fn(length, b, fields)) {
          return -1;
        } else {
          return 0;
        }
      } else {
        if (fn(length, a, fields) < fn(length, b, fields)) {
          return -1;
        } else if (fn(length, a, fields) > fn(length, b, fields)) {
          return 1;
        } else {
          return 0;
        }
      }
    })
  );
};

export const sortDateString = (field: string, order: string, setData: any) => {
  const fields = field.split(".");
  const length = fields.length;
  setData((prev: any) =>
    prev.sort((a: any, b: any) => {
      if (order === "asc") {
        return (
          Number(moment(fn(length, a, fields)).format("x")) -
          Number(moment(fn(length, b, fields)).format("x"))
        );
      } else {
        return (
          Number(moment(fn(length, b, fields)).format("x")) -
          Number(moment(fn(length, a, fields)).format("x"))
        );
      }
    })
  );
};
