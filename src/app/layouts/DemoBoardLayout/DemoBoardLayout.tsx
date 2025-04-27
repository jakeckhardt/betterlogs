'use client'

import { useState, useEffect } from "react";
import ButtonIcon from "@/app/components/ButtonIcon/ButtonIcon";
import BoardColumn from "@/app/components/BoardColumn/BoardColumn";
import TicketModal from "@/app/components/TicketModal/TicketModal";
import Toast from "@/app/components/Toast/Toast";
import Link from "next/link";
import type { Board, Column, Ticket, SessionLogs } from "@/app/helpers/types";
import styles from "./styles.module.scss";

interface BoardData {
    board: Board | null;
    columns: Column[];
    tickets: Ticket[];
};

interface UpdateData {
    newColumns: Column[];
    newTickets: Ticket[];
};

export default function Board({ boardID } : { boardID : number}) {
    const [boardData, setBoardData] = useState<BoardData>({
        board: null,
        columns: [],
        tickets: [] 
    });
    const [openModal, setOpenModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket>();
    const [draggedTicket, setDraggedTicket] = useState<number>(-1);
    const [loading, setLoading] = useState(true);
    const [hitMax, setHitMax] = useState(false);

    const openModalClick = () => {
        const sessionLogs = localStorage.getItem("session-logs") ? JSON.parse(localStorage.getItem("session-logs")!) : null;

        if (sessionLogs.data.tickets.length >= 5 && !selectedTicket) {
            setHitMax(true);
            return;
        }
        
        setOpenModal(true);
    };

    const selectTicket = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setOpenModal(true);
    };

    const exitModal = () => {
        setOpenModal(false);
        setSelectedTicket(undefined);
    };

    const updateBoard = (newData: UpdateData) => {
        const { newColumns, newTickets } = newData;
        let sessionLogs = localStorage.getItem("session-logs") ? JSON.parse(localStorage.getItem("session-logs")!) : null;

        setBoardData({
            ...boardData,
            columns: newColumns,
            tickets: newTickets
        });

        localStorage.setItem("session-logs", JSON.stringify({
            data: {
                boards: [
                    ...sessionLogs.data.boards
                ],
                columns: newColumns,
                tickets: newTickets
            }
        }));

        setOpenModal(false);
        setSelectedTicket(undefined);
    };

    const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, ticket_id: number) => {
        setDraggedTicket(ticket_id);
    };

    const handleDragOver = (e: (React.DragEvent<HTMLButtonElement> | React.DragEvent<HTMLDivElement>), column_id: number, ticket_id?: number) => {
        e.preventDefault();
        const columnIndex = boardData.columns.findIndex((column) => column.id === column_id);

        let hoverColTickets = boardData.columns[columnIndex].tickets;
        let dragTicketIndex = hoverColTickets.findIndex(function(ticket) {
            return ticket === draggedTicket
        });
        let hoverTicketIndex = hoverColTickets.findIndex(function(ticket) {
            return ticket === ticket_id
        });

        let currCols = boardData.columns;

        if (dragTicketIndex > -1) {
            const movedTicket = hoverColTickets.splice(dragTicketIndex, 1);
            hoverColTickets.splice(hoverTicketIndex, 0, movedTicket[0]);
        } else {
            const prevColumnIndex = boardData.columns.findIndex((column) => column.tickets.includes(draggedTicket));
            const prevTicketIndex = boardData.columns[prevColumnIndex].tickets.findIndex((ticket) => ticket === draggedTicket)
            currCols[prevColumnIndex].tickets.splice(prevTicketIndex, 1);
            hoverColTickets.splice(hoverTicketIndex, 0, draggedTicket);
        };

        currCols[columnIndex].tickets = hoverColTickets;
        const currTickets = boardData.tickets.map((ticket) => {
            if (ticket.id === draggedTicket) {
                return {
                    ...ticket,
                    column_id: column_id,
                    column_title: boardData.columns[columnIndex].column_title
                }
            }
            return {
                ...ticket
            }
        });

        setBoardData({
            board: boardData.board,
            columns: currCols,
            tickets: currTickets
        });
    };

    const handleDrop = async () => {
        let sessionLogs = localStorage.getItem("session-logs") ? JSON.parse(localStorage.getItem("session-logs")!) : null;

        const updatedData = {
            data: {
                boards: [
                    ...sessionLogs.data.boards
                ],
                columns: sessionLogs.data.columns.map((column: Column) => {
                    if (boardData.columns.find((col) => col.id === column.id)) {
                        const boardColumn = boardData.columns.find((col) => col.id === column.id);
                        return {
                            ...boardColumn
                        }
                    }
                    return column;
                }),
                tickets: sessionLogs.data.tickets.map((ticket: Ticket) => {
                    if (boardData.tickets.find((t) => t.id === ticket.id)) {
                        const boardTicket = boardData.tickets.find((t) => t.id === ticket.id);
                        return {
                            ...boardTicket
                        }
                    }
                    return ticket;
                })
            }
        };

        console.log(updatedData);
        localStorage.setItem("session-logs", JSON.stringify(updatedData));
        
        setDraggedTicket(-1);
    };

    useEffect(() => {
        let sessionLogs = localStorage.getItem("session-logs") ? JSON.parse(localStorage.getItem("session-logs")!) : null;
        if (sessionLogs) {
            setBoardData({
                board: sessionLogs.data.boards.find((b: Board) => b.id === Number(boardID)) || null,
                columns: sessionLogs.data.columns.filter((c: Column) => c.board_id === Number(boardID)),
                tickets: sessionLogs.data.tickets.filter((t: Ticket) => t.board_id === Number(boardID))
            });
        }
        setLoading(false);
    }, [boardID]);

    return (
        <div className={styles.boardPage}>
            <div className={styles.backToBoards}>
                <Link href="/">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path d="M25.4 278.6L2.7 256l22.6-22.6 144-144L192 66.7 237.2 112l-22.6 22.6L125.2 224 416 224l32 0 0 64-32 0-290.7 0 89.4 89.4L237.2 400 192 445.3l-22.6-22.6-144-144z"/>
                    </svg>
                    <h3>Back to boards</h3>
                </Link>
            </div>
            {loading ? (
                <h2>Loading...</h2>
            ) : (
                <>
                    <div className={styles.boardsHeader}>
                        <h1>{boardData.board?.board_title}</h1>
                        <ButtonIcon
                            clickFunction={openModalClick}
                            icon={"add"}
                        />
                        <ButtonIcon
                            clickFunction={() => {}}
                            icon={"settings"}
                        />
                    </div>
                    <div className={styles.boardContainer}>
                        {boardData.board?.columns.map((columnid: number) => (
                            <BoardColumn 
                                key={`column${columnid}`}
                                column={boardData.columns.find((column: Column) => column.id === columnid) as Column}
                                tickets={boardData.tickets}
                                selectTicket={selectTicket}
                                dragStart={handleDragStart}
                                dragOver={handleDragOver}
                                drop={handleDrop}
                                ifDragging={Boolean(draggedTicket)}
                            />
                        ))}
                    </div>
                    {openModal &&
                        <TicketModal
                            demo={true}
                            ticket={selectedTicket}
                            board={boardData.board!}
                            exit={exitModal}
                            update={updateBoard}
                        />
                    }
                    {hitMax && (
                        <Toast 
                            message={"You can only create 5 tickets per board in demo mode."}
                            endFunction={() => setHitMax(false)}
                        />
                    )}
                </>
            )}
        </div>
    );
}