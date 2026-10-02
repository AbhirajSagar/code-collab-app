'use client';

import EditorNavbar from './EditorNavbar';
import CodeEditor from './CodeEditor';

/**
 * Common layout for the collaborative editor pages.
 * Handles navbar, Monaco editor mounting, and responsive height.
 */
export default function EditorLayout({
  workspaceName,
  shareId,
  peerId,
  isHost = false,
  connections = [],
  isConnected = false,
  isConnecting = false,
  hostId = '',
  code = '',
  onCodeChange,
}) {
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-background-dark">
      <EditorNavbar
        workspaceName={workspaceName}
        shareId={shareId}
        peerId={peerId}
        isHost={isHost}
        connections={connections}
        isConnected={isConnected}
        isConnecting={isConnecting}
        hostId={hostId}
      />
      <main className="w-full flex-1 flex overflow-hidden">
        <CodeEditor
          code={code}
          onChange={onCodeChange}
        />
      </main>
    </div>
  );
}
