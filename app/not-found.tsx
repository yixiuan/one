import Link from "next/link";

export const runtime = "edge";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy px-6 text-center">
      <span className="font-display text-7xl font-black text-amber">404</span>
      <h1 className="mt-4 font-display text-2xl font-bold text-white">
        Page Not Found
      </h1>
      <p className="mt-3 max-w-md text-white/60">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/en" className="btn-primary mt-8">
        Back to Home
      </Link>
    </div>
  );
}
