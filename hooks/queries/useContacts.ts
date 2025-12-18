import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/lib/api';

export type Contact = {
    id: string;
    name: string;
    birthdayYear?: number;
    birthdayMonth: number;
    birthdayDay: number;
    notes?: string | null;
};

export const useContacts = () => {
    const api = useApi();

    return useQuery({
        queryKey: ['contacts'],
        queryFn: async () => {
            return api.get<Contact[]>('/api/contacts');
        },
    });
};
