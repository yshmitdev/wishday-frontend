'use client';
import { useState, useMemo, memo, useCallback, useTransition, useEffect } from "react";
import { MonthCalendar } from "./components/MonthCalendar";
import { BirthdayListView } from "./components/BirthdayListView";
import { Sparkles, Gift, CalendarDays, Cake, Loader2, ChevronLeft, ChevronRight, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "./components/StatCard";
import { Contact, useContacts } from "@/hooks/queries/useContacts";
import { differenceInDays } from "date-fns";
import { getEffectiveBirthdayDate } from "@/lib/dateUtils";
import { BirthdaySheet } from "./components/BirthdaySheet";
import { ContactDialogs } from "./components/ContactDialogs";
import { useIsMobile } from "@/hooks/useIsMobile";

type ViewMode = 'calendar' | 'list';

const MemoizedMonthCalendar = memo(MonthCalendar);

const monthColors = [
    'from-rose-400 to-pink-500',      // Jan
    'from-red-400 to-rose-500',       // Feb
    'from-emerald-400 to-teal-500',   // Mar
    'from-green-400 to-emerald-500',  // Apr
    'from-lime-400 to-green-500',     // May
    'from-yellow-400 to-amber-500',   // Jun
    'from-orange-400 to-amber-500',   // Jul
    'from-amber-400 to-orange-500',   // Aug
    'from-sky-400 to-blue-500',       // Sep
    'from-violet-400 to-purple-500',  // Oct
    'from-purple-400 to-violet-500',  // Nov
    'from-blue-400 to-indigo-500',    // Dec
];

export default function CalendarPage() {
    const { data: contacts = [], isLoading } = useContacts();
    const isMobile = useIsMobile();
    const [viewMode, setViewMode] = useState<ViewMode>('calendar');
    const [hasSetInitialView, setHasSetInitialView] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [createDate, setCreateDate] = useState<{ month: number; day: number }>({ month: 1, day: 1 });
    const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
    const [isPending, startTransition] = useTransition();
    const [isViewPending, startViewTransition] = useTransition();

    // Set default view based on screen size (only on initial load)
    useEffect(() => {
        if (!hasSetInitialView) {
            setViewMode(isMobile ? 'list' : 'calendar');
            setHasSetInitialView(true);
        }
    }, [isMobile, hasSetInitialView]);

    const isListView = viewMode === 'list';

    const changeYear = useCallback((newYear: number | ((prev: number) => number)) => {
        startTransition(() => {
            setDisplayYear(newYear);
        });
    }, []);

    const changeViewMode = useCallback((mode: ViewMode) => {
        startViewTransition(() => {
            setViewMode(mode);
        });
    }, []);

    const currentYear = displayYear;
    const actualCurrentYear = new Date().getFullYear();
    const isViewingCurrentYear = displayYear === actualCurrentYear;
    const today = new Date();
    const months = useMemo(() => Array.from({ length: 12 }, (_, i) => {
        return new Date(currentYear, i, 1);
    }), [currentYear]);

    const handleEdit = useCallback((contact: Contact) => {
        setSelectedContact(contact);
        setEditDialogOpen(true);
    }, []);

    const handleDelete = useCallback((contact: Contact) => {
        setSelectedContact(contact);
        setDeleteDialogOpen(true);
    }, []);

    const handleBirthdayClick = useCallback((contact: Contact) => {
        setSelectedContact(contact);
        setSheetOpen(true);
    }, []);

    const handleDialogSuccess = useCallback(() => {
        setSheetOpen(false);
    }, []);

    const handleAddContactClick = useCallback((date: Date) => {
        setCreateDate({ month: date.getMonth() + 1, day: date.getDate() });
        setCreateDialogOpen(true);
    }, []);

    const handleAddContactClickFromList = useCallback(() => {
        const today = new Date();
        setCreateDate({ month: today.getMonth() + 1, day: today.getDate() });
        setCreateDialogOpen(true);
    }, []);

    // Calculate stats
    const stats = useMemo(() => {
        const upcoming = contacts.filter(c => {
            let nextBirthday = getEffectiveBirthdayDate(c.birthdayMonth, c.birthdayDay, today.getFullYear());
            if (nextBirthday < today) {
                nextBirthday = getEffectiveBirthdayDate(c.birthdayMonth, c.birthdayDay, today.getFullYear() + 1);
            }
            const daysUntil = differenceInDays(nextBirthday, today);
            return daysUntil >= 0 && daysUntil <= 30;
        }).length;

        // For "this month" count, include Feb 29 birthdays in February even in non-leap years
        const thisMonth = contacts.filter(c => {
            if (c.birthdayMonth === today.getMonth() + 1) return true;
            // Feb 29 birthdays count for February in non-leap years
            if (c.birthdayMonth === 2 && c.birthdayDay === 29 && today.getMonth() + 1 === 2) return true;
            return false;
        }).length;

        return {
            total: contacts.length,
            upcoming,
            thisMonth,
        };
    }, [contacts, currentYear, today]);

    if (isLoading) {
        return (
            <div className="relative flex min-h-screen flex-col items-center justify-center">
                {/* Animated background */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-rose-50 to-amber-50 dark:from-violet-950/20 dark:via-rose-950/20 dark:to-amber-950/20" />
                    <div className="absolute top-20 left-10 h-72 w-72 animate-blob rounded-full bg-violet-200/50 mix-blend-multiply blur-3xl filter dark:bg-violet-900/30" />
                    <div className="absolute top-40 right-20 h-72 w-72 animate-blob animation-delay-2000 rounded-full bg-rose-200/50 mix-blend-multiply blur-3xl filter dark:bg-rose-900/30" />
                    <div className="absolute bottom-20 left-1/3 h-72 w-72 animate-blob animation-delay-4000 rounded-full bg-amber-200/50 mix-blend-multiply blur-3xl filter dark:bg-amber-900/30" />
                </div>
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-rose-500" />
                    <p className="text-zinc-600 dark:text-zinc-400 text-lg font-medium">Loading birthdays...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="relative flex min-h-screen flex-col">
                {/* Animated background */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-rose-50 to-amber-50 dark:from-violet-950/20 dark:via-rose-950/20 dark:to-amber-950/20" />
                    <div className="absolute top-20 left-10 h-72 w-72 animate-blob rounded-full bg-violet-200/50 mix-blend-multiply blur-3xl filter dark:bg-violet-900/30" />
                    <div className="absolute top-40 right-20 h-72 w-72 animate-blob animation-delay-2000 rounded-full bg-rose-200/50 mix-blend-multiply blur-3xl filter dark:bg-rose-900/30" />
                    <div className="absolute bottom-20 left-1/3 h-72 w-72 animate-blob animation-delay-4000 rounded-full bg-amber-200/50 mix-blend-multiply blur-3xl filter dark:bg-amber-900/30" />
                </div>

                <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-3">
                            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500/10 to-amber-500/10 px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-400">
                                <Sparkles className="h-4 w-4" />
                                Birthday Calendar
                            </div>
                            {/* View Toggle Button */}
                            <div className="inline-flex items-center rounded-full bg-white/50 dark:bg-zinc-800/50 p-1 shadow-sm">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => changeViewMode('calendar')}
                                    disabled={isViewPending}
                                    className={`rounded-full h-8 w-8 transition-all ${
                                        !isListView 
                                            ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md' 
                                            : 'hover:bg-white/50 dark:hover:bg-zinc-700/50 text-zinc-600 dark:text-zinc-400'
                                    }`}
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => changeViewMode('list')}
                                    disabled={isViewPending}
                                    className={`rounded-full h-8 w-8 transition-all ${
                                        isListView 
                                            ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md' 
                                            : 'hover:bg-white/50 dark:hover:bg-zinc-700/50 text-zinc-600 dark:text-zinc-400'
                                    }`}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        {!isListView && (
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center justify-center gap-3">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => changeYear(y => y - 1)}
                                        disabled={isPending}
                                        className="rounded-full h-10 w-10 bg-white/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 shadow-sm disabled:opacity-50"
                                    >
                                        <ChevronLeft className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                                    </Button>
                                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight min-w-[140px] text-center relative">
                                        <span className={`bg-gradient-to-r from-violet-600 via-rose-600 to-amber-600 bg-clip-text text-transparent dark:from-violet-400 dark:via-rose-400 dark:to-amber-400 transition-opacity ${isPending ? 'opacity-40' : ''}`}>
                                            {currentYear}
                                        </span>
                                        {isPending && (
                                            <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-rose-500" />
                                        )}
                                    </h1>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => changeYear(y => y + 1)}
                                        disabled={isPending}
                                        className="rounded-full h-10 w-10 bg-white/50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 shadow-sm disabled:opacity-50"
                                    >
                                        <ChevronRight className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                                    </Button>
                                </div>
                                {!isViewingCurrentYear && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => changeYear(actualCurrentYear)}
                                        disabled={isPending}
                                        className="rounded-full px-4 h-8 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 text-emerald-600 dark:text-emerald-400 font-medium text-sm animate-in fade-in slide-in-from-top-2 duration-200 disabled:opacity-50"
                                    >
                                        ← Back to {actualCurrentYear}
                                    </Button>
                                )}
                            </div>
                        )}
                        <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                            Keep track of all the special days for the people you love
                        </p>
                    </div>

                    {/* Stats - hidden in list view */}
                    {!isListView && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                            <StatCard
                                icon={Gift}
                                label="Total Birthdays"
                                value={stats.total}
                                color="bg-gradient-to-br from-violet-500/90 to-purple-600/90 text-white shadow-lg shadow-violet-500/25"
                            />
                            <StatCard
                                icon={CalendarDays}
                                label="This Month"
                                value={stats.thisMonth}
                                color="bg-gradient-to-br from-rose-500/90 to-pink-600/90 text-white shadow-lg shadow-rose-500/25"
                            />
                            <StatCard
                                icon={Cake}
                                label="Next 30 Days"
                                value={stats.upcoming}
                                color="bg-gradient-to-br from-amber-500/90 to-orange-600/90 text-white shadow-lg shadow-amber-500/25"
                            />
                        </div>
                    )}

                    {/* List View or Calendar Grid based on viewMode */}
                    {isListView ? (
                        <div className={`max-w-xl mx-auto transition-opacity duration-200 ${isViewPending ? 'opacity-50' : ''}`}>
                            <BirthdayListView
                                contacts={contacts}
                                onBirthdayClick={handleBirthdayClick}
                                onAddContactClick={handleAddContactClickFromList}
                            />
                        </div>
                    ) : (
                        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 transition-opacity duration-200 ${isPending || isViewPending ? 'opacity-50' : ''}`}>
                            {months.map((month) => {
                                return (
                                    <MemoizedMonthCalendar
                                        key={month.getMonth()}
                                        month={month}
                                        monthColor={monthColors[month.getMonth()]}
                                        contacts={contacts}
                                        onBirthdayClick={handleBirthdayClick}
                                        onAddContactClick={handleAddContactClick}
                                    />
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            <BirthdaySheet
                contact={selectedContact}
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <ContactDialogs
                contact={selectedContact}
                editOpen={editDialogOpen}
                deleteOpen={deleteDialogOpen}
                createOpen={createDialogOpen}
                defaultMonth={createDate.month}
                defaultDay={createDate.day}
                onEditOpenChange={setEditDialogOpen}
                onDeleteOpenChange={setDeleteDialogOpen}
                onCreateOpenChange={setCreateDialogOpen}
                onSuccess={handleDialogSuccess}
            />
        </>
    )
}