'use client';

import { useState } from 'react';
import Calendar, { type CalendarProps } from 'react-calendar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useContacts } from "@/hooks/queries/useContacts";
import type { Contact } from "@/hooks/queries/useContacts";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, User } from 'lucide-react';
import { BirthdaySheet } from './components/BirthdaySheet';
import { ContactDialogs } from './components/ContactDialogs';

function CalendarSkeleton() {
    return (
        <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black p-8">
            <div className="w-full max-w-7xl mx-auto space-y-8">
                <div className="text-center">
                    <Skeleton className="h-10 w-48 mx-auto" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <Card key={i} className="w-full">
                            <CardHeader>
                                <Skeleton className="h-6 w-20" />
                            </CardHeader>
                            <CardContent className="p-4">
                                <Skeleton className="h-48 w-full rounded-lg" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function CalendarPage() {
    const { data: contacts = [], isLoading, error } = useContacts();
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [createDate, setCreateDate] = useState<{ month: number; day: number }>({ month: 1, day: 1 });
    
    const currentYear = new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => {
        return new Date(currentYear, i, 1);
    });

    const handleBirthdayClick = (contact: Contact) => {
        setSelectedContact(contact);
        setSheetOpen(true);
    };

    const handleEdit = (contact: Contact) => {
        setSelectedContact(contact);
        setEditDialogOpen(true);
    };

    const handleDelete = (contact: Contact) => {
        setSelectedContact(contact);
        setDeleteDialogOpen(true);
    };

    const handleAddContact = (date: Date) => {
        setCreateDate({ month: date.getMonth() + 1, day: date.getDate() });
        setCreateDialogOpen(true);
    };

    const handleDialogSuccess = () => {
        setSheetOpen(false);
    };

    const getContactsForDate = (date: Date) => {
        return contacts.filter(c => c.birthdayMonth === date.getMonth() + 1 && c.birthdayDay === date.getDate());
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
                            className={`absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center rounded-md cursor-pointer transition-colors
                                ${hasBirthdays 
                                    ? 'bg-blue-900 hover:bg-blue-700 text-white' 
                                    : 'hover:bg-zinc-200 dark:hover:bg-zinc-800'
                                }
                                ${isToday && hasBirthdays 
                                    ? 'ring-2 ring-emerald-400 ring-offset-1' 
                                    : isToday 
                                        ? 'bg-emerald-500 dark:bg-emerald-600 text-white font-semibold' 
                                        : ''
                                }
                            `}
                        >
                            {date.getDate()}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="min-w-[160px]">
                        {dayContacts.map((contact) => (
                            <DropdownMenuItem 
                                key={contact.id}
                                onClick={() => handleBirthdayClick(contact)}
                                className="cursor-pointer gap-2"
                            >
                                <User className="h-4 w-4 text-blue-500" />
                                <span>{contact.name}</span>
                            </DropdownMenuItem>
                        ))}
                        {dayContacts.length > 0 && <DropdownMenuSeparator />}
                        <DropdownMenuItem 
                            onClick={() => handleAddContact(date)}
                            className="cursor-pointer gap-2 text-emerald-600 dark:text-emerald-400"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add birthday</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
        return null;
    };

    if (isLoading) {
        return <CalendarSkeleton />;
    }

    return (
        <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black p-8">
            <div className="w-full max-w-7xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Calendar {currentYear}
                    </h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {months.map((month, index) => (
                        <Card key={index} className="w-full">
                            <CardHeader>
                                <CardTitle>{month.toLocaleString('default', { month: 'long' })}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <Calendar
                                    value={month}
                                    activeStartDate={month}
                                    view="month"
                                    tileContent={customTileContent}
                                    tileClassName='relative p-2'
                                    className='[&_.react-calendar\_\_navigation]:hidden'
                                />
                            </CardContent>
                        </Card>
                    ))}
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
        </div>
    );
}

