import React from "react";

export type StatCardDTO = {
    title: string;
    value: string;
    deltaText: string;   // "+5.4%"
    deltaNote: string;   // "+5.41% from last period"
    icon: React.ReactNode;
};

export type OrderRow = {
    id: string;
    date: string;
    jurisdiction: string;
    subtotal: number;
    taxRate: number;
    tax: number;
    total: number;
    longitude: number;
    latitude: number;
};
