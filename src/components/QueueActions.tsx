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
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

type QueueActionsProps = {
  // Allow user to be null if Telegram didn’t inject the data.
  user: {
    id: number;
    username?: string;
    first_name?: string;
  } | null;
};

export const QueueActions = ({ user }: QueueActionsProps) => {
  const { joinQueue, leaveQueue, isInQueue, userPosition } = useQueue();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fallbackName, setFallbackName] = useState("");

  // If Telegram injects a user, use its username (or fallback to id), otherwise use the fallbackName
  const userIdentifier =
    user && (user.username || user.id)
      ? user.username
        ? `@${user.username}`
        : `user-${user.id}`
      : fallbackName;

  // Fallback UI: If no Telegram user data and no manual entry yet, show a form to let user enter their name.
  if (!user && fallbackName.trim() === "") {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl">Join the Queue</CardTitle>
          <CardDescription>
            We couldn’t detect your Telegram username. Please enter your username manually.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="fallbackName">Your Username</Label>
          <Input
            id="fallbackName"
            placeholder="e.g. @myusername"
            value={fallbackName}
            onChange={(e) => setFallbackName(e.target.value)}
            required
          />
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => {
              if (fallbackName.trim() === "") return;
              setIsSubmitting(true);
              joinQueue(fallbackName.trim());
              setIsSubmitting(false);
            }}
            disabled={isSubmitting || fallbackName.trim() === ""}
          >
            {isSubmitting ? "Joining..." : "Join Queue"}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // If user data is available and the user is already in the queue, show the in-queue view.
  if (isInQueue(userIdentifier)) {
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
            You are joined as {userIdentifier}.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => {
              setIsSubmitting(true);
              leaveQueue(userIdentifier);
              setIsSubmitting(false);
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Leaving..." : "Leave Queue"}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Normal view when not in queue: Show the join button with the resolved userIdentifier.
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl">Join the Queue</CardTitle>
        <CardDescription>
          You will join as {userIdentifier || "guest"}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          No need to type anything if your Telegram username is available.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          className="w-full"
          onClick={() => {
            setIsSubmitting(true);
            joinQueue(userIdentifier);
            setIsSubmitting(false);
          }}
          disabled={isSubmitting || (!user && fallbackName.trim() === "")}
        >
          {isSubmitting ? "Joining..." : "Join Queue"}
        </Button>
      </CardFooter>
    </Card>
  );
};
