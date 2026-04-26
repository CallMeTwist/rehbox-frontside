import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/features/shared/utils/api';

interface Props {
  exercise: { id: number | string; title: string } | null;
  onClose: () => void;
}

const MarkDoneSheet = ({ exercise, onClose }: Props) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      api
        .post(`/client/exercises/${exercise?.id}/log-completion`)
        .then((r) => r.data),
    onSuccess: () => {
      toast.success('Logged! 💪');
      queryClient.invalidateQueries({ queryKey: ['client-plan'] });
      onClose();
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Could not log completion';
      toast.error(message);
    },
  });

  if (!exercise) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 animate-in fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-card rounded-t-3xl p-6 pb-8 shadow-xl animate-slide-up"
      >
        <div className="flex justify-center mb-4">
          <div className="w-12 h-1.5 bg-muted rounded-full" />
        </div>

        <h2 className="font-display font-bold text-xl text-center mb-1">
          {exercise.title}
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Completed your set?
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={mutation.isPending}
            className="flex-1 rounded-xl border border-border bg-muted/40 py-3 font-semibold text-sm hover:bg-muted disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="flex-1 gradient-primary text-white rounded-xl py-3 font-semibold text-sm shadow-primary hover:opacity-90 disabled:opacity-60"
          >
            {mutation.isPending ? 'Saving…' : 'Mark Done'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkDoneSheet;
