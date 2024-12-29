export interface board {
    id: number,
    user_id: number,
    board_title: string,
    date_created: Date,
    updated_last: Date,
    categories: string[],
    columns: (number | null)[]
};

export interface column {
    id: number,
    board_id: number,
    column_title: string,
    tickets: number[]
};

export interface user {
    id: number,
    firstname: string,
    lastname: string,
    email: string,
    password: string
};
