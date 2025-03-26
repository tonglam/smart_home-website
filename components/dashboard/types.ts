/**
 * Available tab values for the dashboard navigation
 */
export type TabValue = "overview" | "monitoring" | "analytics";

/**
 * Props for tab content components
 */
export interface TabContentProps {
  /** Optional CSS class name for styling */
  className?: string;
}

/**
 * Props for the tab navigation component
 */
export interface TabNavigationProps {
  /** Optional CSS class name for styling */
  className?: string;
  /** Currently active tab */
  currentTab?: TabValue;
  /** Callback fired when a tab is selected */
  onTabChange?: (tab: TabValue) => void;
}

/**
 * Props for the main dashboard tabs component
 */
export interface DashboardTabsProps {
  /** Initial active tab (defaults to "overview") */
  defaultTab?: TabValue;
  /** Optional CSS class name for styling */
  className?: string;
  /** Callback fired when a tab is changed */
  onTabChange?: (tab: TabValue) => void;
  /** Whether to persist tab selection in localStorage (defaults to true) */
  persistTab?: boolean;
}

/**
 * Analytics event parameters for tab switching
 */
export interface TabSwitchEvent {
  tab_name: TabValue;
  switch_time: number;
}

/**
 * Google Analytics event interface
 */
export interface GtagEvent {
  command: "event";
  action: string;
  params: TabSwitchEvent;
}
