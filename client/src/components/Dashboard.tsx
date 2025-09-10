import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import SentimentChart from "@/components/charts/SentimentChart";
import DemographicChart from "@/components/charts/DemographicChart";
import { Analytics } from "@/types/feedback";
import { MessageSquare, Languages, Users, AlertTriangle, RotateCcw } from "lucide-react";

export default function Dashboard() {
  const { data: analytics, isLoading, error, refetch } = useQuery<Analytics>({
    queryKey: ['/api/analytics'],
    refetchInterval: 5000, // Refresh every 5 seconds to show updates
  });

  if (error) {
    return (
      <section id="dashboard" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Alert variant="destructive" className="max-w-md mx-auto">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Failed to load analytics data. Please try again.
              </AlertDescription>
            </Alert>
            <Button onClick={() => refetch()} className="mt-4" data-testid="button-retry-analytics">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const defaultAnalytics: Analytics = {
    totalFeedback: 0,
    translatedCount: 0,
    demographicGroups: 0,
    representationGaps: 0,
    sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
    demographicSentiment: {},
    insights: [],
    recommendations: [],
  };

  const displayAnalytics = analytics || defaultAnalytics;

  return (
    <section id="dashboard" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4" data-testid="dashboard-title">
            Analysis Dashboard
          </h3>
          <p className="text-muted-foreground">Real-time insights into community sentiment and representation</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-chart-1/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="text-chart-1 text-xl" />
              </div>
              <p className="text-2xl font-bold text-foreground" data-testid="metric-total-feedback">
                {isLoading ? "..." : displayAnalytics.totalFeedback.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Feedback</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Languages className="text-chart-4 text-xl" />
              </div>
              <p className="text-2xl font-bold text-foreground" data-testid="metric-translated">
                {isLoading ? "..." : displayAnalytics.translatedCount.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Translated</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="text-chart-2 text-xl" />
              </div>
              <p className="text-2xl font-bold text-foreground" data-testid="metric-demographic-groups">
                {isLoading ? "..." : displayAnalytics.demographicGroups}
              </p>
              <p className="text-sm text-muted-foreground">Demographic Groups</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="text-chart-3 text-xl" />
              </div>
              <p className="text-2xl font-bold text-foreground" data-testid="metric-representation-gaps">
                {isLoading ? "..." : displayAnalytics.representationGaps}
              </p>
              <p className="text-sm text-muted-foreground">Representation Gaps</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Sentiment Distribution */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-foreground mb-4">Sentiment Distribution</h4>
              <div className="relative h-64">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <SentimentChart data={displayAnalytics.sentimentDistribution} />
                )}
              </div>
              <div className="mt-4 flex justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-chart-1 rounded-full"></div>
                  <span className="text-muted-foreground" data-testid="sentiment-positive-label">
                    Positive ({displayAnalytics.sentimentDistribution.positive}%)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
                  <span className="text-muted-foreground" data-testid="sentiment-neutral-label">
                    Neutral ({displayAnalytics.sentimentDistribution.neutral}%)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-chart-3 rounded-full"></div>
                  <span className="text-muted-foreground" data-testid="sentiment-negative-label">
                    Negative ({displayAnalytics.sentimentDistribution.negative}%)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sentiment by Demographics */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-foreground mb-4">Sentiment by Demographics</h4>
              <div className="relative h-64">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : Object.keys(displayAnalytics.demographicSentiment).length > 0 ? (
                  <DemographicChart data={displayAnalytics.demographicSentiment} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No demographic data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Representation Gaps Alert */}
        {displayAnalytics.representationGaps > 0 && displayAnalytics.insights.length > 0 && (
          <Alert className="border-destructive/20 bg-destructive/10 mb-8">
            <AlertTriangle className="text-destructive" />
            <AlertDescription>
              <h4 className="font-semibold text-destructive mb-2" data-testid="representation-gaps-title">
                Representation Gaps Detected
              </h4>
              <div className="text-destructive/80 mb-3">
                {displayAnalytics.insights.slice(0, 2).map((insight, index) => (
                  <p key={index} className="mb-1" data-testid={`insight-${index}`}>
                    {insight}
                  </p>
                ))}
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => {
                  const element = document.getElementById('insights');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                data-testid="button-view-detailed-analysis"
              >
                View Detailed Analysis
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {displayAnalytics.totalFeedback === 0 && !isLoading && (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h4 className="text-lg font-semibold text-foreground mb-2" data-testid="empty-state-title">
              No Feedback Data Yet
            </h4>
            <p className="text-muted-foreground mb-4">
              Upload civic feedback to see analysis and insights here.
            </p>
            <Button 
              onClick={() => {
                const element = document.getElementById('upload');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              data-testid="button-upload-feedback"
            >
              Upload Feedback
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
