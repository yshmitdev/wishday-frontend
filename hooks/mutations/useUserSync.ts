import { useMutation } from '@tanstack/react-query';
import { useApi } from '@/lib/api';

export const useUserSync = () => {
    const api = useApi();

    return useMutation({
        mutationFn: async () => {
            return api.post('/api/users/sync', {});
        },
    });
};
