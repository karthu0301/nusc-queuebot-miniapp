import React, { useState } from "react";
import { useQueue } from "../contexts/QueueContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";

type QueueActionsProps = {
  user: any;
};

export const QueueActions = ({ user }: QueueActionsProps) => {
  const { joinQueue, leaveQueue, isInQueue, userPosition, notifyAt, setNotificationThreshold } = useQueue();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const username = user?.username || user?.id;

  const handleJoinQueue = () => {
    if (!username) return;
    setIsSubmitting(true);
    joinQueue(username);
    setIsSubmitting(false);
  };

  const handleLeaveQueue = () => {
    if (!username) return;
    setIsSubmitting(true);
    leaveQueue(username);
    setIsSubmitting(false);
  };

  if (isInQueue) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl">You're in the Queue</CardTitle>
          <CardDescription>
            {userPosition === 1
              ? "It's your turn now!"
              : `Your position: #${userPosition}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You are joined as @{username}.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLeaveQueue}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Leaving..." : "Leave Queue"}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl">Join the Queue</CardTitle>
        <CardDescription>
          You will join as @{username}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          No need to type anything — just click the button below!
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          className="w-full"
          onClick={handleJoinQueue}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Joining..." : "Join Queue"}
        </Button>
      </CardFooter>
    </Card>
  );
};
