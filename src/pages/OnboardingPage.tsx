import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Building, ArrowRight, CheckCircle } from "lucide-react";

const OnboardingPage = () => {
  const [selectedRole, setSelectedRole] = useState<"freelancer" | "client" | null>(null);
  const navigate = useNavigate();

  const roles = [
    {
      id: "freelancer" as const,
      title: "I'm a Freelancer",
      subtitle: "Ready to offer my skills",
      description: "Join our global network of talented freelancers. Showcase your skills, bid on projects, and get paid in cryptocurrency.",
      icon: User,
      features: [
        "Create your professional profile",
        "Browse and bid on projects", 
        "Secure escrow payments",
        "Build your reputation"
      ],
      gradient: "from-neon-cyan to-neon-purple"
    },
    {
      id: "client" as const,
      title: "I'm a Client", 
      subtitle: "Looking to hire talent",
      description: "Find the perfect freelancer for your project. Post jobs, review proposals, and manage projects with blockchain security.",
      icon: Building,
      features: [
        "Post unlimited projects",
        "Review qualified proposals",
        "Milestone-based payments", 
        "DAO dispute resolution"
      ],
      gradient: "from-neon-purple to-neon-gold"
    }
  ];

  const handleRoleSelect = (role: "freelancer" | "client") => {
    setSelectedRole(role);
    // Add a small delay for visual feedback
    setTimeout(() => {
      navigate(`/dashboard?role=${role}`);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-neon-cyan/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-foreground">Welcome to </span>
            <span className="text-neon bg-gradient-primary bg-clip-text text-transparent">
              WorkSphere
            </span>
          </h1>
          <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
            Choose your path in the future of decentralized freelancing
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`glass-card p-8 hover-lift cursor-pointer transition-all duration-500 group relative overflow-hidden ${
                selectedRole === role.id ? 'border-primary shadow-neon' : ''
              }`}
              onClick={() => handleRoleSelect(role.id)}
            >
              {/* Selection Indicator */}
              {selectedRole === role.id && (
                <div className="absolute top-4 right-4 animate-scale-in">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
              )}

              {/* Role Icon */}
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${role.gradient} p-5 mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto lg:mx-0`}>
                <role.icon className="h-10 w-10 text-white" />
              </div>

              {/* Role Content */}
              <div className="text-center lg:text-left">
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                  {role.title}
                </h2>
                <p className="text-neon-cyan font-medium mb-4">
                  {role.subtitle}
                </p>
                <p className="text-foreground-muted mb-6 leading-relaxed">
                  {role.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {role.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                      <span className="text-foreground-muted">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button 
                  variant="neon" 
                  size="lg" 
                  className="w-full group-hover:scale-105 transition-transform gap-2"
                  disabled={selectedRole === role.id}
                >
                  {selectedRole === role.id ? (
                    <span>Setting up your workspace...</span>
                  ) : (
                    <>
                      <span>Get Started as {role.id === 'freelancer' ? 'Freelancer' : 'Client'}</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>

              {/* Hover Effect Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-foreground-muted">
            You can always switch roles later in your dashboard settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;