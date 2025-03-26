import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface CameraFeedProps {
  isLoading: boolean;
  getStatus: () => { isOnline: boolean };
}

export function CameraFeed({ isLoading, getStatus }: CameraFeedProps) {
  const { isOnline } = getStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Camera Feed</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="w-full aspect-video rounded-lg" />
        ) : !isOnline ? (
          <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Camera Offline</p>
          </div>
        ) : (
          <Image
            src="/api/camera/stream"
            alt="Live camera feed"
            className="w-full aspect-video object-cover rounded-lg"
            width={1280}
            height={720}
            priority
          />
        )}
      </CardContent>
    </Card>
  );
}
