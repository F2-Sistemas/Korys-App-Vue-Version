import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];

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
        mutationFn: async ({
            id,
            updates,
        }: {
            id: string;
            updates: Database['public']['Tables']['profiles']['Update'];
        }) => {
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
