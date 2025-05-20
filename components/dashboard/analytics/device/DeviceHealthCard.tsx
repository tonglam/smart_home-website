import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DeviceData {
  name: string;
  status: string;
  battery: string;
}

const DeviceStatusItem = ({ device }: { device: DeviceData }) => (
  <div className="flex items-center gap-4 p-3 border rounded-lg">
    <div
      className={`h-3 w-3 rounded-full ${
        device.status === "Good" ? "bg-green-500" : "bg-yellow-500"
      }`}
    />
    <div>
      <p className="font-medium text-sm">{device.name}</p>
      <div className="flex gap-2 text-xs text-muted-foreground">
        <span>Battery: {device.battery}</span>{" "}
      </div>
    </div>
  </div>
);

const DeviceList = ({ devices }: { devices: DeviceData[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {devices.map((device) => (
      <DeviceStatusItem key={device.name} device={device} />
    ))}
  </div>
);

interface DeviceHealthCardProps {
  className?: string;
}

export function DeviceHealthCard({ className }: DeviceHealthCardProps) {
  const devices: DeviceData[] = [
    {
      name: "Living Room Light",
      status: "Good",
      battery: "100%",
    },
    {
      name: "Living Room Ambient Light",
      status: "Warning",
      battery: "15%",
    },
    {
      name: "Main Door Lock",
      status: "Good",
      battery: "85%",
    },
    {
      name: "Security Camera",
      status: "Good",
      battery: "N/A",
    },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Device Health Status
        </CardTitle>
        <CardDescription>
          Monitoring the health of your connected devices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <DeviceList devices={devices} />
      </CardContent>
    </Card>
  );
}
