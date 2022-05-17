import React, { FC, useState } from "react";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../partials/controls";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { api } from "../api";
interface Props {
  name: string;
  show: any;
  onHide: any;
  action: any;
  headerText: string;
  bodyText: string;
  loadingText: string;
  actionText: string;
  actionStyle: string;
}

export const PasswordDialog: FC<Props> = (props) => {
  const {
    name,
    show,
    onHide,
    action,
    headerText,
    bodyText,
    loadingText,
    actionText,
    actionStyle,
  } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const doAction = async () => {
    setIsLoading(true);
    await action();
    setIsLoading(false);
    onHide();
  };

  const handleEdit = async (pass: any) => {
    let body = {
      password: pass,
    };
    try {
      const { data }: any = await api({
        url: `/user/change/password/${show}`,
        method: "put",
        body,
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        toast.success("Password Changed successfully");
        onHide();
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }

    setIsLoading(false);
    onHide();
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Password is required"),
      confirmPassword: Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref("password")], "Both password need to be the same"),
    }),
    onSubmit: (values: any) => {
      handleEdit(values.password);
    },
  });
  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="remove-from-blacklist-modal"
    >
      {/*begin::Loading*/}
      {isLoading && <ModalProgressBar />}
      {/*end::Loading*/}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          {headerText}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && <span>{bodyText}</span>}
        {isLoading && <span>{loadingText}</span>}
        {name === "edit" ? (
          <div className="mt-5">
            <label>Password:</label>
            <input
              type="text"
              className="form-control mb-3"
              name="password"
              value={formik.values.password || ""}
              onChange={formik.handleChange}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-danger mt-1 ml-1 mb-4 pb-4">
                {formik.errors.password}
              </div>
            ) : null}
            <label>Re-enter Password:</label>
            <input
              type="text"
              className="form-control"
              name="confirmPassword"
              value={formik.values.confirmPassword || ""}
              onChange={formik.handleChange}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="text-danger mt-1 ml-1 mb-4 pb-4">
                {formik.errors.confirmPassword}
              </div>
            ) : null}
          </div>
        ) : (
          ""
        )}
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate mr-4"
          >
            Cancel
          </button>
          {name !== "edit" ? (
            <button
              type="button"
              onClick={doAction}
              className={`btn btn-${actionStyle} btn-elevate`}
            >
              {actionText}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => formik.handleSubmit()}
              className={`btn btn-${actionStyle} btn-elevate`}
            >
              {actionText}
            </button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
};
