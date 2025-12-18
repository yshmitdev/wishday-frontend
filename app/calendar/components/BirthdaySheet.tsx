'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { Contact } from "@/hooks/queries/useContacts";
import { Cake, Pencil, Trash2, User, PartyPopper, Gift, StickyNote } from "lucide-react";
import { format, differenceInYears, differenceInDays } from "date-fns";
import { getEffectiveBirthdayDate } from "@/lib/dateUtils";

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
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // For display, use a leap year (2000) to ensure Feb 29 is valid
    const displayBirthDate = new Date(2000, contact.birthdayMonth - 1, contact.birthdayDay);
    const formattedDate = format(displayBirthDate, "MMMM do");
    
    // For age calculation, use actual birth year if available
    const birthDate = contact.birthdayYear 
        ? new Date(contact.birthdayYear, contact.birthdayMonth - 1, contact.birthdayDay)
        : null;
    const age = birthDate ? differenceInYears(today, birthDate) : null;
    
    // For next birthday, use effective date (Feb 28 for Feb 29 in non-leap years)
    let nextBirthday = getEffectiveBirthdayDate(contact.birthdayMonth, contact.birthdayDay, today.getFullYear());
    if (nextBirthday < todayMidnight) {
        nextBirthday = getEffectiveBirthdayDate(contact.birthdayMonth, contact.birthdayDay, today.getFullYear() + 1);
    }
    const nextBirthdayMidnight = new Date(nextBirthday.getFullYear(), nextBirthday.getMonth(), nextBirthday.getDate());
    const daysUntil = differenceInDays(nextBirthdayMidnight, todayMidnight);
    const isToday = daysUntil === 0;
    const isSoon = daysUntil > 0 && daysUntil <= 7;

    const handleEdit = () => onEdit?.(contact);
    const handleDelete = () => onDelete?.(contact);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-md border-l-0 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950">
                {/* Decorative header background */}
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-br from-rose-500/20 via-violet-500/20 to-amber-500/20 dark:from-rose-500/10 dark:via-violet-500/10 dark:to-amber-500/10" />
                <div className="absolute top-0 left-0 right-0 h-40 backdrop-blur-3xl" />
                
                {/* Floating decorations */}
                {isToday && (
                    <>
                        <span className="absolute top-8 left-8 animate-float text-2xl">🎈</span>
                        <span className="absolute top-12 right-12 animate-float animation-delay-1000 text-xl">🎉</span>
                        <span className="absolute top-20 left-1/4 animate-float animation-delay-2000 text-lg">✨</span>
                    </>
                )}

                <SheetHeader className="relative pb-6 pt-4">
                    <div className="flex flex-col items-center text-center">
                        {/* Avatar with gradient ring */}
                        <div className="relative mb-4">
                            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-rose-500 via-violet-500 to-amber-500 opacity-75 blur-sm" />
                            <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-rose-500 via-violet-500 to-amber-500 p-0.5 shadow-xl">
                                <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-2xl font-bold text-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
                                    {contact.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            {isToday && (
                                <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg dark:bg-zinc-800">
                                    <PartyPopper className="h-4 w-4 text-amber-500" />
                                </div>
                            )}
                        </div>
                        
                        <SheetTitle className="text-2xl font-bold">{contact.name}</SheetTitle>
                        <SheetDescription className="flex items-center gap-1.5 mt-1">
                            <Cake className="h-3.5 w-3.5" />
                            {formattedDate}
                            {contact.birthdayYear && <span>, {contact.birthdayYear}</span>}
                        </SheetDescription>
                    </div>
                </SheetHeader>

                <div className="relative flex-1 py-6 px-4 space-y-4">
                    {/* Birthday countdown - prominent display */}
                    <div className={`relative overflow-hidden rounded-2xl p-6 text-center ${
                        isToday 
                            ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/25' 
                            : isSoon 
                                ? 'bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-lg shadow-rose-500/25'
                                : 'bg-zinc-100 dark:bg-zinc-800/50'
                    }`}>
                        {/* Background decoration */}
                        <div className="absolute -right-8 -top-8 opacity-10">
                            <Gift className="h-32 w-32" />
                        </div>
                        
                        <div className="relative">
                            {isToday ? (
                                <>
                                    <p className="text-4xl mb-2">🎂</p>
                                    <p className="text-2xl font-bold">It&apos;s Today!</p>
                                    <p className="text-sm opacity-90 mt-1">Time to celebrate!</p>
                                </>
                            ) : daysUntil === 1 ? (
                                <>
                                    <p className="text-4xl mb-2">⏰</p>
                                    <p className="text-2xl font-bold">Tomorrow!</p>
                                    <p className="text-sm opacity-90 mt-1">Don&apos;t forget to prepare</p>
                                </>
                            ) : (
                                <>
                                    <p className={`text-4xl font-bold ${!isSoon && 'text-zinc-800 dark:text-zinc-100'}`}>
                                        {daysUntil}
                                    </p>
                                    <p className={`text-sm ${!isSoon && 'text-zinc-600 dark:text-zinc-400'} ${isSoon && 'opacity-90'}`}>
                                        days until birthday
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Info cards */}
                    <div className="grid gap-3">
                        {/* Age card (if birth year known) */}
                        {age !== null && (
                            <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-800/50">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Current Age</p>
                                    <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                                        {age} years old
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Turning age (if birth year known) */}
                        {age !== null && (
                            <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-800/50">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md">
                                    <Cake className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Turning</p>
                                    <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                                        {isToday ? age : age + 1} years old
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Notes card */}
                        {contact.notes && (
                            <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-800/50">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
                                        <StickyNote className="h-4 w-4" />
                                    </div>
                                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Notes & Gift Ideas</p>
                                </div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed">
                                    {contact.notes}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <SheetFooter className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
                    <div className="flex gap-3 w-full">
                        <Button 
                            variant="outline" 
                            className="flex-1 gap-2 h-11 rounded-xl"
                            onClick={handleEdit}
                        >
                            <Pencil className="w-4 h-4" />
                            Edit
                        </Button>
                        <Button 
                            variant="destructive" 
                            className="flex-1 gap-2 h-11 rounded-xl"
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
