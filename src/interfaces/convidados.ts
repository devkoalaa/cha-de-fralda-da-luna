interface Presente {
    id: string;
    name: string;
    image: string;
    description: string;
    quantity: number;
    quantityPurchased: number;
    createdAt: string;
    deletedAt: string | null;
}

interface PresenteReservado {
    gift: Presente;
    quantity: number;
}

export interface Convidado {
    name: string;
    createdAt: string;
    phone: string;
    acompanhantesAdultos: number;
    acompanhantesCriancas: number;
    selectedGifts: PresenteReservado[];
}  