import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import JobListingPage from "./pages/JobListingPage";
import JobDetailPage from "./pages/JobDetailPage";
import JobProposalPage from "./pages/JobProposalPage";
import ManageJobsPage from "./pages/ManageJobsPage";
import ProposalManagementPage from "./pages/ProposalManagementPage";
import CreateJobPage from "./pages/CreateJobPage";
import DisputeOverviewPage from "./pages/DisputeOverviewPage";
import DisputeDetailPage from "./pages/DisputeDetailPage";
import RaiseDisputePage from "./pages/RaiseDisputePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/jobs" element={<JobListingPage />} />
          <Route path="/jobs/create" element={<CreateJobPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />
          <Route path="/jobs/:jobId/apply" element={<JobProposalPage />} />
          <Route path="/manage-jobs" element={<ManageJobsPage />} />
          <Route path="/proposals" element={<ProposalManagementPage />} />
          <Route path="/disputes" element={<DisputeOverviewPage />} />
          <Route path="/disputes/:disputeId" element={<DisputeDetailPage />} />
          <Route path="/disputes/raise" element={<RaiseDisputePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
