import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Analytics } from "@/types/feedback";
import { Lightbulb, ClipboardList, Download, FileText, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function InsightsExport() {
  const { data: analytics } = useQuery<Analytics>({
    queryKey: ['/api/analytics'],
  });
  
  const { toast } = useToast();

  const handleExportPDF = async () => {
    try {
      toast({
        title: "PDF Export",
        description: "PDF report generation would be implemented here with detailed analytics and recommendations.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF report",
        variant: "destructive",
      });
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch('/api/export/csv', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'civic-feedback-analysis.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "CSV data exported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export CSV data",
        variant: "destructive",
      });
    }
  };

  const handleShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link Copied",
        description: "Dashboard link copied to clipboard",
      });
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    });
  };

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
    <section id="insights" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4" data-testid="insights-title">
              Policy Insights
            </h3>
            <p className="text-muted-foreground">Actionable recommendations for equitable policymaking</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Key Insights */}
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Lightbulb className="text-chart-2 mr-2" />
                  Key Insights
                </h4>
                <div className="space-y-4">
                  {displayAnalytics.insights.length > 0 ? (
                    displayAnalytics.insights.map((insight, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-chart-3 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-foreground" data-testid={`insight-item-${index}`}>
                          {insight}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Lightbulb className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground" data-testid="no-insights">
                        No insights available yet. Submit feedback to generate insights.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <ClipboardList className="text-accent mr-2" />
                  Recommendations
                </h4>
                <div className="space-y-4">
                  {displayAnalytics.recommendations.length > 0 ? (
                    displayAnalytics.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-accent">{index + 1}</span>
                        </div>
                        <p className="text-sm text-foreground" data-testid={`recommendation-item-${index}`}>
                          {recommendation}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <ClipboardList className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground" data-testid="no-recommendations">
                        No recommendations available yet. Submit feedback to generate recommendations.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export Options */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Download className="text-primary mr-2" />
                Export & Share
              </h4>
              <div className="grid sm:grid-cols-3 gap-4">
                <Button
                  onClick={handleExportPDF}
                  className="flex items-center justify-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="button-export-pdf"
                >
                  <FileText className="h-4 w-4" />
                  <span>PDF Report</span>
                </Button>
                <Button
                  onClick={handleExportCSV}
                  variant="secondary"
                  className="flex items-center justify-center space-x-2"
                  data-testid="button-export-csv"
                >
                  <Download className="h-4 w-4" />
                  <span>CSV Data</span>
                </Button>
                <Button
                  onClick={handleShareLink}
                  variant="outline"
                  className="flex items-center justify-center space-x-2"
                  data-testid="button-share-link"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share Link</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Reports include all analysis data, insights, and recommendations for policymaker review
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
