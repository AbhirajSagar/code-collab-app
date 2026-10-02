import { DEFAULT_WORKSPACE_NAME } from '@/constants/editor';

/**
 * Creates a composite share ID from a host's peer ID and the workspace name.
 * Format: "<peerId>@<encodedWorkspaceName>"
 *
 * @param {string} peerId
 * @param {string} workspaceName
 * @returns {string}
 */
export function createShareId(peerId, workspaceName) {
  if (!peerId) return '';
  const safeName = (workspaceName && workspaceName.trim()) || DEFAULT_WORKSPACE_NAME;
  return `${peerId}@${encodeURIComponent(safeName)}`;
}

/**
 * Parses a composite share ID into host peer ID and workspace name.
 *
 * @param {string} rawShareId
 * @returns {{ hostId: string, workspaceName: string }}
 */
export function parseShareId(rawShareId) {
  if (!rawShareId || typeof rawShareId !== 'string') {
    return { hostId: '', workspaceName: DEFAULT_WORKSPACE_NAME };
  }

  const decoded = decodeURIComponent(rawShareId.trim());
  const separatorIndex = decoded.indexOf('@');

  if (separatorIndex === -1) {
    return {
      hostId: decoded,
      workspaceName: DEFAULT_WORKSPACE_NAME,
    };
  }

  const hostId = decoded.slice(0, separatorIndex);
  const workspaceName = decoded.slice(separatorIndex + 1) || DEFAULT_WORKSPACE_NAME;

  return { hostId, workspaceName };
}
