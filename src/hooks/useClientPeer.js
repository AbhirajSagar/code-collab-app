import { useState, useEffect, useRef, useCallback } from 'react';
import Peer from 'peerjs';
import { MESSAGE_TYPES } from '@/constants/editor';
import { parseShareId } from '@/utils/workspace';

/**
 * Custom hook to manage the Client WebRTC PeerJS lifecycle.
 * Connects directly to the host peer to receive and push code synchronization events.
 *
 * @param {string} rawShareId
 * @returns {{
 *   peerId: string,
 *   hostId: string,
 *   workspaceName: string,
 *   isConnected: boolean,
 *   isConnecting: boolean,
 *   connectionError: string | null,
 *   code: string,
 *   handleCodeChange: (newCode: string) => void
 * }}
 */
export function useClientPeer(rawShareId) {
  const { hostId, workspaceName } = parseShareId(rawShareId);

  const [peerId, setPeerId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(Boolean(hostId));
  const [connectionError, setConnectionError] = useState(null);
  const [code, setCode] = useState('');

  const peerRef = useRef(null);
  const connectionRef = useRef(null);

  const handleCodeChange = useCallback((newCode) => {
    const safeCode = newCode ?? '';
    setCode(safeCode);

    if (connectionRef.current && connectionRef.current.open) {
      connectionRef.current.send({
        type: MESSAGE_TYPES.CODE,
        content: safeCode,
      });
    }
  }, []);

  useEffect(() => {
    if (!hostId) {
      setIsConnecting(false);
      setConnectionError('Invalid or missing host workspace ID.');
      return;
    }

    let isMounted = true;
    const peer = new Peer();
    peerRef.current = peer;

    peer.on('open', (id) => {
      if (!isMounted) return;
      setPeerId(id);

      const conn = peer.connect(hostId, {
        reliable: true,
      });
      connectionRef.current = conn;

      conn.on('open', () => {
        if (!isMounted) return;
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionError(null);
      });

      conn.on('data', (data) => {
        if (data?.type === MESSAGE_TYPES.CODE) {
          setCode(data.content ?? '');
        }
      });

      conn.on('close', () => {
        if (!isMounted) return;
        setIsConnected(false);
        setIsConnecting(false);
      });

      conn.on('error', (err) => {
        if (!isMounted) return;
        console.error('Client connection error:', err);
        setIsConnected(false);
        setIsConnecting(false);
        setConnectionError('Failed to connect to host workspace.');
      });
    });

    peer.on('error', (err) => {
      if (!isMounted) return;
      console.error('Client PeerJS error:', err);
      setIsConnected(false);
      setIsConnecting(false);
      setConnectionError('Peer connection failed. Please verify the workspace ID.');
    });

    return () => {
      isMounted = false;
      if (connectionRef.current) {
        try {
          connectionRef.current.close();
        } catch {
          // ignore cleanup errors
        }
        connectionRef.current = null;
      }
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
    };
  }, [hostId]);

  return {
    peerId,
    hostId,
    workspaceName,
    isConnected,
    isConnecting,
    connectionError,
    code,
    handleCodeChange,
  };
}
