import { useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Button } from "./ui/button";
import { RefreshCw, X } from "lucide-react";

export function UpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("SW Registered:", r);
      // Check for updates every hour
      if (r) {
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  // Show prompt when there's an update or offline ready
  const shouldShowPrompt = offlineReady || needRefresh;

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
    setShowPrompt(false);
  };

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  if (!shouldShowPrompt || showPrompt === false) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            <div className="bg-blue-100 p-2 rounded-md">
              <RefreshCw className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {needRefresh ? "Update Available" : "App Ready to Work Offline"}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {needRefresh
                ? "A new version is available. Click reload to update."
                : "The app is ready to work offline."}
            </p>
            <div className="flex gap-2">
              {needRefresh && (
                <Button size="sm" onClick={handleUpdate}>
                  Reload
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={close}>
                {needRefresh ? "Later" : "Close"}
              </Button>
            </div>
          </div>
          <button
            onClick={close}
            className="shrink-0 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
