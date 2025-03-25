'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Clock, LogIn } from 'lucide-react';
import { recentActivities } from '@/lib/data';

interface ActivitiesFeedProps {
  isHomeConnected: boolean;
  isSignedIn: boolean;
  onOpenConnectHome: () => void;
  onSignIn: () => void;
}

export function ActivitiesFeed({ 
  isHomeConnected, 
  isSignedIn, 
  onOpenConnectHome, 
  onSignIn 
}: ActivitiesFeedProps) {
  const [isActivitiesOpen, setActivitiesOpen] = useState(true);

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <h3 className="font-semibold">Recent Activities</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => setActivitiesOpen(!isActivitiesOpen)}
        >
          {isActivitiesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      <div className={`transition-all duration-300 ${isActivitiesOpen ? 'max-h-[500px]' : 'max-h-0'} overflow-hidden`}>
        {isHomeConnected ? (
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground whitespace-nowrap">{activity.time}</span>
                <span>{activity.activity}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-4">
              {isSignedIn 
                ? "Connect your home to view activity history"
                : "Sign in and connect your home to view activity history"}
            </p>
            {isSignedIn ? (
              <Button variant="outline" onClick={onOpenConnectHome}>
                Connect Home
              </Button>
            ) : (
              <Button variant="outline" onClick={onSignIn}>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}