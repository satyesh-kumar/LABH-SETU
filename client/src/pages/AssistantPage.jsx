import React from 'react';
import { useTranslation } from 'react-i18next';
import AssistantChat from '../components/assistant/AssistantChat';

const AssistantPage = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('assistant.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {t('assistant.subtitle')}
        </p>
      </div>

      <AssistantChat />
    </div>
  );
};

export default AssistantPage;
