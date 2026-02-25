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
    location: string;
    subtotal: number;
    vat: number;
    total: number;
};