import React, { useEffect, useState } from "react";
import { QueueProvider } from "../contexts/QueueContext";
import { QueueDisplay } from "../components/QueueDisplay";
import { QueueActions } from "../components/QueueActions";
import { QueueAdmin } from "../components/QueueAdmin";
import { Button } from "../components/ui/button";
import { Info } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../components/ui/dialog";

import { useInitData, useWebApp } from '@vkruglikov/react-telegram-web-app';

export const TelegramWebApp = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, initDataUnsafe] = useInitData();
  const webApp = useWebApp();

  useEffect(() => {
    console.group("Telegram WebApp Initialization Debug");
    console.log("Checking Telegram WebApp availability...");

    // check if running in Telegram context
    if (!window.Telegram?.WebApp) {
      console.error("Telegram WebApp SDK not detected - not running in Telegram client");
      setError("Please open this through the Telegram bot");
      setLoading(false);
      console.groupEnd();
      return;
    }

    console.log("Telegram WebApp SDK detected successfully");
    console.log("WebApp version:", window.Telegram.WebApp.version);
    console.log("Platform:", window.Telegram.WebApp.platform);

    // check initData availability
    console.log("Checking initData...");
    console.log("Raw initData:", window.Telegram.WebApp.initData);
    console.log("React hook initDataUnsafe:", initDataUnsafe);

    if (initDataUnsafe?.user) {
      console.log("User data found via React hook:", initDataUnsafe.user);
      setUser(initDataUnsafe.user);
      setLoading(false);
      window.Telegram.WebApp.expand(); // Ensure webapp is expanded
    } else {
      console.warn("No user data in initDataUnsafe - checking window.Telegram directly");

      // fallback to direct Telegram WebApp access
      if (window.Telegram.WebApp.initDataUnsafe?.user) {
        console.log("User data found via window.Telegram:", window.Telegram.WebApp.initDataUnsafe.user);
        setUser(window.Telegram.WebApp.initDataUnsafe.user);
        setLoading(false);
        window.Telegram.WebApp.expand();
      } else {
        console.error("No user data available in either source");
        setError("Failed to load Telegram user data");
      }
    }

    setLoading(false);
    console.groupEnd();
  }, [initDataUnsafe]);

  // Debug render states
  console.log("Current render state:", { loading, error, user });

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Loading Telegram user data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-medium text-red-800">Error</h2>
          <p className="text-red-700">{error}</p>
          <p className="mt-2 text-sm text-red-600">
            Please ensure you opened this through the Telegram bot interface.
          </p>

          {/* Debug information box */}
          <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
            <p className="font-medium">Debug information:</p>
            <pre className="overflow-x-auto mt-2">
              {JSON.stringify({
                inTelegram: !!window.Telegram?.WebApp,
                platform: window.Telegram?.WebApp?.platform,
                initDataPresent: !!window.Telegram?.WebApp?.initData,
                hasReactHookData: !!initDataUnsafe?.user,
                userAgent: navigator.userAgent
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <QueueProvider>
      <div className="max-w-md mx-auto p-4">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Hello, @{user?.username || user?.id || 'guest'}
            </h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info size={18} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>About TeleQueue</DialogTitle>
                <DialogDescription>
                  TeleQueue is a simple queue management system for Telegram.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <h4 className="font-medium">How to use:</h4>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Join the queue!</li>
                  <li>Set when you want to be notified</li>
                  <li>Wait for your turn</li>
                  <li>You'll be notified when your turn is approaching</li>
                </ol>
                <p className="mt-4 text-muted-foreground">
                  Administrators can toggle admin mode to manage the queue.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <div className="space-y-6">
          <QueueDisplay />
          <QueueActions user={user} />
          <QueueAdmin />
        </div>
      </div>
    </QueueProvider>
  );
};