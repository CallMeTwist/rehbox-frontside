import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import CreatePlan from './CreatePlan';

const EditPlan = () => {
  const { planId } = useParams<{ planId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['pt-plan', planId],
    queryFn: () => api.get(`/pt/plans/${planId}`).then(r => r.data.plan),
    enabled: !!planId,
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 p-6">
        <div className="h-8 bg-muted rounded-xl w-48" />
        <div className="h-64 bg-muted rounded-2xl" />
      </div>
    );
  }

  return <CreatePlan editPlan={data} />;
};

export default EditPlan;
