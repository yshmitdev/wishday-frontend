import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/lib/api';
import type { Contact } from '@/hooks/queries/useContacts';

export type CreateContactData = {
    name: string;
    birthdayMonth: number;
    birthdayDay: number;
    birthdayYear?: number | null;
};

export type UpdateContactData = {
    name?: string;
    birthdayMonth?: number;
    birthdayDay?: number;
    birthdayYear?: number | null;
};

export const useCreateContact = () => {
    const api = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateContactData) => {
            return api.post<Contact>('/api/contacts', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
        },
    });
};

export const useUpdateContact = () => {
    const api = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateContactData }) => {
            return api.put<Contact>(`/api/contacts/${id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
        },
    });
};

export const useDeleteContact = () => {
    const api = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            return api.delete<void>(`/api/contacts/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
        },
    });
};

