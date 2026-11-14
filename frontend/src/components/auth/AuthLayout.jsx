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

        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-blue-600">
            BillBuddy
          </h1>

          <p className="mt-2 text-slate-500 text-lg">
            Your Personal AI Finance Assistant
          </p>
        </div>

        {/* Card */}

        <div className="rounded-3xl border border-slate-200 bg-[#FAF9F6] p-10 shadow-md">

          {/* Heading */}

          <div className="mb-8">
            <h2 className="text-4xl font-bold text-slate-900">
              {title}
            </h2>

            <p className="mt-3 text-slate-500">
              {subtitle}
            </p>
          </div>

          {/* Form */}

          {children}

          {/* Footer */}

          <div className="mt-8 border-t border-slate-200 pt-6 text-center">

            <p className="text-sm text-slate-500">
              {footerText}{" "}

              <Link
                to={footerLink}
                className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
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