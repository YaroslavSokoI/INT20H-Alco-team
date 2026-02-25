import type { OrderRow, StatCardDTO } from "./types";
import {cart, percent, dollar, file} from "@/assets/assets.ts"


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

export const orders: OrderRow[] = Array.from({ length: 10 }).map((_, i) => ({
    id: String(i + 1),
    date: "Apr 25, 2026",
    jurisdiction: "New York, NY",
    subtotal: 89.00,
    taxRate: 10.23,
    tax: 9.88,
    total: 107.88,
    longitude: -78.86718664,
    latitude: 42.01246326
}));