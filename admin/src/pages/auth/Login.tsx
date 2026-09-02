// import { useState } from "react";
// import type { SubmitEvent } from "react";
  
//   import { useLogin } from "../auth/hooks/useLogin";
  
//   const Login = () => {
//     const [email, setEmail] =
//       useState("");
  
//     const [password, setPassword] =
//       useState("");
  
//     const {
//       login,
//       isLoading,
//       errorMessage,
//     } = useLogin();
  
//     const handleSubmit = async (
//       event: SubmitEvent<HTMLFormElement>
//     ) => {
//       event.preventDefault();
  
//       if (!email || !password) {
//         return;
//       }
  
//     //   try {
//         await login({
//           email,
//           password,
//         });
//     //   } catch {
//         // The hook exposes the error
//         // message to the UI.
//     //   }
//     };
  
//     return (
//       <div className="login-page">
//         <div className="login-container">
  
//           <div className="login-header">
//             <h1>Welcome Back</h1>
  
//             <p>
//               Login to your admin account
//             </p>
//           </div>
  
//           {errorMessage && (
//             <div className="login-error">
//               {errorMessage}
//             </div>
//           )}
  
//           <form
//             onSubmit={handleSubmit}
//           >
//             <div className="form-group">
//               <label htmlFor="email">
//                 Email
//               </label>
  
//               <input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(event) =>
//                   setEmail(
//                     event.target.value
//                   )
//                 }
//                 placeholder="user@example.com"
//                 autoComplete="email"
//                 disabled={isLoading}
//               />
//             </div>
  
//             <div className="form-group">
//               <label htmlFor="password">
//                 Password
//               </label>
  
//               <input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(event) =>
//                   setPassword(
//                     event.target.value
//                   )
//                 }
//                 placeholder="Enter your password"
//                 autoComplete="current-password"
//                 disabled={isLoading}
//               />
//             </div>
  
//             <button
//               type="submit"
//               disabled={
//                 isLoading ||
//                 !email ||
//                 !password
//               }
//             >
//               {isLoading
//                 ? "Signing in..."
//                 : "Sign In"}
//             </button>
//           </form>
  
//         </div>
//       </div>
//     );
//   };
  
//   export default Login;


import {
    useState,
    type SubmitEvent,
  } from "react";
  
  import { useLogin } from "./hooks/useLogin";
  
  import AuthLayout from "./components/layout/AuthLayout";
  
  import TextInput from "./components/ui/TextInput";
  
  import PasswordInput from "./components/ui/PasswordInput";
  
  import PrimaryButton from "../../components/ui/PrimaryButton";
  
  import {
    EmailIcon,
    LaundryIcon,
    LockIcon,
  } from "./components/ui/AuthIcons";
  
  
  const Login = () => {
    const [email, setEmail] =
      useState("");
  
    const [password, setPassword] =
      useState("");
  
    const [rememberMe, setRememberMe] =
      useState(false);
  
  
    const {
      login,
      isLoading,
      errorMessage,
    } = useLogin();
  
  
    const handleSubmit = async (
      event: SubmitEvent<HTMLFormElement>
    ) => {
      event.preventDefault();
  
  
      if (!email.trim() || !password) {
        return;
      }
  
  
      try {
        await login({
          email,
          password,
        });
  
        // rememberMe can later be used
        // to control session behavior.
        console.log(
          "Remember me:",
          rememberMe
        );
  
      } catch {
        // RTK Query error state is handled
        // by the useLogin hook.
      }
    };
  
  
    return (
      <AuthLayout>
  
        <div className="w-full max-w-md">
  
          {/* Logo */}
  
          <div className="mb-10 flex flex-col items-center">
  
            <div className="mb-4 flex items-center gap-3">
  
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-600 text-white">
  
                <LaundryIcon />
  
              </div>
  
  
              <h1 className="text-2xl font-semibold text-slate-800">
  
                Laundry{" "}
  
                <span className="text-blue-600">
                  Admin
                </span>
  
              </h1>
  
            </div>
  
  
            <p className="text-sm text-slate-500">
  
              Sign in to your admin account
  
            </p>
  
          </div>
  
  
          {/* Error */}
  
          {errorMessage && (
  
            <div
              className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              role="alert"
            >
  
              {errorMessage}
  
            </div>
  
          )}
  
  
          {/* Login Form */}
  
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
  
            {/* Email */}
  
            <TextInput
              id="email"
              label="Email address"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="admin@laundry.com"
              autoComplete="email"
              disabled={isLoading}
              icon={<EmailIcon />}
            />
  
  
            {/* Password */}
  
            <PasswordInput
              id="password"
              label="Password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={isLoading}
              icon={<LockIcon />}
            />
  
  
            {/* Remember Me */}
  
            <div className="flex items-center justify-between">
  
              <label className="flex cursor-pointer items-center gap-2">
  
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(
                      event.target.checked
                    )
                  }
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
  
                <span className="text-sm text-slate-500">
                  Remember me
                </span>
  
              </label>
  
  
              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </button>
  
            </div>
  
  
            {/* Submit */}
  
            <PrimaryButton
              type="submit"
              disabled={
                isLoading ||
                !email.trim() ||
                !password
              }
            >
  
              {isLoading
                ? "Signing in..."
                : "Sign In"}
  
            </PrimaryButton>
  
          </form>
  
  
          {/* Footer */}
  
          <p className="mt-16 text-center text-xs text-slate-400">
  
            © {new Date().getFullYear()} Laundry App.
            All rights reserved.
  
          </p>
  
        </div>
  
      </AuthLayout>
    );
  };
  
  
  export default Login;