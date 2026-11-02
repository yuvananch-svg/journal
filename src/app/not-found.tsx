import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="not-found">
      <p>404 · PAGE NOT FOUND</p>
      <h1>This page is outside the workspace.</h1>
      <Link href="/dashboard">Back to Dashboard →</Link>
    </div>
  );
}
