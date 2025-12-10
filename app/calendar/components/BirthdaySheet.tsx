'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { Contact } from "@/hooks/queries/useContacts";
import { Cake, Calendar, Pencil, Trash2, User } from "lucide-react";
import { format, differenceInYears, differenceInDays, setYear } from "date-fns";

interface BirthdaySheetProps {
    contact: Contact | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit?: (contact: Contact) => void;
    onDelete?: (contact: Contact) => void;
}

export function BirthdaySheet({ contact, open, onOpenChange, onEdit, onDelete }: BirthdaySheetProps) {
    if (!contact) return null;

    const today = new Date();
    const birthDate = new Date(contact.birthdayYear || today.getFullYear(), contact.birthdayMonth - 1, contact.birthdayDay);
    const age = contact.birthdayYear ? differenceInYears(today, birthDate) : null;
    
    let nextBirthday = setYear(birthDate, today.getFullYear());
    if (nextBirthday < today) nextBirthday = setYear(birthDate, today.getFullYear() + 1);
    const daysUntil = differenceInDays(nextBirthday, today);
    
    const formattedDate = format(birthDate, "MMMM do");

    const handleEdit = () => onEdit?.(contact);
    const handleDelete = () => onDelete?.(contact);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-semibold shadow-lg">
                            {contact.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <SheetTitle className="text-xl">{contact.name}</SheetTitle>
                            <SheetDescription>Birthday details</SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <div className="flex-1 py-6 space-y-6">
                    {/* Birthday Date */}
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                            <Cake className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Birthday</p>
                            <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                                {formattedDate}
                                {contact.birthdayYear && <span className="text-zinc-500 dark:text-zinc-400">, {contact.birthdayYear}</span>}
                            </p>
                        </div>
                    </div>

                    {/* Age (if birth year is known) */}
                    {age !== null && (
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                                <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Current Age</p>
                                <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                                    {age} years old
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Days Until Next Birthday */}
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Next Birthday</p>
                            <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                                {daysUntil === 0 ? (
                                    <span className="text-emerald-600 dark:text-emerald-400">🎉 Today!</span>
                                ) : daysUntil === 1 ? (
                                    <span className="text-amber-600 dark:text-amber-400">Tomorrow!</span>
                                ) : (
                                    <span>In {daysUntil} days</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <SheetFooter className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
                    <div className="flex gap-3 w-full">
                        <Button 
                            variant="outline" 
                            className="flex-1 gap-2"
                            onClick={handleEdit}
                        >
                            <Pencil className="w-4 h-4" />
                            Edit
                        </Button>
                        <Button 
                            variant="destructive" 
                            className="flex-1 gap-2"
                            onClick={handleDelete}
                        >
                            <Trash2 className="w-4 h-4" />
                            Remove
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

