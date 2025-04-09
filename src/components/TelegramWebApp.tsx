
import React, { useEffect, useState } from "react";
import { QueueProvider } from "@/contexts/QueueContext";
import { QueueDisplay } from "@/components/QueueDisplay";
import { QueueActions } from "@/components/QueueActions";
import { QueueAdmin } from "@/components/QueueAdmin";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

interface TelegramWebAppProps {
  className?: string;
}

// Check if running inside Telegram WebApp
const isTelegramWebApp = () => {
  return window.Telegram && window.Telegram.WebApp;
};

export const TelegramWebApp: React.FC<TelegramWebAppProps> = ({ className }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    // Initialize Telegram WebApp
    if (isTelegramWebApp()) {
      const webApp = window.Telegram.WebApp;
      
      // Set background color
      webApp.expand();
      webApp.ready();

      // Get user data if available
      if (webApp.initDataUnsafe && webApp.initDataUnsafe.user) {
        const user = webApp.initDataUnsafe.user;
        const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
        setUserName(fullName || user.username || "");
      }

      setIsInitialized(true);
      
      // Request notification permission
      if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            toast.success("Notifications enabled!");
          }
        });
      }
    } else {
      console.log("Not running in Telegram WebApp");
      setIsInitialized(true);
      
      // For testing outside of Telegram
      setTimeout(() => {
        toast.info("Running outside Telegram WebApp", {
          description: "Some features might be limited",
          duration: 3000,
        });
      }, 1000);
    }
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <h2 className="text-xl font-medium mb-2">Initializing...</h2>
          <p className="text-muted-foreground">Setting up TeleQueue</p>
        </div>
      </div>
    );
  }

  return (
    <QueueProvider>
      <div className={`max-w-md mx-auto p-4 ${className || ""}`}>
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              TeleQueue
            </h1>
            <p className="text-sm text-muted-foreground">
              Smart queue management
            </p>
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
                  TeleQueue is a simple queue management system for Telegram. It helps you manage queues and get notified when your turn is approaching.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <h4 className="font-medium">How to use:</h4>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Enter your name and join the queue</li>
                  <li>Set when you want to be notified</li>
                  <li>Wait for your turn</li>
                  <li>You'll be notified when your turn is approaching</li>
                </ol>
                <p className="mt-4 text-muted-foreground">
                  Administrators can toggle admin mode to manage the queue and call the next person.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <div className="space-y-6">
          <QueueDisplay />
          <QueueActions />
          <QueueAdmin />
        </div>

        <footer className="mt-8 text-center text-xs text-muted-foreground">
          <p>© 2025 TeleQueue - Beautiful queue management for Telegram</p>
        </footer>
      </div>
    </QueueProvider>
  );
};
