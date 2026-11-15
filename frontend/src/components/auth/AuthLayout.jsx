import { Link } from "react-router-dom";

function AuthLayout({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLink,
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-lg">

        {/* Logo */}

        <div className="mb-8 text-center flex flex-col items-center">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-xs">
              B
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-3xl font-bold tracking-tight text-slate-900">
                BillBuddy
              </span>
              <span className="rounded-md border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-xs font-semibold text-emerald-700">
                AI
              </span>
            </div>
          </div>

          <p className="text-slate-500 text-sm">
            Smart Financial & Bill Management
          </p>
        </div>

        {/* Card */}

        <div className="rounded-2xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-xs">

          {/* Heading */}

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {title}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {subtitle}
            </p>
          </div>

          {/* Form */}

          {children}

          {/* Footer */}

          <div className="mt-8 border-t border-slate-100 pt-6 text-center">

            <p className="text-sm text-slate-500">
              {footerText}{" "}

              <Link
                to={footerLink}
                className="font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
              >
                {footerLinkText}
              </Link>

            </p>

          </div>

        </div>

        {/* Copyright */}

        <p className="mt-8 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} BillBuddy AI. All rights reserved.
        </p>

      </div>
    </div>
  );
}

export default AuthLayout;