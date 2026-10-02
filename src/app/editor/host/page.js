'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useHostPeer } from '@/hooks/useHostPeer';
import EditorLayout from '@/components/editor/EditorLayout';
import Loading from '@/components/common/Loading';
import { DEFAULT_WORKSPACE_NAME } from '@/constants/editor';

function HostEditorContent() {
  const searchParams = useSearchParams();
  const rawWorkspaceName = searchParams.get('name');
  const workspaceName = (rawWorkspaceName && decodeURIComponent(rawWorkspaceName)) || DEFAULT_WORKSPACE_NAME;

  const {
    peerId,
    shareId,
    connections,
    code,
    handleCodeChange,
    isReady,
  } = useHostPeer(workspaceName);

  if (!isReady) {
    return <Loading />;
  }

  return (
    <EditorLayout
      workspaceName={workspaceName}
      shareId={shareId}
      peerId={peerId}
      isHost={true}
      connections={connections}
      code={code}
      onCodeChange={handleCodeChange}
    />
  );
}

export default function HostEditorPage() {
  return (
    <Suspense fallback={<Loading />}>
      <HostEditorContent />
    </Suspense>
  );
}