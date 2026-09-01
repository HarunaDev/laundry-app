import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";

// interface UserInfo {
//   accessToken?: string;
// }
interface Props {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: Props): JSX.Element => {
  //   const storedUserInfo = localStorage.getItem("userInfo");

  //   const userInfo: UserInfo | null = storedUserInfo
  //     ? JSON.parse(storedUserInfo)
  //     : null;
  //   const token = userInfo?.accessToken; // or however you store auth

  //   if (!token) {
  //     return <Navigate to="/login" replace />;
  //   }

  const accessToken = useSelector((state: RootState) => state.app.accessToken);

  const authInitialized = useSelector(
    (state: RootState) => state.app.authInitialized
  );

  if (!authInitialized) {
    return <div>Loading...</div>;
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
