// import { useHistory } from "react-router-dom";
import { clearUser } from "../../redux/actions/userActions";
import { store } from "../../redux/store";


export const Logout = () => {
  // const history = useHistory();
  try {
    // const { data }: any = await axios({
    //   url: "/user/logout",
    //   method: "post",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${store.getState().user.appToken}`,
    //   },
    //   data: {},
    // });
    // if (data.serverResponse.isError) {
    //   toast.error(data.serverResponse.message);
    // } else {
    //   store.dispatch(clearUser());
    //   toast.success(data.serverResponse.message);
    // }
    store.dispatch(clearUser());
    // history.push("/auth/login");
  } catch (err) {
    // toast.error("token is invalid");
    store.dispatch(clearUser());
    // history.push("/auth/login");
  }
};