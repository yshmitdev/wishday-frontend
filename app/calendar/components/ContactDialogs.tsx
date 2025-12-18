'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Contact } from '@/hooks/queries/useContacts';
import { useCreateContact, useUpdateContact, useDeleteContact } from '@/hooks/mutations/useContactMutations';
import { UserPlus, Pencil, AlertTriangle, Cake, User, StickyNote } from 'lucide-react';
import { getMaxDays } from '@/lib/dateUtils';

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(2000, i).toLocaleString('default', { month: 'short' }),
}));

const contactSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    month: z.number().min(1).max(12),
    day: z.number().min(1).max(31),
    year: z.string().refine(
        v => !v || (/^\d{4}$/.test(v) && +v >= 1900 && +v <= new Date().getFullYear()),
        'Invalid year'
    ),
    notes: z.string().max(500),
}).refine(
    d => d.day >= 1 && d.day <= getMaxDays(d.month, d.year ? +d.year : undefined),
    { message: 'Invalid date - this day does not exist for the selected month', path: ['day'] }
);

type FormData = z.infer<typeof contactSchema>;

interface ContactDialogsProps {
    contact: Contact | null;
    editOpen: boolean;
    deleteOpen: boolean;
    createOpen: boolean;
    defaultMonth?: number;
    defaultDay?: number;
    onEditOpenChange: (open: boolean) => void;
    onDeleteOpenChange: (open: boolean) => void;
    onCreateOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

const DIALOG_STYLES = {
    create: {
        color: 'emerald', accent: 'teal', Icon: UserPlus,
        title: 'Add Birthday', desc: 'Remember someone special',
        btn: 'Add Birthday', loading: 'Adding...',
    },
    edit: {
        color: 'violet', accent: 'purple', Icon: Pencil,
        title: 'Edit Birthday', btn: 'Save Changes', loading: 'Saving...',
    },
} as const;

export function ContactDialogs({
    contact, editOpen, deleteOpen, createOpen,
    defaultMonth = 1, defaultDay = 1,
    onEditOpenChange, onDeleteOpenChange, onCreateOpenChange, onSuccess,
}: ContactDialogsProps) {
    const createMutation = useCreateContact();
    const updateMutation = useUpdateContact();
    const deleteMutation = useDeleteContact();

    const form = useForm<FormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: { name: '', month: 1, day: 1, year: '', notes: '' },
    });

    const [watchedMonth, watchedYear, watchedDay] = form.watch(['month', 'year', 'day']);
    const maxDays = getMaxDays(watchedMonth, watchedYear ? +watchedYear : undefined);

    useEffect(() => {
        if (watchedDay > maxDays) form.setValue('day', maxDays);
    }, [watchedMonth, watchedYear, watchedDay, maxDays, form]);

    useEffect(() => {
        if (createOpen) form.reset({ name: '', month: defaultMonth, day: defaultDay, year: '', notes: '' });
    }, [createOpen, defaultMonth, defaultDay, form]);

    useEffect(() => {
        if (contact && editOpen) {
            form.reset({
                name: contact.name,
                month: contact.birthdayMonth,
                day: contact.birthdayDay,
                year: contact.birthdayYear?.toString() || '',
                notes: contact.notes || '',
            });
        }
    }, [contact, editOpen, form]);

    const toPayload = (d: FormData) => ({
        name: d.name,
        birthdayMonth: d.month,
        birthdayDay: d.day,
        birthdayYear: d.year ? +d.year : null,
        notes: d.notes.trim() || null,
    });

    const handleSubmit = async (mode: 'create' | 'edit', data: FormData) => {
        if (mode === 'create') {
            await createMutation.mutateAsync(toPayload(data));
            onCreateOpenChange(false);
        } else if (contact) {
            await updateMutation.mutateAsync({ id: contact.id, data: toPayload(data) });
            onEditOpenChange(false);
        }
        onSuccess?.();
    };

    const handleDelete = async () => {
        if (!contact) return;
        await deleteMutation.mutateAsync(contact.id);
        onDeleteOpenChange(false);
        onSuccess?.();
    };

    const renderFormDialog = (
        mode: 'create' | 'edit',
        open: boolean,
        onOpenChange: (o: boolean) => void,
        isPending: boolean
    ) => {
        const { color, accent, Icon, title, btn, loading } = DIALOG_STYLES[mode];
        const desc = mode === 'edit' ? `Update details for ${contact?.name || ''}` : DIALOG_STYLES.create.desc;

        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-md border-0 shadow-2xl">
                    <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-${color}-500/10 via-${accent}-500/10 to-cyan-500/10 rounded-t-lg`} />
                    <DialogHeader className="relative pt-2">
                        <div className="flex items-center gap-3">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-${color}-500 to-${accent}-600 text-white shadow-lg shadow-${color}-500/25`}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl">{title}</DialogTitle>
                                <DialogDescription>{desc}</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(d => handleSubmit(mode, d))} className="space-y-5 py-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter their name..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Cake className="h-4 w-4 text-muted-foreground" />Birthday Date
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <FormField control={form.control} name="month" render={({ field }) => (
                                        <FormItem>
                                            <Select value={field.value.toString()} onValueChange={v => field.onChange(+v)}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {MONTHS.map(m => (
                                                        <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-xs text-muted-foreground text-center">Month</p>
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="day" render={({ field }) => (
                                        <FormItem>
                                            <Select value={field.value.toString()} onValueChange={v => field.onChange(+v)}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Array.from({ length: maxDays }, (_, i) => (
                                                        <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-xs text-muted-foreground text-center">Day</p>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="year" render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input type="number" placeholder="YYYY" min="1900" max={new Date().getFullYear()} {...field} />
                                            </FormControl>
                                            <p className="text-xs text-muted-foreground text-center">Year (optional)</p>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            </div>

                            <FormField control={form.control} name="notes" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <StickyNote className="h-4 w-4 text-muted-foreground" />Notes
                                        <span className="text-xs text-muted-foreground font-normal">(optional)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea rows={3} placeholder="Tastes, preferences, hobbies, gift ideas..." className="resize-none" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <DialogFooter className="gap-2 pt-2">
                                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isPending || !form.formState.isValid}
                                    className={`bg-gradient-to-r from-${color}-500 to-${accent}-600 hover:from-${color}-600 hover:to-${accent}-700 text-white shadow-lg shadow-${color}-500/25`}
                                >
                                    {isPending ? loading : btn}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        );
    };

    return (
        <>
            {renderFormDialog('create', createOpen, onCreateOpenChange, createMutation.isPending)}
            {contact && renderFormDialog('edit', editOpen, onEditOpenChange, updateMutation.isPending)}

            {contact && (
                <Dialog open={deleteOpen} onOpenChange={onDeleteOpenChange}>
                    <DialogContent className="sm:max-w-md border-0 shadow-2xl">
                        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-red-500/10 via-rose-500/10 to-pink-500/10 rounded-t-lg" />
                        <DialogHeader className="relative pt-2">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/25">
                                    <AlertTriangle className="h-5 w-5" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl">Remove Birthday</DialogTitle>
                                    <DialogDescription>This action cannot be undone</DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                        <div className="py-6">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-lg font-bold text-white shadow-md flex-shrink-0">
                                    {contact.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">{contact.name}</p>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                        {new Date(2000, contact.birthdayMonth - 1, contact.birthdayDay).toLocaleDateString('default', { month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => onDeleteOpenChange(false)}>
                                Keep Birthday
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={deleteMutation.isPending}
                                className="shadow-lg shadow-red-500/25"
                            >
                                {deleteMutation.isPending ? 'Removing...' : 'Yes, Remove'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
