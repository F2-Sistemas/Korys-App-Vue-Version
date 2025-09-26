import { createClient } from '@supabase/supabase-js';

import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Detect if we're accessing via network IP (not localhost)
const isNetworkAccess =
    typeof window !== 'undefined' &&
    !window.location.hostname.includes('localhost') &&
    !window.location.hostname.includes('172.17.0.1') &&
    !window.location.hostname.includes('192.168.') &&
    !window.location.hostname.includes('127.0.0.1');

console.log('Supabase configuration:', {
    url: supabaseUrl,
    hasKey: !!supabaseAnonKey,
    keyPrefix: supabaseAnonKey?.substring(0, 20) + '...',
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
    isNetworkAccess,
});

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your_') || supabaseAnonKey.includes('your_')) {
    console.error('Supabase configuration error:', { supabaseUrl, hasKey: !!supabaseAnonKey });
    throw new Error('Missing or invalid Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
    },
    realtime: {
        params: {
            eventsPerSecond: 10,
        },
    },
    global: {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
});

// Test connectivity on initialization
const testSupabaseConnection = async () => {
    try {
        console.log('Testing Supabase connection...');
        const { data, error } = await supabase.from('patient_appointments').select('count').limit(1);

        if (error) {
            console.warn('Supabase connection test failed:', error);
            console.warn('This might indicate missing tables or permissions issues');
            return false;
        } else {
            console.log('Supabase connection test successful');
            return true;
        }
    } catch (err) {
        console.error('Supabase connection test error:', err);
        return false;
    }
};

// Run connection test
if (typeof window !== 'undefined') {
    testSupabaseConnection();
}
