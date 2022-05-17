import axios, { AxiosRequestConfig, Method } from "axios";
import { setLoader } from "../../redux/actions/loaderActions";
import { store } from "../../redux/store";
import { Logout } from "./logout";
interface Props {
  url: string;
  method: string;
  body?: any;
  headers?: any;
  secure?: boolean;
}

export const api = async (props: Props) => {
  const { url, method, body, headers, secure } = props;
  const state = store.getState();
  const token = state.user.appToken;

  let config: AxiosRequestConfig<any> = {
    url,
    method: method as Method,
  };

  const getHeaders = () => {
    if (Boolean(headers)) {
      config.headers = { ...headers };
    } else {
      config.headers = {
        "Content-Type": "application/json",
      };
    }
    if (secure !== false) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  };

  const getBody = () => {
    config.data = Boolean(body) ? body : {};
  };
  switch (method) {
    case "get":
      getHeaders();
      break;
    case "post":
    case "put":
    case "delete":
    case "patch":
      getHeaders();
      getBody();
      break;
    default:
      getHeaders();
      break;
  }

  try {
    // setTimeout(() => {
    //   const loader = useSelector((state: RootState) => state.loader);
    //   if (!loader) {
    //     store.dispatch(setLoader(true));
    //   }
    // }, 2000);

    store.dispatch(setLoader(true));

    const data: any = await axios(config)
      .then(function(response) {
        return response;
      })
      .catch(function(error) {
        return error.response;
      });

    store.dispatch(setLoader(false));

    if (data.status === 401) {
      Logout();
    }
    return data;
  } catch (err) {
    store.dispatch(setLoader(false));
    // @ts-ignore
    if (err?.response?.status === 401) {
      Logout();
    } else {
      return err;
    }
  }
};
