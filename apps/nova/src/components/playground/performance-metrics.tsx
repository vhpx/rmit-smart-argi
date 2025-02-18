import { Card, CardContent } from '@tutur3u/ui/card';

interface PerformanceMetricsProps {
  metrics: {
    tokenCount: number;
    responseTime: number;
  };
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Token Count
            </p>
            <p className="text-2xl font-bold">{metrics.tokenCount}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Response Time
            </p>
            <p className="text-2xl font-bold">{metrics.responseTime}ms</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
