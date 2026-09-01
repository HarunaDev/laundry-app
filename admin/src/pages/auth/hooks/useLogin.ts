// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";

// import { useLoginMutation } from "../../../redux/slices/authApiSlice";

// import { setUserInfo } from "../../../redux/appSlice";

// interface LoginCredentials {
//   email: string;
//   password: string;
// }

// interface BackendError {
//     success?: boolean;
//     errorCode?: string;
//     message?: string;
//     details?: string[];
//   }
  
//   interface RTKQueryError {
//     status?: number;
//     data?: BackendError;
//   }

// export const useLogin = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [loginMutation, { isLoading, error, isError, isSuccess }] =
//     useLoginMutation();

//   const login = async (credentials: LoginCredentials) => {
//     // try {
//       const response = await loginMutation(credentials).unwrap();

//       const { userId, tokens } = response.data;

//       dispatch(
//         setUserInfo({
//           userId,
//           accessToken: tokens.accessToken,
//           refreshToken: tokens.refreshToken,
//         })
//       );

//       navigate("/dashboard");

//       return response;
//     // } catch (error) {
//     //   throw error;
//     // }
//   };

//   const getErrorMessage = (): string => {
//     const apiError =
//       error as RTKQueryError | undefined;

//     if (apiError?.data?.message) {
//       return apiError.data.message;
//     }

//     if (
//       apiError?.status === "FETCH_ERROR"
//     ) {
//       return "Unable to connect to the server.";
//     }

//     return "Unable to login. Please try again.";
//   };

//   return {
//     login,
//     isLoading,
//     isError,
//     isSuccess,
//     error,
//     errorMessage: isError
//       ? getErrorMessage()
//       : null,
//   };
// };


import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import type {
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import {
  useLoginMutation,
  type LoginBody,
} from "../../../redux/slices/authApiSlice";

import {
    setCredentials
} from "../../../redux/appSlice";

interface BackendError {
  success?: boolean;
  errorCode?: string;
  message?: string;
  details?: string[];
}

const isBackendError = (
  data: unknown
): data is BackendError => {
  return (
    typeof data === "object" &&
    data !== null && "message" in data
  );
};

export const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [
    loginMutation,
    {
      isLoading,
      error,
      isError,
      isSuccess,
    },
  ] = useLoginMutation();

  const login = async (
    credentials: LoginBody
  ) => {
    const response =
      await loginMutation(
        credentials
      ).unwrap();

    const {
      userId,
      accessToken,
    } = response.data;

    dispatch(
      setCredentials({
        user: {
            userId
        },
        accessToken
      })
    );

    navigate("/dashboard");

    return response;
  };

  const getErrorMessage = (): string => {
    if (!error) {
      return "Unable to login. Please try again.";
    }

    const apiError =
      error as FetchBaseQueryError;

    if (
      apiError.status === "FETCH_ERROR"
    ) {
      return "Unable to connect to the server.";
    }

    if (
      apiError.status === "PARSING_ERROR"
    ) {
      return "The server returned an invalid response.";
    }

    if (
      apiError.status === "TIMEOUT_ERROR"
    ) {
      return "The request timed out. Please try again.";
    }

    if (
      apiError.status === "CUSTOM_ERROR"
    ) {
      return "An unexpected error occurred.";
    }

    if (
      typeof apiError.status === "number"
    ) {
      if (
        isBackendError(apiError.data) &&
        apiError.data.message
      ) {
        return apiError.data.message;
      }

      if (apiError.status === 401) {
        return "Invalid email or password.";
      }

      if (apiError.status === 403) {
        return "You are not authorized to access this application.";
      }

      if (apiError.status >= 500) {
        return "A server error occurred. Please try again later.";
      }
    }

    return "Unable to login. Please try again.";
  };

  return {
    login,
    isLoading,
    isError,
    isSuccess,
    error,
    errorMessage: isError
      ? getErrorMessage()
      : null,
  };
};