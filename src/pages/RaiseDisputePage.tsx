import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Upload,
  X,
  FileText,
  Scale,
  Vote,
  CheckCircle,
  Info,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/layout/Navigation";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

const RaiseDisputePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reason, setReason] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxReasonChars = 500;
  const maxNotesChars = 1000;
  const reasonCharsRemaining = maxReasonChars - reason.length;
  const notesCharsRemaining = maxNotesChars - additionalNotes.length;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    setUploadedFiles([...uploadedFiles, ...newFiles]);
    toast({
      title: "Files uploaded",
      description: `${newFiles.length} file(s) added successfully`,
    });
  };

  const removeFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (reason.trim().length < 50) {
      toast({
        title: "Validation Error",
        description: "Dispute reason must be at least 50 characters",
        variant: "destructive",
      });
      return;
    }

    if (uploadedFiles.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please upload at least one piece of evidence",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      toast({
        title: "Dispute Submitted",
        description: "Your dispute has been submitted and is now under review",
      });
      navigate("/disputes/dispute-001");
    }, 2000);
  };

  const disputeSteps = [
    {
      icon: <AlertTriangle className="h-5 w-5" />,
      title: "Dispute Created",
      description: "Submit your dispute with evidence and reasoning",
      color: "text-status-warning",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Evidence Submission",
      description: "Both parties can submit supporting documentation",
      color: "text-status-info",
    },
    {
      icon: <Vote className="h-5 w-5" />,
      title: "DAO Voting",
      description: "Community votes on the dispute outcome",
      color: "text-primary",
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: "Resolution",
      description: "Funds are distributed based on voting results",
      color: "text-status-success",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-status-warning/10 border border-status-warning/30 mb-4">
            <Scale className="h-6 w-6 text-status-warning" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Raise a Dispute
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Submit a dispute to resolve disagreements fairly through community governance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  Dispute Information
                </CardTitle>
                <CardDescription>
                  Provide detailed information about your dispute
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Dispute Reason */}
                  <div className="space-y-2">
                    <Label htmlFor="reason" className="text-base">
                      Dispute Reason <span className="text-status-error">*</span>
                    </Label>
                    <Textarea
                      id="reason"
                      placeholder="Describe the issue in detail... (minimum 50 characters)"
                      value={reason}
                      onChange={(e) => setReason(e.target.value.slice(0, maxReasonChars))}
                      className="min-h-[150px] resize-none bg-background/50 border-border/50 focus:border-primary/50"
                      required
                    />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Minimum 50 characters required
                      </span>
                      <span
                        className={`font-mono ${
                          reasonCharsRemaining < 50
                            ? "text-status-error"
                            : reasonCharsRemaining < 100
                            ? "text-status-warning"
                            : "text-muted-foreground"
                        }`}
                      >
                        {reasonCharsRemaining} characters remaining
                      </span>
                    </div>
                  </div>

                  {/* Evidence Upload */}
                  <div className="space-y-2">
                    <Label className="text-base">
                      Attach Evidence <span className="text-status-error">*</span>
                    </Label>
                    <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center hover:border-primary/50 transition-colors bg-background/30">
                      <input
                        type="file"
                        id="file-upload"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-3 rounded-full bg-primary/10 border border-primary/30">
                            <Upload className="h-6 w-6 text-primary" />
                          </div>
                          <div className="text-sm">
                            <span className="font-semibold text-primary">Click to upload</span>
                            <span className="text-muted-foreground"> or drag and drop</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            PDF, DOC, JPG, PNG up to 10MB each
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Uploaded Files */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <Label className="text-sm text-muted-foreground">Uploaded Files</Label>
                        <div className="space-y-2">
                          {uploadedFiles.map((file) => (
                            <motion.div
                              key={file.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-colors group"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatFileSize(file.size)}
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(file.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-base">
                      Additional Notes <span className="text-muted-foreground">(Optional)</span>
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional information that might be relevant..."
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value.slice(0, maxNotesChars))}
                      className="min-h-[100px] resize-none bg-background/50 border-border/50 focus:border-primary/50"
                    />
                    <div className="flex items-center justify-end text-xs">
                      <span className={`font-mono ${notesCharsRemaining < 100 ? "text-status-warning" : "text-muted-foreground"}`}>
                        {notesCharsRemaining} characters remaining
                      </span>
                    </div>
                  </div>

                  {/* Warning Notice */}
                  <div className="p-4 rounded-lg bg-status-warning/10 border border-status-warning/30">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-status-warning mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-status-warning">Important Notice</p>
                        <p className="text-xs text-muted-foreground">
                          Submitting a dispute will freeze the job funds in escrow until resolution. 
                          False disputes may result in penalties. Ensure all information is accurate.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Scale className="h-5 w-5" />
                          </motion.div>
                          Submitting Dispute...
                        </>
                      ) : (
                        <>
                          <Scale className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                          Submit Dispute
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                    {!isSubmitting && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-20"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Dispute Process Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="glass-panel sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">How Disputes Work</CardTitle>
                <CardDescription>The dispute resolution process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {disputeSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="relative"
                  >
                    <div className="flex gap-3">
                      {/* Step Number and Line */}
                      <div className="flex flex-col items-center">
                        <div className={`p-2 rounded-lg border-2 bg-background/50 ${step.color}`}>
                          {step.icon}
                        </div>
                        {index < disputeSteps.length - 1 && (
                          <div className="w-0.5 h-full bg-gradient-to-b from-border to-transparent my-1" />
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 pb-4">
                        <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-lg">Resolution Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded bg-background/30">
                  <span className="text-sm text-muted-foreground">Avg. Resolution Time</span>
                  <Badge variant="outline">5-7 days</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-background/30">
                  <span className="text-sm text-muted-foreground">Fair Outcomes</span>
                  <Badge variant="outline" className="bg-status-success/10 text-status-success border-status-success/30">
                    94%
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-background/30">
                  <span className="text-sm text-muted-foreground">Total Disputes</span>
                  <Badge variant="outline">1,247</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RaiseDisputePage;
