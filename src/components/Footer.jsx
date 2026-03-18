export default function Footer() {
  return (
    <footer className="relative mt-20 bg-gradient-to-r from-red-600 via-red-700 to-red-800">
      <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-white">
        <p className="font-medium">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold">
            Blood Donation Management System
          </span>
        </p>

        <p className="mt-1 text-xs text-red-100">
          An initiative by TCE NSS · Saving lives, one donation at a time ❤️
        </p>
      </div>
    </footer>
  );
}
