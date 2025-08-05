import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export type PipelineStage = 'new' | 'in_talks' | 'closed';

export interface Prospect {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  stage: PipelineStage;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export function useProspects() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch prospects
  const fetchProspects = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProspects(data || []);
    } catch (error) {
      console.error('Error fetching prospects:', error);
      toast({
        title: "Error",
        description: "Failed to fetch prospects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add prospect
  const addProspect = async (prospectData: Omit<Prospect, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('prospects')
        .insert([{
          ...prospectData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      setProspects(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Prospect added successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error adding prospect:', error);
      toast({
        title: "Error",
        description: "Failed to add prospect",
        variant: "destructive",
      });
    }
  };

  // Update prospect
  const updateProspect = async (id: string, updates: Partial<Prospect>) => {
    try {
      const { data, error } = await supabase
        .from('prospects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setProspects(prev => prev.map(p => p.id === id ? data : p));
      toast({
        title: "Success",
        description: "Prospect updated successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating prospect:', error);
      toast({
        title: "Error",
        description: "Failed to update prospect",
        variant: "destructive",
      });
    }
  };

  // Update prospect stage
  const updateProspectStage = async (id: string, stage: PipelineStage) => {
    return updateProspect(id, { stage });
  };

  // Delete prospect
  const deleteProspect = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prospects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProspects(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Success",
        description: "Prospect deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting prospect:', error);
      toast({
        title: "Error",
        description: "Failed to delete prospect",
        variant: "destructive",
      });
    }
  };

  // Get prospects by stage
  const getProspectsByStage = (stage: PipelineStage) => {
    return prospects.filter(p => p.stage === stage);
  };

  // Get pipeline metrics
  const getMetrics = () => {
    const total = prospects.length;
    const newCount = prospects.filter(p => p.stage === 'new').length;
    const talksCount = prospects.filter(p => p.stage === 'in_talks').length;
    const closedCount = prospects.filter(p => p.stage === 'closed').length;
    
    const conversionRate = total > 0 ? Math.round((closedCount / total) * 100) : 0;

    return {
      total,
      new: newCount,
      in_talks: talksCount,
      closed: closedCount,
      conversionRate,
    };
  };

  useEffect(() => {
    fetchProspects();
  }, [user]);

  return {
    prospects,
    loading,
    addProspect,
    updateProspect,
    updateProspectStage,
    deleteProspect,
    getProspectsByStage,
    getMetrics,
    refetch: fetchProspects,
  };
}