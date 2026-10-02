import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';

export default function Loading() {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center gap-4">
      <FontAwesomeIcon
        icon={faCode}
        className="text-muted dark:text-muted text-7xl sm:text-8xl animate-pulse"
      />
      <span className="text-muted text-sm font-medium animate-pulse tracking-wide">
        Loading Code Collab...
      </span>
    </div>
  );
}
