import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Edit, FileUp, CloudUpload } from "lucide-react";
import { ProcessingResult } from "@/types/feedback";

export default function UploadSection() {
  const [textFeedback, setTextFeedback] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("auto");
  const [isProcessing, setIsProcessing] = useState(false);
  const { uploadFile, isUploading, error: uploadError } = useFileUpload();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const textSubmissionMutation = useMutation({
    mutationFn: async (data: { originalText: string; originalLanguage?: string }) => {
      const response = await apiRequest("POST", "/api/feedback/text", data);
      return await response.json() as ProcessingResult;
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message,
      });
      setTextFeedback("");
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/feedback'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleTextSubmit = () => {
    if (!textFeedback.trim()) {
      toast({
        title: "Error",
        description: "Please enter some feedback text",
        variant: "destructive",
      });
      return;
    }

    const submissionData = {
      originalText: textFeedback,
      originalLanguage: selectedLanguage === "auto" ? undefined : selectedLanguage,
      demographicTags: [],
    };

    textSubmissionMutation.mutate(submissionData);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile(file) as ProcessingResult;
      toast({
        title: "Success",
        description: result.message,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/feedback'] });
      
      // Reset file input
      event.target.value = '';
    } catch (error) {
      // Error is already handled by useFileUpload hook
    }
  };

  const handleDropZoneClick = () => {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-primary', 'bg-muted');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary', 'bg-muted');
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary', 'bg-muted');
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file) {
      try {
        const result = await uploadFile(file) as ProcessingResult;
        toast({
          title: "Success",
          description: result.message,
        });
        queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
        queryClient.invalidateQueries({ queryKey: ['/api/feedback'] });
      } catch (error) {
        // Error is already handled by useFileUpload hook
      }
    }
  };

  return (
    <section id="upload" className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div id="upload-section" className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4" data-testid="upload-title">
              Upload Civic Feedback
            </h3>
            <p className="text-muted-foreground" data-testid="upload-description">
              Upload text feedback or CSV files for AI-powered analysis and translation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Text Input */}
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Edit className="text-primary mr-2" />
                  Text Input
                </h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="language-select" className="block text-sm font-medium text-foreground mb-2">
                      Feedback Language
                    </Label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger data-testid="select-language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto-detect</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="Chinese">Chinese</SelectItem>
                        <SelectItem value="Arabic">Arabic</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="feedback-textarea" className="block text-sm font-medium text-foreground mb-2">
                      Community Feedback
                    </Label>
                    <Textarea
                      id="feedback-textarea"
                      placeholder="Enter civic feedback here... (e.g., survey responses, community comments)"
                      className="w-full h-32 resize-none"
                      value={textFeedback}
                      onChange={(e) => setTextFeedback(e.target.value)}
                      data-testid="textarea-feedback"
                    />
                  </div>
                  <Button 
                    onClick={handleTextSubmit}
                    disabled={textSubmissionMutation.isPending || !textFeedback.trim()}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-process-feedback"
                  >
                    {textSubmissionMutation.isPending ? "Processing..." : "Process Feedback"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <FileUp className="text-primary mr-2" />
                  File Upload
                </h4>
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer transition-all hover:border-primary hover:bg-muted"
                  onClick={handleDropZoneClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  data-testid="file-drop-zone"
                >
                  <CloudUpload className="mx-auto text-4xl text-muted-foreground mb-4" />
                  <p className="text-foreground font-medium mb-2">Drop files here or click to browse</p>
                  <p className="text-sm text-muted-foreground mb-4">Supports CSV, TXT files up to 10MB</p>
                  <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    data-testid="input-file"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={isUploading}
                    data-testid="button-choose-file"
                  >
                    {isUploading ? "Uploading..." : "Choose File"}
                  </Button>
                </div>
                
                {uploadError && (
                  <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive" data-testid="upload-error">
                      {uploadError}
                    </p>
                  </div>
                )}
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">File Format:</span>
                    <span className="text-foreground">CSV with headers</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Required Columns:</span>
                    <span className="text-foreground">feedback, language (optional)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Processing Status */}
          {(textSubmissionMutation.isPending || isUploading) && (
            <div className="mt-8 bg-muted rounded-lg p-6" data-testid="processing-status">
              <div className="flex items-center space-x-3">
                <div className="animate-pulse w-5 h-5 bg-primary rounded-full"></div>
                <div>
                  <p className="font-medium text-foreground">Processing Feedback...</p>
                  <p className="text-sm text-muted-foreground">
                    AI translation, sentiment analysis, and inclusive rewriting in progress
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
