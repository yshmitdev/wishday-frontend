'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Contact } from '@/hooks/queries/useContacts';
import { useCreateContact, useUpdateContact, useDeleteContact } from '@/hooks/mutations/useContactMutations';

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

export function ContactDialogs({
    contact,
    editOpen,
    deleteOpen,
    createOpen,
    defaultMonth = 1,
    defaultDay = 1,
    onEditOpenChange,
    onDeleteOpenChange,
    onCreateOpenChange,
    onSuccess,
}: ContactDialogsProps) {
    const createContact = useCreateContact();
    const updateContact = useUpdateContact();
    const deleteContact = useDeleteContact();

    const [name, setName] = useState('');
    const [month, setMonth] = useState(1);
    const [day, setDay] = useState(1);
    const [year, setYear] = useState<string>('');

    // Reset form when contact changes or edit dialog opens
    useEffect(() => {
        if (contact && editOpen) {
            setName(contact.name);
            setMonth(contact.birthdayMonth);
            setDay(contact.birthdayDay);
            setYear(contact.birthdayYear?.toString() || '');
        }
    }, [contact, editOpen]);

    // Reset form when create dialog opens with default date
    useEffect(() => {
        if (createOpen) {
            setName('');
            setMonth(defaultMonth);
            setDay(defaultDay);
            setYear('');
        }
    }, [createOpen, defaultMonth, defaultDay]);

    const handleCreate = async () => {
        if (!name.trim()) return;

        await createContact.mutateAsync({
            name,
            birthdayMonth: month,
            birthdayDay: day,
            birthdayYear: year ? parseInt(year) : null,
        });

        onCreateOpenChange(false);
        onSuccess?.();
    };

    const handleEdit = async () => {
        if (!contact) return;

        await updateContact.mutateAsync({
            id: contact.id,
            data: {
                name,
                birthdayMonth: month,
                birthdayDay: day,
                birthdayYear: year ? parseInt(year) : null,
            },
        });

        onEditOpenChange(false);
        onSuccess?.();
    };

    const handleDelete = async () => {
        if (!contact) return;

        await deleteContact.mutateAsync(contact.id);

        onDeleteOpenChange(false);
        onSuccess?.();
    };

    const renderFormFields = () => (
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Name
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter name..."
                />
            </div>

            <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        Month
                    </label>
                    <select
                        value={month}
                        onChange={(e) => setMonth(parseInt(e.target.value))}
                        className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {new Date(2000, i).toLocaleString('default', { month: 'short' })}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        Day
                    </label>
                    <select
                        value={day}
                        onChange={(e) => setDay(parseInt(e.target.value))}
                        className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {Array.from({ length: 31 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        Year (optional)
                    </label>
                    <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="YYYY"
                        min="1900"
                        max={new Date().getFullYear()}
                        className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Create Dialog */}
            <Dialog open={createOpen} onOpenChange={onCreateOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Contact</DialogTitle>
                        <DialogDescription>
                            Add a new birthday to remember
                        </DialogDescription>
                    </DialogHeader>

                    {renderFormFields()}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => onCreateOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} disabled={createContact.isPending || !name.trim()}>
                            {createContact.isPending ? 'Creating...' : 'Add Contact'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            {contact && (
                <Dialog open={editOpen} onOpenChange={onEditOpenChange}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Contact</DialogTitle>
                            <DialogDescription>
                                Update the birthday information for {contact.name}
                            </DialogDescription>
                        </DialogHeader>

                        {renderFormFields()}

                        <DialogFooter>
                            <Button variant="outline" onClick={() => onEditOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleEdit} disabled={updateContact.isPending || !name.trim()}>
                                {updateContact.isPending ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Delete Dialog */}
            {contact && (
                <Dialog open={deleteOpen} onOpenChange={onDeleteOpenChange}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Contact</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete {contact.name}? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => onDeleteOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDelete} disabled={deleteContact.isPending}>
                                {deleteContact.isPending ? 'Deleting...' : 'Delete'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}

