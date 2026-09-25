import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { useAppDispatch } from "./hooks";
import {
  logOut,
  setAuthInitialized,
  setUser,
} from "./appSlice";
import { useRefreshMutation } from "./slices/authApiSlice";

interface AuthBootstrapProps {
  children: ReactNode;
}

export function AuthBootstrap({
  children,
}: AuthBootstrapProps) {
  const dispatch = useAppDispatch();

  const [refresh] = useRefreshMutation();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async (): Promise<void> => {
      try {
        const response = await refresh().unwrap();

        if (
          response.success &&
          response.data?.userId &&
          response.data?.accessToken
        ) {
          dispatch(
            setUser({
              userId: response.data.userId,
              accessToken: response.data.accessToken,
            })
          );
        } else {
          dispatch(logOut());
        }
      } catch {
        dispatch(logOut());
      } finally {
        if (mounted) {
          dispatch(setAuthInitialized(true));
          setIsReady(true);
        }
      }
    };

    void initializeAuth();

    return () => {
      mounted = false;
    };
  }, [dispatch, refresh]);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}