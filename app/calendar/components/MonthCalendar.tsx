import { Calendar } from "react-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cake, Plus } from "lucide-react";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenu, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Contact } from "@/hooks/queries/useContacts";
import { isLeapYear } from "@/lib/dateUtils";

interface MonthCalendarProps {
    month: Date;
    monthColor: string;
    contacts: Contact[];
    onBirthdayClick?: (contact: Contact) => void;
    onAddContactClick?: (date: Date) => void;
}

export const MonthCalendar = ({ month, monthColor, contacts, onBirthdayClick, onAddContactClick }: MonthCalendarProps) => {
    const currentYear = month.getFullYear();
    const isCurrentYearLeap = isLeapYear(currentYear);
    
    // Count birthdays for the month, including Feb 29 birthdays shown on Feb 28 in non-leap years
    const monthBirthdays = contacts.filter(c => {
        if (c.birthdayMonth === month.getMonth() + 1) return true;
        // In non-leap years, Feb 29 birthdays are shown in February (on 28th)
        if (!isCurrentYearLeap && c.birthdayMonth === 2 && c.birthdayDay === 29 && month.getMonth() + 1 === 2) return true;
        return false;
    }).length;

    const getContactsForDate = (date: Date) => {
        const dateMonth = date.getMonth() + 1;
        const dateDay = date.getDate();
        
        return contacts.filter(c => {
            // Normal matching
            if (c.birthdayMonth === dateMonth && c.birthdayDay === dateDay) return true;
            
            // Special case: Feb 29 birthdays shown on Feb 28 in non-leap years
            if (!isCurrentYearLeap && dateMonth === 2 && dateDay === 28 && c.birthdayMonth === 2 && c.birthdayDay === 29) {
                return true;
            }
            
            return false;
        });
    };

    const handleBirthdayClick = (contact: Contact) => {
        onBirthdayClick?.(contact);
    };

    const handleAddContact = (date: Date) => {
        onAddContactClick?.(date);
    };

    const customTileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view === 'month') {
            const today = new Date();
            const isToday = date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();

            const dayContacts = getContactsForDate(date);
            const hasBirthdays = dayContacts.length > 0;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className={`absolute inset-0 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium
                                ${hasBirthdays
                                    ? 'bg-gradient-to-br from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white shadow-lg shadow-rose-500/25 scale-105'
                                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                                }
                                ${isToday && !hasBirthdays
                                    ? 'ring-[3px] ring-emerald-500 dark:ring-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-bold'
                                    : ''
                                }
                                ${isToday && hasBirthdays
                                    ? 'ring-[3px] ring-emerald-400 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 animate-pulse'
                                    : ''
                                }
                            `}
                        >
                            <span className="relative">
                                {date.getDate()}
                                {hasBirthdays && (
                                    <span className="absolute -top-1 -right-2 text-[8px]">🎂</span>
                                )}
                            </span>
                            {/* Today dot indicator - shows when today has no birthdays */}
                            {isToday && !hasBirthdays && (
                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                            )}
                            {/* Today corner indicator - shows when today has birthdays */}
                            {isToday && hasBirthdays && (
                                <span className="absolute top-0 left-0 w-0 h-0 border-t-[12px] border-r-[12px] border-t-emerald-400 border-r-transparent rounded-tl-lg" />
                            )}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="min-w-[180px] p-2">
                        {dayContacts.map((contact) => (
                            <DropdownMenuItem
                                key={contact.id}
                                onClick={() => handleBirthdayClick(contact)}
                                className="cursor-pointer gap-3 rounded-lg p-3 focus:bg-rose-50 dark:focus:bg-rose-950/30"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-amber-500 text-xs font-semibold text-white shadow-sm">
                                    {contact.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium">{contact.name}</span>
                            </DropdownMenuItem>
                        ))}
                        {dayContacts.length > 0 && <DropdownMenuSeparator className="my-2" />}
                        <DropdownMenuItem
                            onClick={() => handleAddContact(date)}
                            className="cursor-pointer gap-3 rounded-lg p-3 text-emerald-600 focus:bg-emerald-50 dark:text-emerald-400 dark:focus:bg-emerald-950/30"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                                <Plus className="h-4 w-4" />
                            </div>
                            <span className="font-medium">Add birthday</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
        return null;
    };

    return (
        <Card className="group relative overflow-hidden backdrop-blur-sm bg-white/70 dark:bg-zinc-900/70 border-white/50 dark:border-zinc-800/50 shadow-xl shadow-black/5 transition-all hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1">
            {/* Month accent gradient */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${monthColor}`} />

            <CardHeader className="pb-1 pt-3 px-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">
                        {month.toLocaleString('default', { month: 'long' })}
                    </CardTitle>
                    {monthBirthdays > 0 && (
                        <span className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${monthColor} px-2 py-0.5 text-xs font-semibold text-white shadow-sm`}>
                            <Cake className="h-3 w-3" />
                            {monthBirthdays}
                        </span>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-2 pt-0">
                <Calendar
                    value={month}
                    activeStartDate={month}
                    view="month"
                    tileContent={customTileContent}
                    tileClassName='relative p-1 aspect-square'
                    className='calendar-custom [&_.react-calendar\_\_navigation]:hidden'
                />
            </CardContent>
        </Card>
    )
}