'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faRightToBracket } from '@fortawesome/free-solid-svg-icons';

const TAB_TYPES = {
  CREATE: 'create',
  JOIN: 'join',
};

const TABS = [
  {
    id: TAB_TYPES.CREATE,
    label: 'Create Workspace',
    icon: faPlus,
    heading: 'Create a New Workspace',
    inputLabel: 'Workspace Name',
    placeholder: 'e.g. algorithmic-trading-bot',
    submitText: 'Create Workspace',
  },
  {
    id: TAB_TYPES.JOIN,
    label: 'Join Workspace',
    icon: faRightToBracket,
    heading: 'Join an Existing Workspace',
    inputLabel: 'Workspace ID',
    placeholder: 'e.g. peer-id@workspace-name',
    submitText: 'Join Workspace',
  },
];

export default function WorkspaceTabs() {
  const [activeTab, setActiveTab] = useState(TAB_TYPES.CREATE);
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();

  const currentTabConfig = TABS.find((t) => t.id === activeTab) || TABS[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (activeTab === TAB_TYPES.CREATE) {
      router.push(`/editor/host?name=${encodeURIComponent(trimmed)}`);
    } else {
      router.push(`/editor/client?id=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setInputValue('');
  };

  return (
    <div className="w-full max-w-lg mt-8 flex flex-col items-center">
      {/* Tab Navigation */}
      <div
        role="tablist"
        className="w-full flex border-b border-white/10 gap-2 mb-6"
      >
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 pb-2.5 px-3 text-sm sm:text-base font-semibold transition-all border-b-2 cursor-pointer ${
                isActive
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-muted hover:text-white/80'
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="text-xs" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Action Card */}
      <div className="w-full rounded-xl bg-background-muted-dark border border-white/10 p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-2">
          {currentTabConfig.heading}
        </h3>
        <p className="text-xs text-muted mb-4">
          {activeTab === TAB_TYPES.CREATE
            ? 'Host a new live coding session and invite collaborators to code in real-time.'
            : 'Enter the workspace ID or invite code shared by the host to connect.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted mb-1.5">
              {currentTabConfig.inputLabel}
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={currentTabConfig.placeholder}
              required
              className="w-full rounded-lg border border-white/10 bg-background-dark px-3.5 py-2.5 text-sm text-white placeholder-muted/50 focus:border-amber-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-amber-600 hover:bg-orange-600 text-white transition-colors cursor-pointer shadow-md hover:shadow-amber-600/20"
            >
              {currentTabConfig.submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
