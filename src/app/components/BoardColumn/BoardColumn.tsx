'use client'

import { Column, Ticket } from "@/app/helpers/types";
import styles from "./styles.module.scss";

export default function BoardColumn({
    column, 
    tickets, 
    selectTicket,
    dragStart,
    dragOver,
    drop,
    ifDragging
} : {
    column: Column,
    tickets: Ticket[],
    selectTicket: (ticket: Ticket) => void,
    dragStart: (event: React.DragEvent<HTMLButtonElement>, ticketid: number) => void,
    dragOver: (event: (React.DragEvent<HTMLButtonElement> | React.DragEvent<HTMLDivElement>), column_id: number, ticketid?: number) => void,
    drop: (column_id: number, column_title: string) => void,
    ifDragging: boolean
}) {
    return (
        <div 
            className={styles.category}
            onDrop={() => drop(column.id, column.column_title)}
        >
            <div className={styles.header}>
                <h2>{column.column_title}</h2>
            </div>
            {column.tickets.length > 0 ? (
                <>
                    {column.tickets.map((ticketid) => (
                        <button 
                            key={"ticket" + ticketid} 
                            className={`${styles.ticket} ${ifDragging && styles.noBorder}`}
                            draggable="true"
                            onClick={() => {
                                const selectedTicket = tickets.find((ticket) => ticket.id === ticketid);
                                if (selectedTicket) {
                                    selectTicket(selectedTicket);
                                }
                            }}
                            onDragStart={(event) => dragStart(event, ticketid)}
                            onDragOver={(event) => dragOver(event, column.id, ticketid)}
                        >
                            <div className={styles.ticketDragContainer}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M48 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm0 160a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM96 416A48 48 0 1 0 0 416a48 48 0 1 0 96 0zM208 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48 112a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM208 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>
                            </div>
                            <h3>{tickets.find((ticket) => ticket.id === ticketid)?.ticket_title ?? "Untitled Ticket"}</h3>
                        </button>
                    ))}
                </>
            ) : (
                <div 
                    className={`${styles.ticket} ${styles.emptyTicket}`}
                    onDragOver={(e) => dragOver(e, column.id)}
                >
                </div>
            )}
        </div>
    );
}