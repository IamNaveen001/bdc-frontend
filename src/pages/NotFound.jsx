import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="card p-8 text-center">
      <h2 className="text-2xl font-semibold text-slate-900">Page not found</h2>
      <p className="mt-2 text-sm text-slate-500">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-4 inline-block rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
      >
        Go home
      </Link>
    </div>
  );
}
