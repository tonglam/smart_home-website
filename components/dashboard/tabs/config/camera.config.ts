export interface CameraConfig {
  id: string;
  name: string;
  imageUrl: string;
  emergencyContact?: string;
}

export const CAMERA_CONFIG: CameraConfig[] = [
  {
    id: "front-door-cam",
    name: "Front Door Camera",
    imageUrl: "/camera-feeds/front-door.jpg",
    emergencyContact: "911",
  },
  {
    id: "back-door-cam",
    name: "Back Door Camera",
    imageUrl: "/camera-feeds/back-door.jpg",
  },
  {
    id: "garage-cam",
    name: "Garage Camera",
    imageUrl: "/camera-feeds/garage.jpg",
  },
];
