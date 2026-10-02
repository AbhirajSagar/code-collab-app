'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useClientPeer } from '@/hooks/useClientPeer';
import EditorLayout from '@/components/editor/EditorLayout';
import Loading from '@/components/common/Loading';

function ClientEditorContent() {
  const searchParams = useSearchParams();
  const rawShareId = searchParams.get('id') || '';

  const {
    peerId,
    hostId,
    workspaceName,
    isConnected,
    isConnecting,
    connectionError,
    code,
    handleCodeChange,
  } = useClientPeer(rawShareId);

  return (
    <div className="relative w-full h-full">
      {connectionError && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 bg-red-600/90 text-white text-xs px-4 py-2 rounded-lg shadow-lg">
          {connectionError}
        </div>
      )}
      <EditorLayout
        workspaceName={workspaceName}
        shareId={rawShareId}
        peerId={peerId}
        isHost={false}
        isConnected={isConnected}
        isConnecting={isConnecting}
        hostId={hostId}
        code={code}
        onCodeChange={handleCodeChange}
      />
    </div>
  );
}

export default function ClientEditorPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ClientEditorContent />
    </Suspense>
  );
}