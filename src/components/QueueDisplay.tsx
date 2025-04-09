
import React from "react";
import { useQueue } from "@/contexts/QueueContext";
import { Motion } from "@/components/ui/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

export const QueueDisplay: React.FC = () => {
  const { queue, currentPosition, userPosition } = useQueue();
  
  const activeUsers = queue.filter(user => user.isActive && user.position >= currentPosition);
  const sortedUsers = [...activeUsers].sort((a, b) => a.position - b.position);

  return (
    <Card className="glass-card w-full">
      <CardHeader className="space-y-1 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-primary">
            Current Queue
          </CardTitle>
          <Badge variant="outline" className="flex gap-1 items-center">
            <Users size={14} />
            <span>{activeUsers.length} waiting</span>
          </Badge>
        </div>
        <div className="text-md text-muted-foreground flex items-center gap-2">
          <Clock size={16} className="text-primary" />
          <span>Now serving: <span className="font-medium text-primary">#{currentPosition}</span></span>
        </div>
      </CardHeader>
      <CardContent>
        {sortedUsers.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground animate-pulse-soft">
            <p>No one is currently in the queue</p>
            <p className="text-sm mt-1">Be the first to join!</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {sortedUsers.map((user, index) => (
              <Motion
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div 
                  className={`
                    p-3 rounded-lg flex justify-between items-center
                    ${user.id === localStorage.getItem("queueUserId") 
                      ? "bg-primary/10 border border-primary/30" 
                      : "bg-secondary border border-border"}
                    ${user.position === currentPosition ? "animate-pulse-soft" : ""}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      h-7 w-7 rounded-full flex items-center justify-center text-sm
                      ${user.position === currentPosition 
                        ? "bg-primary text-white" 
                        : user.id === localStorage.getItem("queueUserId")
                          ? "bg-primary/20 text-primary" 
                          : "bg-muted text-muted-foreground"}
                    `}>
                      {user.position - currentPosition + 1}
                    </div>
                    <span className="font-medium">
                      {user.name}
                      {user.id === localStorage.getItem("queueUserId") && " (You)"}
                    </span>
                  </div>
                  <Badge variant={
                    user.position === currentPosition 
                      ? "default" 
                      : user.position <= currentPosition + 2 
                        ? "secondary" 
                        : "outline"
                  }>
                    #{user.position}
                  </Badge>
                </div>
              </Motion>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
