import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, TrendingUp, ArrowRight } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-secondary-light">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-3xl mb-8 shadow-xl">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold text-foreground mb-6">
            LeadGlide <span className="text-primary">CRM</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Streamline your sales pipeline with our intuitive prospect management system. 
            Track leads from first contact to closed deals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {user ? (
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link to="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="text-lg px-8 py-3">
                  <Link to="/auth">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
                  <Link to="/auth">
                    Sign In
                  </Link>
                </Button>
              </>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center p-6 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Prospect Management</h3>
              <p className="text-muted-foreground">Add, edit, and organize your prospects with detailed contact information.</p>
            </div>
            
            <div className="text-center p-6 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg">
              <BarChart3 className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Pipeline Tracking</h3>
              <p className="text-muted-foreground">Visual pipeline with three stages: New, In Talks, and Closed deals.</p>
            </div>
            
            <div className="text-center p-6 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg">
              <TrendingUp className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-muted-foreground">Track conversion rates and visualize your sales performance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
