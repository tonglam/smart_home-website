export interface CarouselContextProps {
  api: any; // TODO: Replace with proper Embla Carousel API type
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

export interface ChartContextProps {
  data: any[]; // TODO: Replace with proper chart data type
  options?: Record<string, unknown>;
}

export interface FormFieldContextValue<
  TFieldValues extends Record<string, any> = Record<string, any>
> {
  name: string;
}
