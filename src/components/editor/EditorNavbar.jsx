'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCode,
  faShareNodes,
  faCircle,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import ShareModal from './ShareModal';

/**
 * Top navigation bar for the code editor.
 * Displays project branding, active workspace name, connection status, and share controls.
 */
export default function EditorNavbar({
  workspaceName = 'Untitled Project',
  shareId = '',
  peerId = '',
  isHost = false,
  connections = [],
  isConnected = false,
  isConnecting = false,
  hostId = '',
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="w-full h-12 bg-background-dark border-b border-white/10 px-4 flex items-center justify-between select-none">
        {/* Left: Brand and Workspace Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            title="Return to Home"
            className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors"
          >
            <FontAwesomeIcon icon={faCode} className="text-xl" />
          </Link>
          <div className="h-4 w-px bg-white/15" />
          <h1 className="text-sm font-semibold text-white/90 max-w-[200px] sm:max-w-xs truncate">
            {workspaceName}
          </h1>
        </div>

        {/* Right: Status and Share Button */}
        <div className="flex items-center gap-3">
          {/* Connection Status Badge */}
          {isHost ? (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FontAwesomeIcon icon={faUsers} className="text-[10px]" />
              <span>Host • {connections.length} {connections.length === 1 ? 'peer' : 'peers'}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10">
              <FontAwesomeIcon
                icon={faCircle}
                className={`text-[7px] ${
                  isConnected
                    ? 'text-green-400'
                    : isConnecting
                    ? 'text-amber-400 animate-pulse'
                    : 'text-red-400'
                }`}
              />
              <span className="text-white/80">
                {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Offline'}
              </span>
            </div>
          )}

          {/* Share Button */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            title="Share Workspace"
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold bg-amber-600 hover:bg-orange-600 text-white transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faShareNodes} className="text-xs" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </header>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        shareId={shareId}
        isHost={isHost}
        connections={connections}
        isConnected={isConnected}
        isConnecting={isConnecting}
        hostId={hostId}
      />
    </>
  );
}
