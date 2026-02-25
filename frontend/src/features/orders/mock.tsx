import type { OrderRow, StatCardDTO } from "./types";
import {cart, percent, dollar, file} from "@/assets/assets.ts"
import { formatDate } from "@/lib/formatters";

export const stats: StatCardDTO[] = [
    {
        title: "Total Orders",
        value: "2,350",
        deltaText: "↑ +5.4%",
        deltaNote: "+5.41% from last period",
        icon: <img src={cart} alt="" className="size-4 opacity-70" />,
    },
    {
        title: "VAT Collected",
        value: "$7,850.53",
        deltaText: "↑ +6.5%",
        deltaNote: "+6.51% from last period",
        icon: <img src={percent} alt="" className="size-4 opacity-70" />,
    },
    {
        title: "Total Sales",
        value: "$100,850.53",
        deltaText: "↑ +8.2%",
        deltaNote: "+8.23% from last period",
        icon: <img src={dollar} alt="" className="size-4 opacity-70" />,
    },
    {
        title: "Total Imports",
        value: "1,240",
        deltaText: "↑ +3.1%",
        deltaNote: "+3.12% from last period",
        icon: <img src={file} alt="" className="size-4 opacity-70" />,
    },
];

const jurisdictions = [
    "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ",
    "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA"
];

export const orders: OrderRow[] = Array.from({ length: 50 }).map((_, i) => {
    const subtotal = Math.floor(Math.random() * 1000) + 50;
    const taxRate = Math.random() * 15;
    const tax = (subtotal * taxRate) / 100;
    const total = subtotal + tax;
    
    // Generate dates within the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    return {
        id: (1000 + i).toString(),
        date: formatDate(date),
        jurisdiction: jurisdictions[Math.floor(Math.random() * jurisdictions.length)],
        subtotal: parseFloat(subtotal.toFixed(2)),
        taxRate: parseFloat(taxRate.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        longitude: -120 + Math.random() * 50,
        latitude: 30 + Math.random() * 20
    };
});