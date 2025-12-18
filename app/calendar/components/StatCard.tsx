import { LucideIcon } from "lucide-react";

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    color: string;
}

export const StatCard = ({ icon: Icon, label, value, color }: StatCardProps) => {
    return (
        <div className={`relative overflow-hidden rounded-2xl p-5 ${color} backdrop-blur-sm transition-transform hover:scale-[1.02]`}>
            <div className="absolute -right-4 -top-4 opacity-10">
                <Icon className="h-24 w-24" />
            </div>
            <div className="relative">
                <Icon className="h-6 w-6 mb-2 opacity-80" />
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm opacity-80">{label}</p>
            </div>
        </div>
    );
}