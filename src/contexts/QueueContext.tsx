
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export interface QueueUser {
  id: string;
  name: string;
  position: number;
  joinedAt: Date;
  isActive: boolean;
}

interface QueueContextType {
  queue: QueueUser[];
  currentPosition: number;
  userPosition: number | null;
  isInQueue: boolean;
  notifyAt: number;
  joinQueue: (name: string) => void;
  leaveQueue: () => void;
  nextInQueue: () => void;
  setNotificationThreshold: (position: number) => void;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error("useQueue must be used within a QueueProvider");
  }
  return context;
};

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queue, setQueue] = useState<QueueUser[]>([]);
  const [currentPosition, setCurrentPosition] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [notifyAt, setNotifyAt] = useState(3);
  const [isAdmin, setIsAdmin] = useState(false);

  // Initialize user ID on mount
  useEffect(() => {
    const storedId = localStorage.getItem("queueUserId");
    if (storedId) {
      setUserId(storedId);
    } else {
      const newId = `user_${Date.now()}`;
      localStorage.setItem("queueUserId", newId);
      setUserId(newId);
    }

    // Check if admin
    const isAdminStored = localStorage.getItem("queueIsAdmin") === "true";
    setIsAdmin(isAdminStored);
  }, []);

  // Calculate if user is in queue and their position
  const userPosition = userId ? queue.find(user => user.id === userId)?.position ?? null : null;
  const isInQueue = userPosition !== null;

  // Notification check
  useEffect(() => {
    if (isInQueue && userPosition !== null && userPosition <= notifyAt && userPosition > 0) {
      toast.success(`Your turn is approaching! You are position #${userPosition} in the queue.`, {
        duration: 5000,
      });
      
      // Try to use notification API if available
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Your Turn Is Coming Up!", {
          body: `You are position #${userPosition} in the queue.`,
          icon: "/favicon.ico"
        });
      }
    }
  }, [userPosition, notifyAt, isInQueue]);

  const joinQueue = (name: string) => {
    if (!userId) return;
    
    if (isInQueue) {
      toast.error("You are already in the queue!");
      return;
    }

    const newPosition = queue.length > 0 
      ? Math.max(...queue.map(user => user.position)) + 1 
      : currentPosition;
    
    const newUser: QueueUser = {
      id: userId,
      name,
      position: newPosition,
      joinedAt: new Date(),
      isActive: true
    };

    setQueue([...queue, newUser]);
    toast.success(`You joined the queue at position #${newPosition}!`);
  };

  const leaveQueue = () => {
    if (!userId || !isInQueue) return;
    
    setQueue(queue.filter(user => user.id !== userId));
    toast.info("You've left the queue");
  };

  const nextInQueue = () => {
    if (!isAdmin) return;
    
    setCurrentPosition(prev => prev + 1);
    
    // Mark users with positions less than the new current position as inactive
    setQueue(prevQueue => 
      prevQueue.map(user => 
        user.position < currentPosition + 1 
          ? { ...user, isActive: false } 
          : user
      )
    );

    toast.success(`Now serving #${currentPosition + 1}`);
  };

  const setNotificationThreshold = (position: number) => {
    setNotifyAt(position);
    toast.info(`You'll be notified when your position is ${position} or less`);
  };

  const value = {
    queue,
    currentPosition,
    userPosition,
    isInQueue,
    notifyAt,
    joinQueue,
    leaveQueue,
    nextInQueue,
    setNotificationThreshold,
    isAdmin,
    setIsAdmin: (value: boolean) => {
      setIsAdmin(value);
      localStorage.setItem("queueIsAdmin", value.toString());
    }
  };

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
};
