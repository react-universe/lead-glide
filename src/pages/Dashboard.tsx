import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProspects, Prospect } from '@/hooks/useProspects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProspectCard from '@/components/ProspectCard';
import ProspectForm from '@/components/ProspectForm';
import MetricsDashboard from '@/components/MetricsDashboard';
import { Plus, Users, LogOut, BarChart3, Kanban, User } from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { 
    prospects, 
    loading, 
    addProspect, 
    updateProspect, 
    updateProspectStage, 
    deleteProspect,
    getProspectsByStage,
    getMetrics 
  } = useProspects();
  
  const [showForm, setShowForm] = useState(false);
  const [editingProspect, setEditingProspect] = useState<Prospect | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const handleAddProspect = () => {
    setEditingProspect(null);
    setFormMode('create');
    setShowForm(true);
  };

  const handleEditProspect = (prospect: Prospect) => {
    setEditingProspect(prospect);
    setFormMode('edit');
    setShowForm(true);
  };

  const handleFormSubmit = async (data: Omit<Prospect, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (formMode === 'create') {
      await addProspect(data);
    } else if (editingProspect) {
      await updateProspect(editingProspect.id, data);
    }
  };

  const handleDeleteProspect = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this prospect?')) {
      await deleteProspect(id);
    }
  };

  const metrics = getMetrics();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">LeadGlide CRM</h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Welcome back{user?.email && (
                    <span className="hidden sm:inline">, {user.email}</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
              {/* Mobile: Icon only buttons with tooltips */}
              <div className="sm:hidden">
                <Button 
                  onClick={handleAddProspect} 
                  size="sm" 
                  className="shadow-sm px-2"
                  title="Add Prospect"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="sm:hidden">
                <Link to="/profile">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="px-2"
                    title="Profile"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="sm:hidden">
                <Button 
                  variant="outline" 
                  onClick={signOut}
                  size="sm"
                  className="px-2"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Desktop: Full buttons with text */}
              <div className="hidden sm:flex items-center gap-3">
                <Button onClick={handleAddProspect} className="shadow-sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Prospect
                </Button>
                <Link to="/profile">
                  <Button variant="outline">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                <Button variant="outline" onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="pipeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="pipeline" className="flex items-center gap-2">
              <Kanban className="w-4 h-4" />
              Pipeline
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Metrics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="bg-gradient-to-br from-card to-primary-light/20 border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Prospects</CardTitle>
                  <Users className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{metrics.total}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card to-stage-new-bg border-stage-new/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New</CardTitle>
                  <div className="w-3 h-3 rounded-full bg-stage-new"></div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-stage-new">{metrics.new}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card to-stage-talks-bg border-stage-talks/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Talks</CardTitle>
                  <div className="w-3 h-3 rounded-full bg-stage-talks"></div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-stage-talks">{metrics.in_talks}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card to-stage-closed-bg border-stage-closed/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Closed</CardTitle>
                  <div className="w-3 h-3 rounded-full bg-stage-closed"></div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-stage-closed">{metrics.closed}</div>
                </CardContent>
              </Card>
            </div>

            {/* Pipeline Board */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* New Prospects */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-stage-new"></div>
                  <h3 className="font-semibold text-lg">New ({metrics.new})</h3>
                </div>
                <div className="space-y-3">
                  {getProspectsByStage('new').length === 0 ? (
                    <Card className="border-dashed bg-stage-new-bg/30">
                      <CardContent className="flex items-center justify-center py-8">
                        <p className="text-sm text-muted-foreground">No new prospects</p>
                      </CardContent>
                    </Card>
                  ) : (
                    getProspectsByStage('new').map((prospect) => (
                      <ProspectCard
                        key={prospect.id}
                        prospect={prospect}
                        onStageChange={updateProspectStage}
                        onEdit={handleEditProspect}
                        onDelete={handleDeleteProspect}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* In Talks */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-stage-talks"></div>
                  <h3 className="font-semibold text-lg">In Talks ({metrics.in_talks})</h3>
                </div>
                <div className="space-y-3">
                  {getProspectsByStage('in_talks').length === 0 ? (
                    <Card className="border-dashed bg-stage-talks-bg/30">
                      <CardContent className="flex items-center justify-center py-8">
                        <p className="text-sm text-muted-foreground">No prospects in talks</p>
                      </CardContent>
                    </Card>
                  ) : (
                    getProspectsByStage('in_talks').map((prospect) => (
                      <ProspectCard
                        key={prospect.id}
                        prospect={prospect}
                        onStageChange={updateProspectStage}
                        onEdit={handleEditProspect}
                        onDelete={handleDeleteProspect}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Closed */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-stage-closed"></div>
                  <h3 className="font-semibold text-lg">Closed ({metrics.closed})</h3>
                </div>
                <div className="space-y-3">
                  {getProspectsByStage('closed').length === 0 ? (
                    <Card className="border-dashed bg-stage-closed-bg/30">
                      <CardContent className="flex items-center justify-center py-8">
                        <p className="text-sm text-muted-foreground">No closed prospects</p>
                      </CardContent>
                    </Card>
                  ) : (
                    getProspectsByStage('closed').map((prospect) => (
                      <ProspectCard
                        key={prospect.id}
                        prospect={prospect}
                        onStageChange={updateProspectStage}
                        onEdit={handleEditProspect}
                        onDelete={handleDeleteProspect}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metrics">
            <MetricsDashboard metrics={metrics} prospects={prospects} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Prospect Form Modal */}
      <ProspectForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleFormSubmit}
        prospect={editingProspect}
        mode={formMode}
      />
    </div>
  );
};

export default Dashboard;