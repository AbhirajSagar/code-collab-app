'use client';

import { Editor } from '@monaco-editor/react';
import { DEFAULT_LANGUAGE, DEFAULT_THEME } from '@/constants/editor';
import Loading from '@/components/common/Loading';

/**
 * Reusable Monaco Editor component with standard styling and dark theme.
 *
 * @param {{
 *   code: string,
 *   onChange: (value: string | undefined) => void,
 *   language?: string,
 *   theme?: string,
 *   readOnly?: boolean
 * }} props
 */
export default function CodeEditor({
  code = '',
  onChange,
  language = DEFAULT_LANGUAGE,
  theme = DEFAULT_THEME,
  readOnly = false,
}) {
  return (
    <div className="w-full h-full flex-1 overflow-hidden bg-background-dark">
      <Editor
        height="100%"
        width="100%"
        language={language}
        value={code}
        onChange={(val) => onChange?.(val ?? '')}
        theme={theme}
        loading={<Loading />}
        options={{
          automaticLayout: true,
          fontSize: 14,
          fontFamily: 'var(--font-outfit), monospace',
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          tabSize: 2,
          readOnly,
          wordWrap: 'on',
        }}
      />
    </div>
  );
}
