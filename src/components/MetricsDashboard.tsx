import { Prospect } from '@/hooks/useProspects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Target, Calendar } from 'lucide-react';

interface Metrics {
  total: number;
  new: number;
  in_talks: number;
  closed: number;
  conversionRate: number;
}

interface MetricsDashboardProps {
  metrics: Metrics;
  prospects: Prospect[];
}

const MetricsDashboard = ({ metrics, prospects }: MetricsDashboardProps) => {
  // Prepare data for charts
  const pipelineData = [
    { name: 'New', value: metrics.new, color: 'hsl(var(--stage-new))' },
    { name: 'In Talks', value: metrics.in_talks, color: 'hsl(var(--stage-talks))' },
    { name: 'Closed', value: metrics.closed, color: 'hsl(var(--stage-closed))' },
  ];

  // Get prospects by month for trend analysis
  const getProspectsByMonth = () => {
    const monthlyData: { [key: string]: number } = {};
    
    prospects.forEach(prospect => {
      const date = new Date(prospect.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    return Object.entries(monthlyData)
      .sort()
      .slice(-6) // Last 6 months
      .map(([month, count]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        prospects: count,
      }));
  };

  const monthlyData = getProspectsByMonth();

  // Calculate additional metrics
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const thisMonthProspects = prospects.filter(p => {
    const date = new Date(p.created_at);
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
  }).length;

  const avgProspectsPerMonth = prospects.length > 0 && monthlyData.length > 0 
    ? Math.round(prospects.length / monthlyData.length) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-card to-primary-light/20 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prospects</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{metrics.total}</div>
            <p className="text-xs text-muted-foreground">
              All time prospects
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-accent-light/20 border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{metrics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              New to Closed conversion
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-secondary-light/20 border-secondary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{thisMonthProspects}</div>
            <p className="text-xs text-muted-foreground">
              New prospects added
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-muted/20 border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProspectsPerMonth}</div>
            <p className="text-xs text-muted-foreground">
              Prospects per month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pipeline Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pipelineData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {pipelineData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-muted-foreground">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Bar 
                    dataKey="prospects" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-stage-new-bg rounded-lg border border-stage-new/20">
              <div className="text-2xl font-bold text-stage-new mb-1">{metrics.new}</div>
              <div className="text-sm text-muted-foreground">New Prospects</div>
              <div className="text-xs text-muted-foreground mt-1">
                {metrics.total > 0 ? Math.round((metrics.new / metrics.total) * 100) : 0}% of total
              </div>
            </div>
            
            <div className="text-center p-4 bg-stage-talks-bg rounded-lg border border-stage-talks/20">
              <div className="text-2xl font-bold text-stage-talks mb-1">{metrics.in_talks}</div>
              <div className="text-sm text-muted-foreground">In Talks</div>
              <div className="text-xs text-muted-foreground mt-1">
                {metrics.total > 0 ? Math.round((metrics.in_talks / metrics.total) * 100) : 0}% of total
              </div>
            </div>
            
            <div className="text-center p-4 bg-stage-closed-bg rounded-lg border border-stage-closed/20">
              <div className="text-2xl font-bold text-stage-closed mb-1">{metrics.closed}</div>
              <div className="text-sm text-muted-foreground">Closed Deals</div>
              <div className="text-xs text-muted-foreground mt-1">
                {metrics.total > 0 ? Math.round((metrics.closed / metrics.total) * 100) : 0}% of total
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsDashboard;