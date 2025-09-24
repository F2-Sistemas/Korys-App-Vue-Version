import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
    id: string;
    user_id: string;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export const useProfiles = () => {
    const queryClient = useQueryClient();

    const fetchProfiles = async (): Promise<Profile[]> => {
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    };

    const {
        data: profiles,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['profiles'],
        queryFn: fetchProfiles,
    });

    const updateProfileMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Profile> }) => {
            const { error } = await supabase.from('profiles').update(updates).eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profiles'] });
        },
    });

    return {
        profiles,
        isLoading,
        error,
        refetch,
        updateProfile: updateProfileMutation.mutate,
        isUpdating: updateProfileMutation.isPending,
    };
};
