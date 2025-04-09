
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

import { useInitData } from '@vkruglikov/react-telegram-web-app';

export const TelegramWebApp = () => {
  const [user, setUser] = useState(null);
  const [initData, initDataUnsafe] = useInitData();

  useEffect(() => {
    if (initData?.user) {
      setUser(initData.user);
    }
  }, [initDataUnsafe]);

  return (
    <QueueProvider>
      <div className={`max-w-md mx-auto p-4`}>
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Hello, @{user?.id ?? 'loading...'}
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
                  TeleQueue is a simple queue management system for Telegram. It helps you manage queues and get notified when your turn is approaching.
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
      </div>
    </QueueProvider>
  );
};
