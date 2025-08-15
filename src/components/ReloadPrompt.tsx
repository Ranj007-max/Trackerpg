import { useRegisterSW } from 'virtual:pwa-register/react';

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error: ', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (offlineReady || needRefresh) {
    return (
      <div className="fixed right-0 bottom-0 m-4 p-4 rounded-lg shadow-lg bg-slate-800 border border-slate-700 text-left z-50 animate-slide-in">
        <div className="mb-2">
          {offlineReady ? (
            <span className="text-slate-200">App ready to work offline.</span>
          ) : (
            <span className="text-slate-200">New content available, click the reload button to update.</span>
          )}
        </div>
        {needRefresh && (
          <button
            className="px-4 py-2 rounded-md bg-cyan-500 hover:bg-cyan-600 transition-colors font-semibold text-white mr-2"
            onClick={() => updateServiceWorker(true)}
          >
            Reload
          </button>
        )}
        <button
          className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-500 transition-colors"
          onClick={() => close()}
        >
          Close
        </button>
         <style>{`
          @keyframes slide-in {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-slide-in {
            animation: slide-in 0.3s ease-out forwards;
          }
        `}</style>
      </div>
    );
  }

  return null;
}

export default ReloadPrompt;
