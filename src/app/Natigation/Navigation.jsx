import Link from 'next/link';

const Navigation = () => {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/ingredients">Ingredientes</Link>
    </nav>
  );
}

export default Navigation;
