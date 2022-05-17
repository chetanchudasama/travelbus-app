import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "../../../partials/controls";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { api } from "../../../common/api";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import DecoupledcEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import juice from 'juice';
import {styles} from '../../ckStyle'
interface Values {
  description: string;
}
const PrivacyPolicy = () => {
  const [entities, setEntities] = useState<any>();
  let [data] = useState("");

  const getData = async () => {
    try {
      const { data }: any = await api({
        url: `/legal/list?type=privacy_policy`,
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

  const handleChange = (e, editor) => {
    const datas = editor.getData();
    data = datas;
    // formik.setFieldValue("description", juice.inlineContent(datas, styles));
    formik.setFieldValue("description", data);
  };

  const updateData = async (values: Values) => {
    try {
      const body = {
        // description: values.description
        //   .replace(/<p>/g, "")
        //   .replace(/<\/p>/g, "")
        //   .replaceAll("<p><br></p>", "<p></p>"),
        description: juice.inlineContent(values.description, styles),
        type: "privacy_policy",
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
      description: entities?.description
        ? (entities?.description as string)
        : "",
    },
    validationSchema: Yup.object({
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: (values: Values) => {
      updateData(values);
    },
  });

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          loader.file.then((file) => {
            const formData = new FormData();
            formData.append("file", file);
            const fileSize = file;
              api({
                url: "/file/file-upload",
                method: "post",
                body: formData,
              })
                .then((res) => {
                  resolve({
                    default: res.data.data.fileUrl,
                  });
                })
                .catch((err) => {
                  reject(err);
                });
          });
        });
      },
    };
  }

  return (
    <div>
      <Card>
        <CardHeader title="Privacy Policy"></CardHeader>
        <CardBody>
          <div className="row mt-4">
            <div className="col-10">
              <div className="">
              <CKEditor
                  editor={DecoupledcEditor}
                  // config={{
                  //   toolbarLocation: "bottom"
                  // }}
                  config={{
                    extraPlugins: [uploadPlugin],
                  }}
                  className="ck"
                  data={formik.values.description || ""}
                  onReady={(editor) => {
                    editor.ui
                      .getEditableElement()
                      .parentElement.append(editor.ui.view.toolbar.element);
                  }}
                  onChange={handleChange}
                  onBlur={() => formik.setFieldTouched("description", true)}
                />

                {formik.touched.description && formik.errors.description ? (
                  <div className="text-danger mt-1 ml-1">
                    {formik.errors.description}
                  </div>
                ) : null}
              </div>
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
export default PrivacyPolicy;
