import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  return (
    <header className="w-full h-14 flex justify-between items-center px-6">
      <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
        <FontAwesomeIcon icon={faCode} className="text-2xl sm:text-3xl text-amber-500 font-extrabold" />
        <span className="text-muted font-extrabold text-lg sm:text-xl tracking-tight">Code Collab</span>
      </Link>
    </header>
  );
}
