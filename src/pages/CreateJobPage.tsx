import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Wallet, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import MilestoneBuilder from "@/components/job/MilestoneBuilder";
import JobPreviewCard from "@/components/job/JobPreviewCard";
import IPFSUploader from "@/components/job/IPFSUploader";
import ConfirmationModal from "@/components/job/ConfirmationModal";

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date | null;
  amount: number;
}

interface JobFormData {
  title: string;
  description: string;
  budget: string;
  deadline: string;
  paymentType: "full" | "milestone";
  skills: string[];
  category: string;
  visibility: "public" | "private";
  invitedWallets: string[];
  biddingWindow: string;
  milestones: Milestone[];
  attachments: Array<{ cid: string; name: string; size: number }>;
}

const CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "Blockchain & Web3",
  "Design & Creative",
  "Writing & Content",
  "Marketing & Sales",
  "Data & Analytics",
  "AI & Machine Learning",
];

const SKILLS_OPTIONS = [
  "React", "TypeScript", "Solana", "Rust", "Python", "Node.js",
  "Smart Contracts", "Web3", "UI/UX Design", "Figma", "Photoshop",
  "Content Writing", "SEO", "Marketing", "Data Analysis", "Machine Learning"
];

export default function CreateJobPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isWalletConnected, setIsWalletConnected] = useState(true); // Mock wallet state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    paymentType: "full",
    skills: [],
    category: "",
    visibility: "public",
    invitedWallets: [],
    biddingWindow: "",
    milestones: [],
    attachments: [],
  });

  // Auto-save draft to localStorage
  useEffect(() => {
    const draftKey = "job-creation-draft";
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData(draft);
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }

    const interval = setInterval(() => {
      localStorage.setItem(draftKey, JSON.stringify(formData));
    }, 5000);

    return () => clearInterval(interval);
  }, [formData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Title validation
    if (formData.title.length < 10) {
      newErrors.title = "Title must be at least 10 characters";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must not exceed 100 characters";
    }

    // Description validation
    if (formData.description.length < 100) {
      newErrors.description = "Description must be at least 100 characters";
    } else if (formData.description.length > 1000) {
      newErrors.description = "Description must not exceed 1000 characters";
    }

    // Budget validation
    const budget = parseFloat(formData.budget);
    if (!formData.budget || isNaN(budget) || budget <= 0) {
      newErrors.budget = "Please enter a valid budget in SOL";
    }

    // Deadline validation
    if (!formData.deadline) {
      newErrors.deadline = "Please select a deadline";
    } else {
      const deadlineDate = new Date(formData.deadline);
      if (deadlineDate <= new Date()) {
        newErrors.deadline = "Deadline must be in the future";
      }
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    // Skills validation
    if (formData.skills.length === 0) {
      newErrors.skills = "Please select at least one skill";
    } else if (formData.skills.length > 10) {
      newErrors.skills = "Maximum 10 skills allowed";
    }

    // Milestone validation
    if (formData.paymentType === "milestone") {
      if (formData.milestones.length === 0) {
        newErrors.milestones = "Please add at least one milestone";
      } else if (formData.milestones.length > 10) {
        newErrors.milestones = "Maximum 10 milestones allowed";
      } else {
        const totalMilestoneAmount = formData.milestones.reduce(
          (sum, m) => sum + m.amount,
          0
        );
        if (Math.abs(totalMilestoneAmount - budget) > 0.001) {
          newErrors.milestones = `Milestone amounts (${totalMilestoneAmount.toFixed(2)} SOL) must equal budget (${budget.toFixed(2)} SOL)`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePublish = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before publishing",
        variant: "destructive",
      });
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmPublish = async () => {
    setIsPublishing(true);
    
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Convert budget to lamports (1 SOL = 1,000,000,000 lamports)
      const budgetLamports = Math.floor(parseFloat(formData.budget) * 1_000_000_000);
      const deadlineUnix = Math.floor(new Date(formData.deadline).getTime() / 1000);

      // Mock job creation
      const jobId = `job_${Date.now()}`;
      const jobData = {
        id: jobId,
        ...formData,
        budgetLamports,
        deadlineUnix,
        status: "open",
        clientPubkey: "mock_wallet_address",
        createdAt: Date.now(),
      };

      // Store in localStorage for demo
      const existingJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
      existingJobs.unshift(jobData);
      localStorage.setItem("jobs", JSON.stringify(existingJobs));

      toast({
        title: "Job Created Successfully!",
        description: "Your job has been published on-chain",
      });

      // Ask to fund escrow
      const shouldFund = window.confirm(
        `Job created successfully! Would you like to fund the escrow with ${formData.budget} SOL now?`
      );

      if (shouldFund) {
        await simulateFundEscrow(jobId, budgetLamports);
      }

      // Clear draft
      localStorage.removeItem("job-creation-draft");

      // Redirect to job detail page
      navigate(`/jobs/${jobId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
      setShowConfirmation(false);
    }
  };

  const simulateFundEscrow = async (jobId: string, amount: number) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check mock balance (assume user has enough for demo)
      const mockBalance = 100; // SOL
      const requiredSOL = amount / 1_000_000_000;

      if (mockBalance < requiredSOL) {
        throw new Error(`Insufficient balance. You need ${requiredSOL} SOL but have ${mockBalance} SOL`);
      }

      toast({
        title: "Escrow Funded!",
        description: `${requiredSOL} SOL transferred to escrow`,
      });
    } catch (error) {
      toast({
        title: "Funding Failed",
        description: error instanceof Error ? error.message : "Failed to fund escrow",
        variant: "destructive",
      });
    }
  };

  const autoSplitMilestones = () => {
    const budget = parseFloat(formData.budget);
    if (isNaN(budget) || budget <= 0 || formData.milestones.length === 0) return;

    const amountPerMilestone = budget / formData.milestones.length;
    const updatedMilestones = formData.milestones.map(m => ({
      ...m,
      amount: parseFloat(amountPerMilestone.toFixed(4)),
    }));

    setFormData({ ...formData, milestones: updatedMilestones });
    toast({
      title: "Budget Split",
      description: `${amountPerMilestone.toFixed(4)} SOL per milestone`,
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 opacity-30">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-primary rounded-full blur-[120px]"
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
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-gold rounded-full blur-[120px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4 hover:bg-glass-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-8 w-8 text-neon-gold" />
            <h1 className="text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              Create New Job
            </h1>
          </div>
          <p className="text-foreground-muted text-lg">
            Post your project and connect with talented freelancers on Web3
          </p>
        </motion.div>

        {/* Wallet Warning */}
        {!isWalletConnected && (
          <Alert className="mb-6 border-warning/50 bg-warning/10">
            <Wallet className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning">
              Please connect your wallet to create a job
            </AlertDescription>
          </Alert>
        )}

        {/* Form Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Basic Info */}
            <div className="glass-panel p-6 rounded-xl border border-glass-border space-y-4">
              <h2 className="text-2xl font-semibold text-neon-primary flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-neon-primary/20 flex items-center justify-center text-sm">1</div>
                Basic Information
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-foreground">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Build a DeFi Dashboard on Solana"
                    maxLength={100}
                    className="mt-1.5 bg-background-elevated border-input-border focus:border-border-glow focus:ring-2 focus:ring-primary-glow"
                  />
                  <div className="flex justify-between mt-1 text-xs">
                    <span className={errors.title ? "text-destructive" : "text-foreground-muted"}>
                      {errors.title || `${formData.title.length}/100 characters`}
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-foreground">Job Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your project in detail, including requirements, deliverables, and expectations..."
                    maxLength={1000}
                    rows={6}
                    className="mt-1.5 bg-background-elevated border-input-border focus:border-border-glow focus:ring-2 focus:ring-primary-glow resize-none"
                  />
                  <div className="flex justify-between mt-1 text-xs">
                    <span className={errors.description ? "text-destructive" : "text-foreground-muted"}>
                      {errors.description || `${formData.description.length}/1000 characters`}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-foreground">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger className="mt-1.5 bg-background-elevated border-input-border focus:border-border-glow focus:ring-2 focus:ring-primary-glow">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-background-elevated border-glass-border z-50">
                        {CATEGORIES.map((cat) => (
                          <SelectItem 
                            key={cat} 
                            value={cat}
                            className="focus:bg-glass-primary focus:text-foreground"
                          >
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-xs text-destructive mt-1">{errors.category}</p>}
                  </div>

                <div>
                  <Label htmlFor="skills" className="text-foreground">Skills Required * (Max 10)</Label>
                  <Select
                    value=""
                    onValueChange={(value) => {
                      if (value && !formData.skills.includes(value) && formData.skills.length < 10) {
                        setFormData({ ...formData, skills: [...formData.skills, value] });
                      }
                    }}
                  >
                    <SelectTrigger className="mt-1.5 bg-background-elevated border-input-border focus:border-border-glow focus:ring-2 focus:ring-primary-glow">
                      <SelectValue placeholder="Add skills" />
                    </SelectTrigger>
                    <SelectContent className="bg-background-elevated border-glass-border z-50">
                      {SKILLS_OPTIONS.filter(skill => !formData.skills.includes(skill)).map((skill) => (
                        <SelectItem 
                          key={skill} 
                          value={skill}
                          className="focus:bg-glass-primary focus:text-foreground"
                        >
                          {skill}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.skills && <p className="text-xs text-destructive mt-1">{errors.skills}</p>}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.map((skill) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="px-3 py-1.5 bg-neon-primary/10 border border-neon-primary/30 text-neon-primary rounded-full text-xs flex items-center gap-2 cursor-pointer hover:bg-neon-primary/20 transition-colors"
                        onClick={() => setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) })}
                      >
                        {skill}
                        <span className="text-neon-primary/70 hover:text-neon-primary">×</span>
                      </motion.span>
                    ))}
                  </div>
                </div>
                </div>
              </div>
            </div>

            {/* Budget & Timeline */}
            <div className="glass-panel p-6 rounded-xl border border-glass-border space-y-4">
              <h2 className="text-2xl font-semibold text-neon-primary flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-neon-primary/20 flex items-center justify-center text-sm">2</div>
                Budget & Timeline
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget" className="text-foreground">Total Budget (SOL) *</Label>
                  <Input
                    id="budget"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="0.00"
                    className="mt-1.5 bg-background-elevated border-input-border focus:border-border-glow focus:ring-2 focus:ring-primary-glow"
                  />
                  {errors.budget && <p className="text-xs text-destructive mt-1">{errors.budget}</p>}
                </div>

                <div>
                  <Label htmlFor="deadline" className="text-foreground">Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1.5 bg-background-elevated border-input-border focus:border-border-glow focus:ring-2 focus:ring-primary-glow"
                  />
                  {errors.deadline && <p className="text-xs text-destructive mt-1">{errors.deadline}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="paymentType" className="text-foreground">Payment Type *</Label>
                <Select value={formData.paymentType} onValueChange={(value: "full" | "milestone") => setFormData({ ...formData, paymentType: value })}>
                  <SelectTrigger className="mt-1.5 bg-background-elevated border-input-border focus:border-border-glow focus:ring-2 focus:ring-primary-glow">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background-elevated border-glass-border z-50">
                    <SelectItem value="full" className="focus:bg-glass-primary focus:text-foreground">
                      Full Payment (Pay on completion)
                    </SelectItem>
                    <SelectItem value="milestone" className="focus:bg-glass-primary focus:text-foreground">
                      Milestone-Based (Pay per milestone)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Milestones */}
            {formData.paymentType === "milestone" && (
              <MilestoneBuilder
                milestones={formData.milestones}
                budget={parseFloat(formData.budget) || 0}
                onChange={(milestones) => setFormData({ ...formData, milestones })}
                onAutoSplit={autoSplitMilestones}
                error={errors.milestones}
              />
            )}

            {/* Attachments */}
            <IPFSUploader
              attachments={formData.attachments}
              onChange={(attachments) => setFormData({ ...formData, attachments })}
            />

            {/* Additional Settings */}
            <div className="glass-panel p-6 rounded-xl border border-glass-border space-y-4">
              <h2 className="text-2xl font-semibold text-neon-primary flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-neon-primary/20 flex items-center justify-center text-sm">
                  {formData.paymentType === "milestone" ? "4" : "3"}
                </div>
                Additional Settings
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="visibility" className="text-foreground">Job Visibility</Label>
                  <Select value={formData.visibility} onValueChange={(value: "public" | "private") => setFormData({ ...formData, visibility: value })}>
                    <SelectTrigger className="mt-1.5 bg-background-elevated border-input-border focus:border-border-glow focus:ring-2 focus:ring-primary-glow">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background-elevated border-glass-border z-50">
                      <SelectItem value="public" className="focus:bg-glass-primary focus:text-foreground">
                        Public (Visible to all freelancers)
                      </SelectItem>
                      <SelectItem value="private" className="focus:bg-glass-primary focus:text-foreground">
                        Private (Invite specific freelancers)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="biddingWindow" className="text-foreground">Bidding Window (Optional)</Label>
                  <Input
                    id="biddingWindow"
                    type="number"
                    value={formData.biddingWindow}
                    onChange={(e) => setFormData({ ...formData, biddingWindow: e.target.value })}
                    placeholder="Number of days"
                    className="mt-1.5 bg-background-elevated border-input-border"
                  />
                  <p className="text-xs text-foreground-muted mt-1">
                    Leave empty for no time limit
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 sticky bottom-4 lg:relative lg:bottom-0">
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="flex-1 border-glass-border hover:bg-glass-primary"
              >
                Save Draft
              </Button>
              <Button
                onClick={handlePublish}
                disabled={!isWalletConnected || isPublishing}
                className="flex-1 bg-gradient-gold hover:shadow-gold"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Publish Job
              </Button>
            </div>
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8">
              <JobPreviewCard formData={formData} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmPublish}
        formData={formData}
        isLoading={isPublishing}
      />
    </div>
  );
}
