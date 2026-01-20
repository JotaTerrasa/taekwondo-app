import { useEffect, useState } from 'react';

import { useInstallPrerequisites } from '../hooks/useInstallPrerequisites';
import { useDeferredInstallPrompt } from '../hooks/useDeferredInstallPrompt';

const SHOW_DELAY_MS = 1500;

export const InstallPWA = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const installCriteria = useInstallPrerequisites(SHOW_DELAY_MS);
  const { promptEvent, resetPrompt } = useDeferredInstallPrompt();

  useEffect(() => {
    if (installCriteria && promptEvent) {
      setIsModalOpen(true);
    }
  }, [installCriteria, promptEvent]);

  const handleInstall = async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    await promptEvent.userChoice;
    resetPrompt();
    setIsModalOpen(false);
  };

  const handleClose = () => {
    resetPrompt();
    setIsModalOpen(false);
  };

  if (!isModalOpen) return null;

  return (
    <div className="w-full max-w-sm fixed bottom-6 max-md:left-1/2 max-md:-translate-x-1/2 md:right-6 z-50 px-4">
      <section className="rounded-lg theme-bg-card p-6 shadow-xl">
        <h2 className="text-lg font-semibold theme-text-primary">Instala la app</h2>
        <p className="mt-2 text-sm theme-text-secondary">
          Añade Taekwondo App a tu dispositivo para un acceso más rápido.
        </p>
        <div className="mt-4 flex gap-3 flex-wrap">
          <button
            type="button"
            className="flex-1 rounded-md px-3 py-2 text-sm font-medium text-white theme-btn transition-colors whitespace-nowrap cursor-pointer"
            onClick={handleInstall}
          >
            Instalar
          </button>
          <button
            type="button"
            className="flex-1 rounded-md theme-border border px-3 py-2 text-sm font-medium theme-text-primary theme-hover transition-colors whitespace-nowrap cursor-pointer"
            onClick={handleClose}
          >
            Más tarde
          </button>
        </div>
      </section>
    </div>
  );
};
