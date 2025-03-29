import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaCalculator } from "react-icons/fa";

interface RecommendationItem {
  title: string;
  description: string;
}

const RecommendationItem = ({ item }: { item: RecommendationItem }) => (
  <div className="border rounded-lg p-4">
    <div className="flex items-start gap-4">
      <div className="p-2 bg-primary/10 rounded-full">
        <FaCalculator className="h-5 w-5 text-primary" />
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-sm">{item.title}</h3>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </div>
    </div>
  </div>
);

const RecommendationsList = ({
  recommendations,
}: {
  recommendations: RecommendationItem[];
}) => (
  <div className="space-y-4">
    {recommendations.map((item, index) => (
      <RecommendationItem key={index} item={item} />
    ))}
  </div>
);

interface SecurityRecommendationsCardProps {
  className?: string;
}

export function SecurityRecommendationsCard({
  className,
}: SecurityRecommendationsCardProps) {
  // Sample recommendations data - in a real app, this would come from props or API
  const recommendations: RecommendationItem[] = [
    {
      title: "Update Window Sensors",
      description:
        "Your living room window sensor reports frequent status changes. Consider checking the battery or replacing it for more reliable monitoring.",
    },
    {
      title: "Activate Away Mode More Often",
      description:
        'Based on your usage patterns, you could benefit from using the "Away Mode" automation more frequently when you\'re not at home.',
    },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Security Recommendations
        </CardTitle>
        <CardDescription>
          Personalized suggestions to improve your home security
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RecommendationsList recommendations={recommendations} />
      </CardContent>
    </Card>
  );
}
