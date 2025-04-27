export interface Link {
    link_text: string,
    link_url: string
}

export interface Board {
    id: number,
    user_id: number,
    board_title: string,
    date_created: Date,
    updated_last: Date,
    categories: string[],
    columns: number[]
};

export interface Column {
    id: number,
    board_id: number,
    column_title: string,
    tickets: number[]
};

export interface Ticket {
    id: number,
    board_id: number,
    column_id: number,
    ticket_title: string,
    date_created: Date,
    column_title: string,
    links: Link[],
    description: string[]
}

export interface SessionLogs {
    data: {
        boards: Board[],
        columns: Column[],
        tickets: Ticket[]
    }
};

export interface User {
    id: number,
    firstname: string,
    lastname: string,
    email: string,
    password: string
};
