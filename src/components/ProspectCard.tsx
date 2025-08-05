import { Prospect, PipelineStage } from '@/hooks/useProspects';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Building, Mail, Phone, MoreVertical, Edit, Trash2, ArrowRight } from 'lucide-react';

interface ProspectCardProps {
  prospect: Prospect;
  onStageChange: (id: string, stage: PipelineStage) => void;
  onEdit: (prospect: Prospect) => void;
  onDelete: (id: string) => void;
}

const stageConfig = {
  new: {
    label: 'New',
    color: 'bg-stage-new text-white',
    nextStage: 'in_talks' as PipelineStage,
    nextLabel: 'Move to In Talks',
  },
  in_talks: {
    label: 'In Talks',
    color: 'bg-stage-talks text-white',
    nextStage: 'closed' as PipelineStage,
    nextLabel: 'Mark as Closed',
  },
  closed: {
    label: 'Closed',
    color: 'bg-stage-closed text-white',
    nextStage: null,
    nextLabel: null,
  },
};

const ProspectCard = ({ prospect, onStageChange, onEdit, onDelete }: ProspectCardProps) => {
  const config = stageConfig[prospect.stage];

  return (
    <Card className="group hover:shadow-md transition-all duration-200 bg-gradient-to-br from-card to-card/50 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {prospect.full_name}
            </h3>
            <Badge className={config.color}>
              {config.label}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(prospect)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(prospect.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Mail className="mr-2 h-4 w-4" />
            <span className="truncate">{prospect.email}</span>
          </div>
          
          {prospect.phone && (
            <div className="flex items-center text-muted-foreground">
              <Phone className="mr-2 h-4 w-4" />
              <span>{prospect.phone}</span>
            </div>
          )}
          
          {prospect.company && (
            <div className="flex items-center text-muted-foreground">
              <Building className="mr-2 h-4 w-4" />
              <span className="truncate">{prospect.company}</span>
            </div>
          )}
        </div>

        {prospect.notes && (
          <div className="p-2 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground line-clamp-2">{prospect.notes}</p>
          </div>
        )}

        {config.nextStage && (
          <Button
            variant="stage"
            size="sm"
            className="w-full mt-3"
            onClick={() => onStageChange(prospect.id, config.nextStage!)}
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            {config.nextLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProspectCard;