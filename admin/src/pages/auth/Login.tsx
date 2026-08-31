import { useState } from "react";
import type { SubmitEvent } from "react";
  
  import { useLogin } from "../auth/hooks/useLogin";
  
  const Login = () => {
    const [email, setEmail] =
      useState("");
  
    const [password, setPassword] =
      useState("");
  
    const {
      login,
      isLoading,
      errorMessage,
    } = useLogin();
  
    const handleSubmit = async (
      event: SubmitEvent<HTMLFormElement>
    ) => {
      event.preventDefault();
  
      if (!email || !password) {
        return;
      }
  
    //   try {
        await login({
          email,
          password,
        });
    //   } catch {
        // The hook exposes the error
        // message to the UI.
    //   }
    };
  
    return (
      <div className="login-page">
        <div className="login-container">
  
          <div className="login-header">
            <h1>Welcome Back</h1>
  
            <p>
              Login to your admin account
            </p>
          </div>
  
          {errorMessage && (
            <div className="login-error">
              {errorMessage}
            </div>
          )}
  
          <form
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="email">
                Email
              </label>
  
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="user@example.com"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
  
            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>
  
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>
  
            <button
              type="submit"
              disabled={
                isLoading ||
                !email ||
                !password
              }
            >
              {isLoading
                ? "Signing in..."
                : "Sign In"}
            </button>
          </form>
  
        </div>
      </div>
    );
  };
  
  export default Login;