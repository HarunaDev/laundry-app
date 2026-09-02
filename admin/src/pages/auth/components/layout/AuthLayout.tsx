import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({
  children,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-100 p-2 sm:p-4">
      <div className="mx-auto flex min-h-[calc(100vh-1rem)] max-w-6xl overflow-hidden rounded-lg bg-white shadow-xl sm:min-h-[calc(100vh-2rem)]">

        {/* Left Image Section */}
        <div
          className="relative hidden w-2/5 bg-cover bg-center lg:block"
          style={{
            backgroundImage:
              "url('/images/laundry-login.jpeg')",
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-slate-950/20" />

          {/* Branding inside image */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 rounded-lg bg-black/20 px-6 py-5 text-center backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.25em] text-white/80">
              Fresh & Fold
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-wide text-white">
              LAUNDRY
            </h2>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-12">
          {children}
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;