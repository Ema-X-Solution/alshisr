import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>404</h1>
      <p>Page not found</p>
      <p>
        <Link href="/ar">Home</Link>
      </p>
    </div>
  );
}
