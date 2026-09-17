import { Navigate, useLocation } from "react-router-dom";
import type { JSX } from "react";
import { useSelector } from "react-redux";
// import type { RootState } from "./redux/store";
import { selectIsAuthenticated, selectAuthInitialized } from "./redux/appSlice";

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

  const location = useLocation();

  const isAuthenticated = useSelector(
    selectIsAuthenticated
  );

  // const accessToken = useSelector(selectAccessToken);

  const authInitialized = useSelector(
    selectAuthInitialized
  );

  console.log("AUTH CHECK:", {
    path: location.pathname,
    authInitialized,
    isAuthenticated,
  });


  if (!authInitialized) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
