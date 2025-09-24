import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Profile } from '@/composables/useProfiles';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const session = ref<Session | null>(null);
    const profile = ref<Profile | null>(null);
    const loading = ref(true);

    const isAuthenticated = computed(() => !!user.value);

    const initialize = async () => {
        // Set up auth state listener
        supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            loading.value = false;

            if (session?.user) {
                await ensureProfileExists(session.user);
                await fetchProfile(session.user.id);
            } else {
                profile.value = null;
            }
        });

        // Check for existing session
        const {
            data: { session: existingSession },
        } = await supabase.auth.getSession();
        setSession(existingSession);
        setUser(existingSession?.user ?? null);
        loading.value = false;

        if (existingSession?.user) {
            await ensureProfileExists(existingSession.user);
            await fetchProfile(existingSession.user.id);
        }
    };

    const setSession = (newSession: Session | null) => {
        session.value = newSession;
    };

    const setUser = (newUser: User | null) => {
        user.value = newUser;
    };

    const ensureProfileExists = async (user: User) => {
        try {
            const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle();

            if (error) {
                console.error('Error checking profile:', error);
                return;
            }

            if (!data) {
                const name = (user.user_metadata as any)?.name || user.email?.split('@')[0] || 'Usuário';
                const email = user.email || `${user.id}@example.com`;
                const { error: insertError } = await supabase
                    .from('profiles')
                    .insert({ user_id: user.id, name, email });

                if (insertError) {
                    console.error('Error creating profile:', insertError);
                }
            }
        } catch (e) {
            console.error('ensureProfileExists error:', e);
        }
    };

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle();

            if (error) {
                console.error('Error fetching profile:', error);
                return;
            }

            profile.value = data;
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { error };
    };

    const signUp = async (email: string, password: string, name: string) => {
        const redirectUrl = `${window.location.origin}/`;

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: redirectUrl,
                data: {
                    name: name,
                },
            },
        });

        return { error };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const updateProfile = async (updates: Partial<Profile>) => {
        if (!user.value) throw new Error('No user logged in');

        const { error } = await supabase.from('profiles').update(updates).eq('user_id', user.value.id);

        if (error) throw error;

        // Refresh profile
        await fetchProfile(user.value.id);
    };

    const changePassword = async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        return { error };
    };

    return {
        user,
        session,
        profile,
        loading,
        isAuthenticated,
        initialize,
        signIn,
        signUp,
        signOut,
        updateProfile,
        changePassword,
    };
});
