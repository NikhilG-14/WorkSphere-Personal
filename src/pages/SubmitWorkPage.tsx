import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import IPFSUploader from "@/components/job/IPFSUploader";
import { toast } from "sonner";
import { 
  FileText, 
  Link as LinkIcon, 
  Github, 
  BookOpen,
  CheckCircle2,
  Info
} from "lucide-react";

const SubmitWorkPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [docsUrl, setDocsUrl] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRevision] = useState(false); // Set to true if this is a revision

  // Mock job data
  const jobData = {
    title: "Build DeFi Dashboard with Real-Time Analytics",
    client: "CryptoVentures DAO",
    budget: "10 SOL",
    status: "In Progress"
  };

  const maxChars = 2000;
  const remainingChars = maxChars - deliveryMessage.length;

  const handleSubmit = async () => {
    if (!deliveryMessage.trim()) {
      toast.error("Please provide a delivery message");
      return;
    }

    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Work submitted successfully – awaiting client review", {
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />
      });
      
      // Navigate to submission details
      setTimeout(() => {
        navigate(`/jobs/${jobId}/submission`);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <motion.div
          className="absolute top-1/4 -right-48 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-48 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Submit Your Work
          </h1>
          <p className="text-muted-foreground">
            Deliver your completed work and await client review
          </p>
        </motion.div>

        {/* Job Summary Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6 bg-card/40 backdrop-blur-xl border-border/50 shadow-xl">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Job Title
                  </p>
                  <p className="font-semibold text-foreground">{jobData.title}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Client
                  </p>
                  <p className="font-semibold text-foreground">{jobData.client}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Budget
                  </p>
                  <p className="font-semibold text-primary">{jobData.budget}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Status
                  </p>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    {jobData.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Revision Banner */}
        {isRevision && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="bg-secondary/20 border border-secondary/30 rounded-lg p-4 flex items-start gap-3">
              <Info className="h-5 w-5 text-secondary mt-0.5" />
              <div>
                <p className="font-medium text-secondary">Revision Submission</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Client requested changes — you are submitting a revised version
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Submission Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-card/40 backdrop-blur-xl border-border/50 shadow-2xl">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Work Submission Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Delivery Message */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    Delivery Message
                    <span className="text-destructive">*</span>
                  </span>
                  <span className={`text-xs ${remainingChars < 100 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {remainingChars} characters remaining
                  </span>
                </label>
                <Textarea
                  value={deliveryMessage}
                  onChange={(e) => setDeliveryMessage(e.target.value.slice(0, maxChars))}
                  placeholder="Describe what you've delivered, any important notes, instructions, or highlights of your work..."
                  className="min-h-[200px] bg-background/50 border-border/50 focus:border-primary/50 resize-none text-base leading-relaxed"
                />
                <p className="text-xs text-muted-foreground">
                  Provide a comprehensive description of your completed work
                </p>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  Work Files / Attachments
                  <span className="text-destructive">*</span>
                </label>
                <IPFSUploader
                  attachments={attachments}
                  onChange={setAttachments}
                />
              </div>

              {/* Optional URLs */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-medium text-foreground">
                  Additional Links <span className="text-muted-foreground">(Optional)</span>
                </h3>
                
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Live Demo URL
                  </label>
                  <Input
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://your-live-demo.com"
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    Repository URL
                  </label>
                  <Input
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/username/repository"
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Documentation URL
                  </label>
                  <Input
                    value={docsUrl}
                    onChange={(e) => setDocsUrl(e.target.value)}
                    placeholder="https://docs.your-project.com"
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex justify-center"
        >
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !deliveryMessage.trim() || attachments.length === 0}
            className="px-12 py-6 text-lg font-semibold bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] hover:bg-[position:100%_0] transition-all duration-500 shadow-lg hover:shadow-primary/50 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <CheckCircle2 className="h-5 w-5" />
                </motion.div>
                Submitting Work...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Submit Work
              </>
            )}
          </Button>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-sm text-muted-foreground"
        >
          <p>
            Your work will be reviewed by the client. You'll be notified once they approve or request revisions.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SubmitWorkPage;
