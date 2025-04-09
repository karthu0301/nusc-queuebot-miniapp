
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
import { Loader2, LogIn, LogOut, Bell } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export const QueueActions: React.FC = () => {
  const { joinQueue, leaveQueue, isInQueue, userPosition, notifyAt, setNotificationThreshold } = useQueue();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleJoinQueue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    joinQueue(name.trim());
    setIsSubmitting(false);
  };

  const handleLeaveQueue = () => {
    setIsSubmitting(true);
    leaveQueue();
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
          <div className="space-y-2">
            <Label htmlFor="notify">Notify me when my position is:</Label>
            <Select
              defaultValue={notifyAt.toString()}
              onValueChange={(value) => setNotificationThreshold(parseInt(value))}
            >
              <SelectTrigger id="notify" className="w-full">
                <SelectValue placeholder="Select when to notify" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">When it's my turn</SelectItem>
                <SelectItem value="2">1 person before me</SelectItem>
                <SelectItem value="3">2 people before me</SelectItem>
                <SelectItem value="5">4 people before me</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative pt-3">
            <div className="absolute inset-0 flex items-center px-1">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-xs text-muted-foreground">
                OR
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLeaveQueue}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4 mr-2" />
            )}
            Leave Queue
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
          Enter your name to reserve your spot
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleJoinQueue}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notify">Notify me when my position is:</Label>
            <Select
              defaultValue={notifyAt.toString()}
              onValueChange={(value) => setNotificationThreshold(parseInt(value))}
            >
              <SelectTrigger id="notify" className="w-full">
                <SelectValue placeholder="Select when to notify" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">When it's my turn</SelectItem>
                <SelectItem value="2">1 person before me</SelectItem>
                <SelectItem value="3">2 people before me</SelectItem>
                <SelectItem value="5">4 people before me</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !name.trim()}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <LogIn className="h-4 w-4 mr-2" />
            )}
            Join Queue
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
