import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Paperclip,
  Upload,
  Vote,
  Scale,
  FileText,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/layout/Navigation";

interface Evidence {
  id: string;
  submittedBy: "client" | "freelancer";
  description: string;
  attachments: string[];
  submittedDate: string;
}

interface DisputeDetail {
  id: string;
  jobId: string;
  jobTitle: string;
  status: "open" | "voting" | "resolved" | "rejected";
  client: {
    address: string;
    name: string;
  };
  freelancer: {
    address: string;
    name: string;
  };
  createdDate: string;
  reason: string;
  description: string;
  amount: number;
  votingStats: {
    votesFor: number;
    votesAgainst: number;
    totalStake: number;
    endDate: string;
  };
  evidence: Evidence[];
  timeline: {
    created: string;
    votingStarted?: string;
    resolved?: string;
  };
}

// Mock data
const mockDispute: DisputeDetail = {
  id: "dispute-001",
  jobId: "job-123",
  jobTitle: "Smart Contract Audit for DeFi Protocol",
  status: "voting",
  client: {
    address: "7xKX...9YzD",
    name: "DeFi Labs",
  },
  freelancer: {
    address: "4mNp...2QwT",
    name: "Alex Chen",
  },
  createdDate: "2024-03-15T10:30:00Z",
  reason: "Payment Dispute",
  description:
    "The freelancer claims that the final milestone payment was not released despite completing all deliverables as specified in the contract. The client disputes the quality of the smart contract audit report, stating that several critical vulnerabilities were not identified. The freelancer has provided comprehensive documentation and test results demonstrating that all agreed-upon scope items were completed according to industry standards. This dispute requires community voting to determine the appropriate resolution and fund distribution.",
  amount: 5.5,
  votingStats: {
    votesFor: 145,
    votesAgainst: 68,
    totalStake: 213,
    endDate: "2024-03-22T10:30:00Z",
  },
  evidence: [
    {
      id: "ev-001",
      submittedBy: "freelancer",
      description:
        "Complete audit report with detailed findings, test coverage reports, and documentation of all deliverables. Includes screenshots of communication with client acknowledging milestone completion.",
      attachments: ["audit-report.pdf", "test-results.xlsx", "communication-logs.pdf"],
      submittedDate: "2024-03-15T12:00:00Z",
    },
    {
      id: "ev-002",
      submittedBy: "client",
      description:
        "Internal security review highlighting gaps in the audit report. Several critical vulnerabilities were discovered post-delivery that should have been identified during the audit process.",
      attachments: ["security-review.pdf", "vulnerability-report.pdf"],
      submittedDate: "2024-03-16T09:00:00Z",
    },
  ],
  timeline: {
    created: "2024-03-15T10:30:00Z",
    votingStarted: "2024-03-15T14:00:00Z",
  },
};

