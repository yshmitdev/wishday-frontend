'use client';

import { useUser } from '@clerk/nextjs';
import { useUserSync } from '@/hooks/mutations/useUserSync';
import { useEffect, useRef } from 'react';

export function UserSync() {
    const { user, isLoaded } = useUser();
    const { mutate: syncUser } = useUserSync();
    const hasSynced = useRef(false);

    useEffect(() => {
        if (isLoaded && user && !hasSynced.current) {
            hasSynced.current = true;
            syncUser(undefined, {
                onSuccess: () => console.log('User synced with backend'),
                onError: (err) => {
                    console.error('Error syncing user:', err);
                    hasSynced.current = false;
                }
            });
        }
    }, [isLoaded, user, syncUser]);

    return null;
}
