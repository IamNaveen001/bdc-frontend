export default function VerifyEmail() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-2xl">
        <h2 className="text-2xl font-extrabold text-slate-900">
          Verify Your Email
        </h2>
        <p className="mt-4 text-sm text-slate-600">
          We’ve sent a verification link to your email.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Click the link to activate your account.
        </p>
      </div>
    </div>
  );
}
