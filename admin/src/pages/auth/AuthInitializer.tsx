import {
    useEffect,
    type ReactNode,
  } from "react";
  
  import { useDispatch } from "react-redux";
  
  import {
    setAccessToken,
    setAuthInitialized,
  } from "../../redux/appSlice";
  
  const API_URL =
    import.meta.env.VITE_API_URL;
  
  interface Props {
    children: ReactNode;
  }
  
  const AuthInitializer = ({
    children,
  }: Props) => {
    const dispatch = useDispatch();
  
    useEffect(() => {
      const initializeAuth = async () => {
        try {
          const response = await fetch(
            `${API_URL}/auth/refresh`,
            {
              method: "POST",
  
              credentials: "include",
  
              headers: {
                "Content-Type":
                  "application/json",
              },
            }
          );
  
          if (response.ok) {
            const result =
              await response.json();
  
            if (
              result.success &&
              result.data?.accessToken
            ) {
              dispatch(
                setAccessToken(
                  result.data.accessToken
                )
              );
            }
          }
        } catch (error) {
          console.error(
            "Authentication initialization failed",
            error
          );
        } finally {
          dispatch(
            setAuthInitialized(true)
          );
        }
      };
  
      initializeAuth();
    }, [dispatch]);
  
    return children;
  };
  
  export default AuthInitializer;