const DisputeDetailPage = () => {
  const { disputeId } = useParams();
  const [dispute] = useState<DisputeDetail>(mockDispute);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="h-5 w-5" />;
      case "voting":
        return <Clock className="h-5 w-5" />;
      case "resolved":
        return <CheckCircle className="h-5 w-5" />;
      case "rejected":
        return <XCircle className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-status-warning/20 text-status-warning border-status-warning/30";
      case "voting":
        return "bg-status-info/20 text-status-info border-status-info/30";
      case "resolved":
        return "bg-status-success/20 text-status-success border-status-success/30";
      case "rejected":
        return "bg-status-error/20 text-status-error border-status-error/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const votesForPercentage = Math.round(
    (dispute.votingStats.votesFor / dispute.votingStats.totalStake) * 100
  );
  const votesAgainstPercentage = Math.round(
    (dispute.votingStats.votesAgainst / dispute.votingStats.totalStake) * 100
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Link to="/disputes">
            <Button variant="ghost" className="group">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Disputes
            </Button>
          </Link>
        </motion.div>

        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Card className="glass-panel overflow-hidden">
            <CardHeader className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg border ${getStatusColor(dispute.status)}`}>
                      {getStatusIcon(dispute.status)}
                    </div>
                    <Badge className={`${getStatusColor(dispute.status)}`}>
                      {dispute.status.toUpperCase()}
                    </Badge>
                  </div>
                  <CardTitle className="text-3xl mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {dispute.jobTitle}
                  </CardTitle>
                  <CardDescription className="text-base flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    Dispute ID: {dispute.id}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-1">Disputed Amount</div>
                  <div className="text-3xl font-bold text-primary">{dispute.amount} SOL</div>
                </div>
              </div>

              <Separator />

              {/* Parties */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-background/30 border border-border/50">
                  <div className="p-2 rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Client</div>
                    <div className="font-semibold">{dispute.client.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{dispute.client.address}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-background/30 border border-border/50">
                  <div className="p-2 rounded-full bg-secondary/10">
                    <User className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Freelancer</div>
                    <div className="font-semibold">{dispute.freelancer.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{dispute.freelancer.address}</div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-border" />
                  <div
                    className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style={{ width: dispute.timeline.resolved ? "100%" : dispute.timeline.votingStarted ? "50%" : "0%" }}
                  />

                  {/* Timeline Steps */}
                  <TimelineStep
                    label="Created"
                    date={dispute.timeline.created}
                    active={true}
                    completed={true}
                  />
                  <TimelineStep
                    label="Voting"
                    date={dispute.timeline.votingStarted}
                    active={dispute.status === "voting"}
                    completed={!!dispute.timeline.votingStarted}
                  />
                  <TimelineStep
                    label="Resolved"
                    date={dispute.timeline.resolved}
                    active={dispute.status === "resolved"}
                    completed={!!dispute.timeline.resolved}
                  />
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dispute Details */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Dispute Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-2">Reason</div>
                    <Badge variant="outline" className="mb-3">
                      {dispute.reason}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-2">Description</div>
                    <p className="text-foreground leading-relaxed">{dispute.description}</p>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-2">Created</div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(dispute.createdDate).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Evidence */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Paperclip className="h-5 w-5 text-primary" />
                    Evidence Submitted
                  </CardTitle>
                  <CardDescription>Documentation and proof from both parties</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dispute.evidence.map((evidence, index) => (
                    <motion.div
                      key={evidence.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="p-4 rounded-lg bg-background/30 border border-border/50 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className={
                            evidence.submittedBy === "client"
                              ? "bg-primary/10 text-primary border-primary/30"
                              : "bg-secondary/10 text-secondary border-secondary/30"
                          }
                        >
                          {evidence.submittedBy === "client" ? "Client" : "Freelancer"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(evidence.submittedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{evidence.description}</p>
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-muted-foreground">Attachments:</div>
                        <div className="flex flex-wrap gap-2">
                          {evidence.attachments.map((attachment, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="bg-background/50 hover:bg-background/80 cursor-pointer transition-colors"
                            >
                              <Paperclip className="h-3 w-3 mr-1" />
                              {attachment}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/disputes/raise-evidence" className="flex-1">
                <Button variant="outline" className="w-full group hover:bg-primary/10 hover:border-primary/50">
                  <Upload className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Submit Evidence
                </Button>
              </Link>
              <Link to="/disputes/voting" className="flex-1">
                <Button variant="hero" className="w-full group">
                  <Vote className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                  Go to Voting Panel
                  <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Sidebar - Voting Statistics */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="glass-panel sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Vote className="h-5 w-5 text-primary" />
                    Voting Statistics
                  </CardTitle>
                  <CardDescription>Community voting results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Votes For */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Votes For Freelancer</span>
                      <span className="font-semibold text-status-success">{dispute.votingStats.votesFor}</span>
                    </div>
                    <Progress value={votesForPercentage} className="h-2 bg-background/50" />
                    <div className="text-xs text-right text-muted-foreground">{votesForPercentage}%</div>
                  </div>

                  {/* Votes Against */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Votes For Client</span>
                      <span className="font-semibold text-status-error">{dispute.votingStats.votesAgainst}</span>
                    </div>
                    <Progress value={votesAgainstPercentage} className="h-2 bg-background/50" />
                    <div className="text-xs text-right text-muted-foreground">{votesAgainstPercentage}%</div>
                  </div>

                  <Separator />

                  {/* Total Stake */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border/50">
                    <span className="text-sm text-muted-foreground">Total Voting Stake</span>
                    <span className="font-bold text-primary">{dispute.votingStats.totalStake} SOL</span>
                  </div>

                  {/* Voting Deadline */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border/50">
                    <span className="text-sm text-muted-foreground">Voting Ends</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        {new Date(dispute.votingStats.endDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(dispute.votingStats.endDate).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>

                  {/* Status Banner */}
                  <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-semibold text-sm mb-1">Voting in Progress</div>
                        <div className="text-xs text-muted-foreground">
                          Cast your vote to help resolve this dispute fairly
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TimelineStepProps {
  label: string;
  date?: string;
  active: boolean;
  completed: boolean;
}

const TimelineStep = ({ label, date, active, completed }: TimelineStepProps) => {
  return (
    <div className="flex flex-col items-center relative z-10">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
          completed
            ? "bg-gradient-to-br from-primary to-secondary border-primary shadow-glow"
            : active
            ? "bg-background border-primary animate-pulse"
            : "bg-background border-border"
        }`}
      >
        {completed && <CheckCircle className="h-4 w-4 text-primary-foreground" />}
        {active && !completed && <Clock className="h-4 w-4 text-primary" />}
      </motion.div>
      <div className="mt-2 text-center">
        <div className={`text-sm font-semibold ${completed || active ? "text-foreground" : "text-muted-foreground"}`}>
          {label}
        </div>
        {date && (
          <div className="text-xs text-muted-foreground mt-1">{new Date(date).toLocaleDateString()}</div>
        )}
      </div>
    </div>
  );
};

export default DisputeDetailPage;
