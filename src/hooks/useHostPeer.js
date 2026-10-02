import { useState, useEffect, useRef, useCallback } from 'react';
import Peer from 'peerjs';
import { MESSAGE_TYPES } from '@/constants/editor';
import { createShareId } from '@/utils/workspace';

/**
 * Custom hook to manage the Host WebRTC PeerJS lifecycle.
 * Acts as the centralized coordinator: broadcasts code changes to all connected peers
 * and relays changes from one peer to all others.
 *
 * @param {string} workspaceName
 * @returns {{
 *   peerId: string,
 *   shareId: string,
 *   connections: string[],
 *   code: string,
 *   handleCodeChange: (newCode: string) => void,
 *   isReady: boolean
 * }}
 */
export function useHostPeer(workspaceName) {
  const [peerId, setPeerId] = useState('');
  const [connections, setConnections] = useState([]);
  const [code, setCode] = useState('');
  const [isReady, setIsReady] = useState(false);

  const peerRef = useRef(null);
  const connectionsMapRef = useRef(new Map()); // peerId -> DataConnection
  const codeRef = useRef('');

  // Keep codeRef synchronized with latest code
  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  // Broadcast helper
  const broadcastCode = useCallback((codeContent, excludePeerId = null) => {
    const payload = {
      type: MESSAGE_TYPES.CODE,
      content: codeContent,
    };

    connectionsMapRef.current.forEach((conn, clientPeerId) => {
      if (clientPeerId !== excludePeerId && conn.open) {
        conn.send(payload);
      }
    });
  }, []);

  // Update code and broadcast to all peers
  const handleCodeChange = useCallback((newCode) => {
    const safeCode = newCode ?? '';
    setCode(safeCode);
    codeRef.current = safeCode;
    broadcastCode(safeCode);
  }, [broadcastCode]);

  useEffect(() => {
    let isMounted = true;
    const peer = new Peer();
    peerRef.current = peer;
    const connectionsMap = connectionsMapRef.current;

    peer.on('open', (id) => {
      if (!isMounted) return;
      setPeerId(id);
      setIsReady(true);
    });

    peer.on('connection', (conn) => {
      const clientPeerId = conn.peer;

      const registerConnection = () => {
        connectionsMap.set(clientPeerId, conn);
        setConnections(Array.from(connectionsMap.keys()));

        // Immediately sync the current code to the newly joined peer
        if (conn.open) {
          conn.send({
            type: MESSAGE_TYPES.CODE,
            content: codeRef.current,
          });
        }
      };

      if (conn.open) {
        registerConnection();
      } else {
        conn.on('open', registerConnection);
      }

      conn.on('data', (data) => {
        if (data?.type === MESSAGE_TYPES.CODE) {
          const incomingCode = data.content ?? '';
          setCode(incomingCode);
          codeRef.current = incomingCode;
          // Relay updates to all other connected peers
          broadcastCode(incomingCode, clientPeerId);
        }
      });

      const removeConnection = () => {
        connectionsMap.delete(clientPeerId);
        setConnections(Array.from(connectionsMap.keys()));
      };

      conn.on('close', removeConnection);
      conn.on('error', removeConnection);
    });

    peer.on('error', (err) => {
      console.error('Host PeerJS error:', err);
    });

    return () => {
      isMounted = false;
      connectionsMap.forEach((conn) => {
        try {
          conn.close();
        } catch {
          // ignore cleanup errors
        }
      });
      connectionsMap.clear();

      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
    };
  }, [broadcastCode]);

  const shareId = createShareId(peerId, workspaceName);

  return {
    peerId,
    shareId,
    connections,
    code,
    handleCodeChange,
    isReady,
  };
}
