import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Calendar, Briefcase, Shield, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/layout/Navigation";
import { Link } from "react-router-dom";

interface Dispute {
  id: string;
  jobId: string;
  jobTitle: string;
  reason: string;
  status: "open" | "voting" | "resolved" | "rejected";
  createdDate: string;
  amount: number;
}

const mockDisputes: Dispute[] = [
  {
    id: "1",
    jobId: "job-1",
    jobTitle: "Smart Contract Audit for DeFi Protocol",
    reason: "Freelancer claims incomplete payment for milestone completion...",
    status: "open",
    createdDate: "2024-03-15",
    amount: 5.5,
  },
  {
    id: "2",
    jobId: "job-2",
    jobTitle: "NFT Marketplace Frontend Development",
    reason: "Client disputes the quality of deliverables submitted...",
    status: "voting",
    createdDate: "2024-03-10",
    amount: 8.2,
  },
  {
    id: "3",
    jobId: "job-3",
    jobTitle: "Token Economics Whitepaper",
    reason: "Disagreement on project scope and final deliverables...",
    status: "resolved",
    createdDate: "2024-02-28",
    amount: 3.8,
  },
  {
    id: "4",
    jobId: "job-4",
    jobTitle: "Web3 Integration for E-commerce",
    reason: "Client claims work was not delivered on time...",
    status: "rejected",
    createdDate: "2024-02-20",
    amount: 6.5,
  },
  {
    id: "5",
    jobId: "job-5",
    jobTitle: "DAO Governance Smart Contract",
    reason: "Payment release delayed, freelancer initiated dispute...",
    status: "voting",
    createdDate: "2024-03-12",
    amount: 12.0,
  },
];

const DisputeOverviewPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="h-4 w-4" />;
      case "voting":
        return <Clock className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
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

  const filteredDisputes = mockDisputes.filter((dispute) => {
    const matchesSearch =
      dispute.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || dispute.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const groupedDisputes = {
    open: filteredDisputes.filter((d) => d.status === "open"),
    voting: filteredDisputes.filter((d) => d.status === "voting"),
    resolved: filteredDisputes.filter((d) => d.status === "resolved"),
    rejected: filteredDisputes.filter((d) => d.status === "rejected"),
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Dispute Overview
          </h1>
          <p className="text-muted-foreground">
            Manage and track all disputes related to your jobs
          </p>
        </motion.div>

        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-panel mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search disputes or jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
                  />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="voting">Under Voting</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                {/* Date Filter */}
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="week">Last Week</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dispute Sections */}
        <div className="space-y-8">
          {/* Open Disputes */}
          {groupedDisputes.open.length > 0 && (
            <DisputeSection
              title="Open Disputes"
              disputes={groupedDisputes.open}
              icon={<AlertTriangle className="h-5 w-5" />}
              delay={0.2}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
            />
          )}

          {/* Under Voting */}
          {groupedDisputes.voting.length > 0 && (
            <DisputeSection
              title="Under Voting"
              disputes={groupedDisputes.voting}
              icon={<Clock className="h-5 w-5" />}
              delay={0.3}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
            />
          )}

          {/* Resolved */}
          {groupedDisputes.resolved.length > 0 && (
            <DisputeSection
              title="Resolved"
              disputes={groupedDisputes.resolved}
              icon={<CheckCircle className="h-5 w-5" />}
              delay={0.4}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
            />
          )}

          {/* Rejected */}
          {groupedDisputes.rejected.length > 0 && (
            <DisputeSection
              title="Rejected"
              disputes={groupedDisputes.rejected}
              icon={<XCircle className="h-5 w-5" />}
              delay={0.5}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
            />
          )}
        </div>

        {/* Empty State */}
        {filteredDisputes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-panel text-center py-16">
              <CardContent>
                <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2 text-foreground">No Disputes Found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "You don't have any disputes at the moment"}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

interface DisputeSectionProps {
  title: string;
  disputes: Dispute[];
  icon: React.ReactNode;
  delay: number;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
}

const DisputeSection = ({ title, disputes, icon, delay, getStatusIcon, getStatusColor }: DisputeSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="text-primary">{icon}</div>
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        <Badge variant="outline" className="ml-2 bg-background/50">
          {disputes.length}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {disputes.map((dispute, index) => (
          <motion.div
            key={dispute.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + index * 0.05 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="glass-panel h-full hover:shadow-glow hover:border-primary/30 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {dispute.jobTitle}
                  </CardTitle>
                  <div className={`p-1.5 rounded-lg border ${getStatusColor(dispute.status)}`}>
                    {getStatusIcon(dispute.status)}
                  </div>
                </div>
                <CardDescription className="line-clamp-2">{dispute.reason}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(dispute.createdDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>{dispute.amount} SOL</span>
                  </div>
                </div>

                <Badge className={`w-full justify-center ${getStatusColor(dispute.status)}`}>
                  {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                </Badge>

                <Link to={`/disputes/${dispute.id}`}>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary/10 group-hover:border-primary/50 transition-all"
                  >
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DisputeOverviewPage;
