'use client';

import { useAuth } from '@clerk/nextjs';
import { useContacts } from '@/hooks/queries/useContacts';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

export function BirthdayList() {
    const { isLoaded, isSignedIn } = useAuth();
    const { data: contacts = [], isLoading, error } = useContacts();

    if (!isLoaded || !isSignedIn) {
        return null;
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Upcoming Birthdays</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
                {error && <p className="text-sm text-destructive">{error.message}</p>}

                {!isLoading && !error && contacts.length === 0 && (
                    <p className="text-sm text-muted-foreground">No birthdays found.</p>
                )}

                <ul className="space-y-3">
                    {contacts.map((contact) => (
                        <li key={contact.id} className="flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarFallback>{contact.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{contact.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CalendarIcon className="h-4 w-4" />
                                <span>
                                    {contact.birthdayMonth}/{contact.birthdayDay}
                                    {contact.birthdayYear && `/${contact.birthdayYear}`}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
