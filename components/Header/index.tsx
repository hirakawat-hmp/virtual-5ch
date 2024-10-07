import Link from 'next/link';
import dynamic from 'next/dynamic';

const ThemeToggle = dynamic(() => import('@/components/ThemeToggle'), { ssr: false });

export default function Header({fixed}: {fixed:boolean}={fixed:false}) {
  return (
    <header className={`w-full bg-primary text-background p-4 shadow-md ${fixed ? 'fixed top-0 left-0 bg-primary/70' : ''}`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-accent transition-colors">
          Virtual 5ch
        </Link>
        <nav className="flex items-center space-x-4">
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:text-accent transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-accent transition-colors">
                About
              </Link>
            </li>
          </ul>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}