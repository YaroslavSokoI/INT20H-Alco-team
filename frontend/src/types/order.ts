import React from "react";

export type StatCardDTO = {
    title: string;
    value: string;
    deltaText: string;   // "+5.4%"
    deltaNote: string;   // "+5.41% from last period"
    icon: React.ReactNode;
};

export type OrderRow = {
    id: number;
    uuid: string;
    latitude: number;
    longitude: number;
    subtotal: number;
    timestamp: string;
    compositeTaxRate: number;
    taxAmount: number;
    totalAmount: number;
    stateRate: number;
    countyRate: number;
    cityRate: number;
    specialRates: number;
    city: string;
    county: string;
    state: string;
    postcode: string;
    createdAt: string;
};
