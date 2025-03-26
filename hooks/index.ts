/**
 * Smart Home Hooks Index
 * Centralized exports for all custom hooks
 */

// UI Hooks - User interface related hooks
export { useToast } from "./ui/use-toast";
export { useCarousel } from "./ui/useCarousel";
export { useChart } from "./ui/useChart";
export { useFormField } from "./ui/useForm";

// Analytics Hooks - Data analysis and reporting
export { useDeviceAnalytics } from "./analytics/useDeviceAnalytics";
export { useSecurityAnalytics } from "./analytics/useSecurityAnalytics";

// Auth Hooks - Authentication and navigation
export { useNavigation } from "./auth/useNavigation";

// Automation Hooks - Smart home automation logic
export { useAutomation } from "./automation/useAutomation";
export { useDashboardTabs } from "./automation/useDashboardTabs";

// Device Hooks - Device communication and management
export { useMqtt } from "./device/useMqtt";
export { useMqttDevice } from "./device/useMqttDevice";

// Home Management Hooks - Home connection and management
export { useHomeConnection } from "./home/useHomeConnection";

// Dashboard Feature Hooks - Dashboard-specific functionality
export { useAlerts } from "./dashboard/useAlerts";
export { useLighting } from "./dashboard/useLighting";
