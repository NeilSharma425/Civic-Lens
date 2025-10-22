import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FeedbackSubmission } from "@/types/feedback";
import { FileText, Languages, Edit } from "lucide-react";

export default function ProcessingResults() {
  const { data: submissions, isLoading } = useQuery<FeedbackSubmission[]>({
    queryKey: ['/api/feedback'],
    refetchInterval: 5000, // Refresh every 5 seconds to show updates
  });

  const completedSubmissions = submissions?.filter(s => s.processingStatus === 'completed') || [];
  const displaySubmissions = completedSubmissions.slice(0, 3); // Show only first 3 for demo

  if (isLoading || displaySubmissions.length === 0) {
    return (
      <section id="processing-results" className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-4" data-testid="processing-results-title">
                AI Processing Results
              </h3>
              <p className="text-muted-foreground">See how AI transforms raw feedback into actionable insights</p>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading processing results...</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h4 className="text-lg font-semibold text-foreground mb-2" data-testid="no-results-title">
                  No Processing Results Yet
                </h4>
                <p className="text-muted-foreground">
                  Submit feedback to see AI processing results here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'text-chart-1';
      case 'negative': return 'text-chart-3';
      default: return 'text-chart-2';
    }
  };

  const getSentimentBadgeColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-chart-1/10 text-chart-1 border-chart-1/20';
      case 'negative': return 'bg-chart-3/10 text-chart-3 border-chart-3/20';
      default: return 'bg-chart-2/10 text-chart-2 border-chart-2/20';
    }
  };

  return (
    <section id="processing-results" className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4" data-testid="processing-results-title">
              AI Processing Results
            </h3>
            <p className="text-muted-foreground">See how AI transforms raw feedback into actionable insights</p>
          </div>

          <div className="space-y-8">
            {displaySubmissions.map((submission, index) => (
              <Card key={submission.id} className="shadow-sm">
                <CardContent className="p-6">
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Original */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center">
                        <FileText className="text-muted-foreground mr-2" />
                        Original Feedback
                      </h4>
                      <div className="bg-muted rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {submission.originalLanguage || 'Unknown'}
                          </Badge>
                          {submission.demographicTags && submission.demographicTags.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {submission.demographicTags[0]}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-foreground" data-testid={`original-text-${index}`}>
                          {submission.originalText}
                        </p>
                      </div>
                    </div>

                    {/* Translated/Analyzed */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center">
                        <Languages className="text-primary mr-2" />
                        AI Translation & Analysis
                      </h4>
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            {submission.translatedText !== submission.originalText ? 'Translated' : 'Analyzed'}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getSentimentBadgeColor(submission.sentimentLabel)}`}
                          >
                            Sentiment: {submission.sentimentLabel ? 
                              submission.sentimentLabel.charAt(0).toUpperCase() + submission.sentimentLabel.slice(1) : 
                              'Unknown'
                            }
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground" data-testid={`translated-text-${index}`}>
                          {submission.translatedText || submission.originalText}
                        </p>
                      </div>
                    </div>

                    {/* Inclusive Rewrite */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center">
                        <Edit className="text-accent mr-2" />
                        Inclusive Rewrite
                      </h4>
                      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className="bg-accent text-accent-foreground text-xs">
                            Inclusive
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Policy-Ready
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground" data-testid={`inclusive-text-${index}`}>
                          {submission.inclusiveRewrite || "Processing..."}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {completedSubmissions.length > 3 && (
            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground" data-testid="more-results-indicator">
                Showing 3 of {completedSubmissions.length} processed feedback items
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
