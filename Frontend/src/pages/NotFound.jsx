import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold">404</h1>

      <p>Page Not Found</p>

      <Link
        to="/"
        className="rounded-lg bg-green-700 px-5 py-3 text-white hover:bg-green-800 transition"
      >
        Go Home
      </Link>
    </section>
  );
};

export default NotFound;