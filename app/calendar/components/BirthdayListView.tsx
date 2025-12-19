'use client';

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cake, Plus, PartyPopper, Clock, Gift } from "lucide-react";
import { Contact } from "@/hooks/queries/useContacts";
import { differenceInDays, format } from "date-fns";
import { getEffectiveBirthdayDate } from "@/lib/dateUtils";

interface BirthdayListViewProps {
    contacts: Contact[];
    onBirthdayClick: (contact: Contact) => void;
    onAddContactClick: () => void;
}

interface BirthdayWithDays extends Contact {
    daysUntil: number;
    nextBirthday: Date;
    isToday: boolean;
    isTomorrow: boolean;
    isSoon: boolean;
}

export function BirthdayListView({ contacts, onBirthdayClick, onAddContactClick }: BirthdayListViewProps) {
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const sortedBirthdays = useMemo(() => {
        return contacts
            .map((contact): BirthdayWithDays => {
                let nextBirthday = getEffectiveBirthdayDate(contact.birthdayMonth, contact.birthdayDay, today.getFullYear());
                if (nextBirthday < todayMidnight) {
                    nextBirthday = getEffectiveBirthdayDate(contact.birthdayMonth, contact.birthdayDay, today.getFullYear() + 1);
                }
                const nextBirthdayMidnight = new Date(nextBirthday.getFullYear(), nextBirthday.getMonth(), nextBirthday.getDate());
                const daysUntil = differenceInDays(nextBirthdayMidnight, todayMidnight);
                
                return {
                    ...contact,
                    daysUntil,
                    nextBirthday,
                    isToday: daysUntil === 0,
                    isTomorrow: daysUntil === 1,
                    isSoon: daysUntil > 0 && daysUntil <= 7,
                };
            })
            .sort((a, b) => a.daysUntil - b.daysUntil);
    }, [contacts, today, todayMidnight]);

    const todayBirthdays = sortedBirthdays.filter(b => b.isToday);
    const upcomingBirthdays = sortedBirthdays.filter(b => !b.isToday);

    const getStatusBadge = (birthday: BirthdayWithDays) => {
        if (birthday.isToday) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm">
                    <PartyPopper className="h-3 w-3" />
                    Today!
                </span>
            );
        }
        if (birthday.isTomorrow) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-sm">
                    <Clock className="h-3 w-3" />
                    Tomorrow
                </span>
            );
        }
        if (birthday.isSoon) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-violet-400 to-purple-500 text-white shadow-sm">
                    <Gift className="h-3 w-3" />
                    {birthday.daysUntil} days
                </span>
            );
        }
        return (
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {birthday.daysUntil} days
            </span>
        );
    };

    const formatBirthdayDate = (contact: Contact) => {
        // Use leap year for display
        const displayDate = new Date(2000, contact.birthdayMonth - 1, contact.birthdayDay);
        return format(displayDate, "MMM d");
    };

    return (
        <div className="space-y-6">
            {/* Add Birthday Button */}
            <Button
                onClick={onAddContactClick}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 font-semibold text-base gap-2"
            >
                <Plus className="h-5 w-5" />
                Add Birthday
            </Button>

            {/* Today's Birthdays */}
            {todayBirthdays.length > 0 && (
                <div className="space-y-3">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                        <span className="text-xl">🎂</span>
                        Today&apos;s Celebrations
                    </h3>
                    <div className="space-y-2">
                        {todayBirthdays.map((birthday) => (
                            <Card
                                key={birthday.id}
                                onClick={() => onBirthdayClick(birthday)}
                                className="group relative overflow-hidden cursor-pointer bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200/50 dark:border-amber-800/50 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-200 active:scale-[0.98]"
                            >
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
                                <div className="flex items-center gap-4 p-4">
                                    {/* Avatar */}
                                    <div className="relative">
                                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-amber-500/25">
                                            {birthday.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="absolute -bottom-1 -right-1 text-lg">🎈</span>
                                    </div>
                                    
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                            {birthday.name}
                                        </h4>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                                            <Cake className="h-3.5 w-3.5" />
                                            {formatBirthdayDate(birthday)}
                                            {birthday.birthdayYear && ` • Turning ${new Date().getFullYear() - birthday.birthdayYear}`}
                                        </p>
                                    </div>

                                    {/* Status */}
                                    {getStatusBadge(birthday)}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Upcoming Birthdays */}
            {upcomingBirthdays.length > 0 && (
                <div className="space-y-3">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                        <span className="text-xl">📅</span>
                        Upcoming Birthdays
                    </h3>
                    <div className="space-y-2">
                        {upcomingBirthdays.map((birthday) => (
                            <Card
                                key={birthday.id}
                                onClick={() => onBirthdayClick(birthday)}
                                className={`group relative overflow-hidden cursor-pointer backdrop-blur-sm bg-white/70 dark:bg-zinc-900/70 border-white/50 dark:border-zinc-800/50 hover:shadow-lg transition-all duration-200 active:scale-[0.98] ${
                                    birthday.isTomorrow 
                                        ? 'border-rose-200/50 dark:border-rose-800/50' 
                                        : birthday.isSoon 
                                            ? 'border-violet-200/50 dark:border-violet-800/50'
                                            : ''
                                }`}
                            >
                                {(birthday.isTomorrow || birthday.isSoon) && (
                                    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${
                                        birthday.isTomorrow 
                                            ? 'from-rose-400 to-pink-500' 
                                            : 'from-violet-400 to-purple-500'
                                    }`} />
                                )}
                                <div className="flex items-center gap-4 p-4">
                                    {/* Avatar */}
                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md ${
                                        birthday.isTomorrow
                                            ? 'bg-gradient-to-br from-rose-400 to-pink-500 shadow-rose-500/25'
                                            : birthday.isSoon
                                                ? 'bg-gradient-to-br from-violet-400 to-purple-500 shadow-violet-500/25'
                                                : 'bg-gradient-to-br from-zinc-400 to-zinc-500 shadow-zinc-500/25'
                                    }`}>
                                        {birthday.name.charAt(0).toUpperCase()}
                                    </div>
                                    
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                            {birthday.name}
                                        </h4>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                                            <Cake className="h-3.5 w-3.5" />
                                            {formatBirthdayDate(birthday)}
                                            {birthday.birthdayYear && ` • ${birthday.birthdayYear}`}
                                        </p>
                                    </div>

                                    {/* Status */}
                                    {getStatusBadge(birthday)}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {contacts.length === 0 && (
                <div className="text-center py-12 space-y-4">
                    <div className="text-6xl">🎂</div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">
                            No birthdays yet
                        </h3>
                        <p className="text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                            Start adding birthdays to never miss celebrating the special days of people you love!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

