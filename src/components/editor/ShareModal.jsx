'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faCopy,
  faPersonCircleQuestion,
  faUsers,
  faUser,
  faCircle,
} from '@fortawesome/free-solid-svg-icons';
import AnimatedModal from '@/components/common/AnimatedModal';

/**
 * Modal to display workspace share ID, connection status, and list of collaborators.
 */
export default function ShareModal({
  isOpen,
  onClose,
  shareId,
  isHost = false,
  connections = [],
  isConnected = false,
  isConnecting = false,
  hostId = '',
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!shareId) return;
    try {
      await navigator.clipboard.writeText(shareId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <AnimatedModal isOpen={isOpen} onClose={onClose} className="p-5 flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-white">Share Workspace</h2>
        <p className="text-xs text-muted mt-1">
          {isHost
            ? 'Share this ID with collaborators so they can join your live session.'
            : 'You are currently participating in a collaborative session.'}
        </p>
      </div>

      {/* Share ID Display */}
      {shareId && (
        <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-background-dark border border-white/5">
          <span className="text-xs text-muted truncate font-mono select-all">
            {shareId}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            title={copied ? 'Copied!' : 'Copy Workspace ID'}
            className={`p-2 rounded transition-colors ${
              copied
                ? 'text-green-500 hover:text-green-400'
                : 'text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            <FontAwesomeIcon icon={copied ? faCheckCircle : faCopy} className="text-sm" />
          </button>
        </div>
      )}

      {/* Collaborators / Connections Status */}
      <div className="rounded-lg bg-background-dark border border-white/5 p-3 min-h-36 flex flex-col justify-center">
        {isHost ? (
          connections.length > 0 ? (
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted">
                <FontAwesomeIcon icon={faUsers} className="text-amber-500" />
                <span>Active Collaborators ({connections.length})</span>
              </div>
              <ul className="max-h-36 overflow-y-auto space-y-1.5 divide-y divide-white/5 pr-1">
                {connections.map((peer, idx) => (
                  <li key={peer || idx} className="pt-1.5 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-white/90 font-mono">
                      <FontAwesomeIcon icon={faUser} className="text-muted text-[10px]" />
                      {peer}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-green-400">
                      <FontAwesomeIcon icon={faCircle} className="text-[6px]" /> Live
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-center py-2">
              <FontAwesomeIcon icon={faPersonCircleQuestion} className="text-4xl text-muted/60" />
              <p className="text-sm font-semibold text-muted">No Collaborators Yet</p>
              <p className="text-xs text-muted/70">
                Send the Workspace ID above to invite your peers.
              </p>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-center py-2">
            <span className="flex items-center gap-2 text-xs font-medium">
              <FontAwesomeIcon
                icon={faCircle}
                className={`text-[8px] ${
                  isConnected
                    ? 'text-green-500'
                    : isConnecting
                    ? 'text-amber-500 animate-pulse'
                    : 'text-red-500'
                }`}
              />
              <span className="text-white">
                {isConnected
                  ? 'Connected to Host'
                  : isConnecting
                  ? 'Connecting to Host...'
                  : 'Disconnected'}
              </span>
            </span>
            {hostId && (
              <span className="text-[11px] text-muted font-mono truncate max-w-full">
                Host: {hostId}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-orange-600 text-white transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </AnimatedModal>
  );
}
