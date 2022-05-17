import React, { FC, useState, useRef, useEffect } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "../../../partials/controls";
import SVG from "react-inlinesvg";
import { IconButton } from "@material-ui/core";
import { toAbsoluteUrl } from "../../../helpers";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { api } from "../../../common/api";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";

interface Values {
  image: string;
}

const LogoImage: FC = () => {
  const [entities, setEntities] = useState<any>();
  const inputFile = useRef<HTMLInputElement | null>(null);
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

  const getData = async () => {
    try {
      const { data }: any = await api({
        url: `/legal/list?type=app_logo`,
        method: "get",
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        setEntities(data.result.data);
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const uploadImage = async () => {
    if (inputFile.current?.files) {
      const formData = new FormData();
      formData.append("file", inputFile.current.files[0]);
      const fileSize = inputFile.current.files[0].size;
      if (fileSize <= 200000) {
        try {
          const { data }: any = await api({
            url: "/file/file-upload",
            method: "post",
            body: formData,
          });
          if (data.serverResponse.isError) {
            formik.setFieldError("image", "image is required");
            toast.error(data.serverResponse.message);
          } else {
            formik.setFieldValue("image", data.data.fileUrl);
            toast.success("image uploaded");
          }
        } catch (err) {
          formik.setFieldError("image", "image is required");
          toast.error("image not uploaded, please try again");
        }
      } else {
        toast.error("File size limit not more than 200kb");
      }
    }
  };

  const updateData = async (values: Values) => {
    try {
      const body = {
        description: values.image,
        type: "app_logo",
      };
      const { data }: any = await api({
        url: `/legal/add`,
        method: "post",
        body,
      });
      if (data.serverResponse.isError) {
        toast.error(data.serverResponse.message);
      } else {
        toast.success(data.serverResponse.message);
      }
    } catch (err) {
      // @ts-ignore
      err.response && toast.error(err.message);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      image: (entities?.description as string) || "",
    },
    validationSchema: Yup.object({
      image: Yup.string().required("Image is required"),
    }),
    onSubmit: (values: Values) => {
      updateData(values);
    },
  });

  useEffect(() => {
    if (formik.values.image === "") {
      setImgLoaded(false);
    }
  }, [formik.values.image]);

  return (
    <div>
      <Card>
        <CardHeader title="Logo Image"></CardHeader>
        <CardBody>
          <div className="row mt-4">
            <div className="col-10">
              {formik.values.image && (
                <div className="w-50 h-100">
                  <input
                    className="w-100 h-100"
                    type="file"
                    onChange={uploadImage}
                    ref={inputFile}
                    hidden
                    name="upload-image"
                    id="upload-image"
                    accept="image/jpg, image/png, image/jpeg"
                  />
                  <div className="position-relative fit-content">
                    <img
                      src={formik?.values?.image || ""}
                      alt=""
                      className="img-fluid"
                      onClick={() => {
                        let input = document.getElementById(
                          "upload-image"
                        )! as HTMLInputElement;
                        input.value = "";
                        inputFile.current?.click();
                      }}
                      onLoad={() => setImgLoaded(true)}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = "/media/bg/image-not-found.jpeg";
                      }}
                    />
                    {imgLoaded && (
                      <IconButton
                        disableRipple
                        disableFocusRipple
                        className="position-absolute delete-image-btn"
                        onClick={() => formik.setFieldValue("image", "")}
                      >
                        <CloseRoundedIcon />
                      </IconButton>
                    )}
                  </div>
                </div>
              )}
              {!formik.values.image && (
                <div className="p-1 upload-image mt-4 ">
                  <input
                    className="w-50 h-100"
                    type="file"
                    onChange={uploadImage}
                    ref={inputFile}
                    hidden
                    name="upload-image"
                    id="upload-image"
                    accept="image/jpg, image/png, image/jpeg"
                  />
                  <IconButton
                    disableRipple
                    disableFocusRipple
                    onClick={() => {
                      let input = document.getElementById(
                        "upload-image"
                      )! as HTMLInputElement;
                      input.value = "";
                      inputFile.current?.click();
                    }}
                    className="image-add-icon"
                  >
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/Files/File-plus.svg"
                      )}
                    />
                  </IconButton>
                </div>
              )}
              {formik.touched.image && formik.errors.image ? (
                <div className="text-danger mb-0 mt-4 pt-1">
                  {formik.errors.image}
                </div>
              ) : null}
            </div>
          </div>
        </CardBody>
        <CardFooter>
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <div className="mt-4 mt-sm-0">
              <button
                className="btn btn-success mr-2 mx-sm-2"
                onClick={() => formik.handleSubmit()}
              >
                Update
              </button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
export default LogoImage;
