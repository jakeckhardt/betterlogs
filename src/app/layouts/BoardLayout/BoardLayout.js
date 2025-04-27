'use client'

import { useState, useEffect } from "react";
import { getUrl } from "../../helpers/getUrl";
import ButtonIcon from "@/app/components/ButtonIcon/ButtonIcon";
import BoardColumn from "@/app/components/BoardColumn/BoardColumn";
import TicketModal from "@/app/components/TicketModal/TicketModal";
import Cookies from "universal-cookie";
import Link from "next/link";
import styles from "./styles.module.scss";

const cookies = new Cookies(null, { path: '/'});

export default function Board({ demo, boardData, columnsData, ticketData }) {
    const url = getUrl();
    const [board, setBoard] = useState({
        board: boardData,
        columns: columnsData,
        tickets: ticketData 
    });
    const [openModal, setOpenModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState();
    const [draggedTicket, setDraggedTicket] = useState();
    const [loading, setLoading] = useState(demo);

    const openModalClick = () => {
        setOpenModal(true);
    };

    const selectTicket = (ticket) => {
        setSelectedTicket(ticket);
        setOpenModal(true);
    };

    const exitModal = () => {
        setOpenModal(false);
        setSelectedTicket();
    };

    const updateBoard = (newData) => {
        const { newColumns, newTickets } = newData;

        setBoard({
            ...board,
            columns: newColumns,
            tickets: newTickets
        });

        const sessionLogs = JSON.parse(localStorage.getItem("session-logs"));

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
        setSelectedTicket();
    };

    const handleDragStart = (e, ticket_id) => {
        setDraggedTicket(ticket_id);
    };

    const handleDragOver = (e, column_id, ticket_id) => {
        e.preventDefault();
        const columnIndex = board.columns.findIndex((column) => column.id === column_id);

        let hoverColTickets = board.columns[columnIndex].tickets;
        let dragTicketIndex = hoverColTickets.findIndex(function(ticket) {
            return ticket === draggedTicket
        });
        let hoverTicketIndex = hoverColTickets.findIndex(function(ticket) {
            return ticket === ticket_id
        });

        let currCols = board.columns;

        if (dragTicketIndex > -1) {
            const movedTicket = hoverColTickets.splice(dragTicketIndex, 1);
            hoverColTickets.splice(hoverTicketIndex, 0, movedTicket[0]);
        } else {
            const prevColumnIndex = board.columns.findIndex((column) => column.tickets.includes(draggedTicket));
            const prevTicketIndex = board.columns[prevColumnIndex].tickets.findIndex((ticket) => ticket === draggedTicket)
            currCols[prevColumnIndex].tickets.splice(prevTicketIndex, 1);
            hoverColTickets.splice(hoverTicketIndex, 0, draggedTicket);
        };

        currCols[columnIndex].tickets = hoverColTickets;
        const currTickets = board.tickets.map((ticket) => {
            if (ticket.id === draggedTicket) {
                return {
                    ...ticket,
                    column_id: column_id,
                    column_title: board.columns[columnIndex].column_title
                }
            }
            return {
                ...ticket
            }
        });

        setBoard({
            board: board.board,
            columns: currCols,
            tickets: currTickets
        });
    };

    const handleDrop = async (columnId, columnTitle) => {
        
        if (demo) {
            const sessionData = JSON.parse(localStorage.getItem("session-logs"));
            console.log(board);
            const updatedData = {
                data: {
                    boards: [
                        ...sessionData.data.boards
                    ],
                    columns: sessionData.data.columns.map((column) => {
                        if (board.columns.find((col) => col.id === column.id)) {
                            const boardColumn = board.columns.find((col) => col.id === column.id);
                            return {
                                ...boardColumn
                            }
                        }
                        return column;
                    }),
                    tickets: sessionData.data.tickets.map((ticket) => {
                        if (board.tickets.find((t) => t.id === ticket.id)) {
                            const boardTicket = board.tickets.find((t) => t.id === ticket.id);
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
        } else {
            const session = cookies.get('session');
            const draggedTicketData = board.tickets.find((ticket) => ticket.id === draggedTicket);
            const columnIndexes = board.columns.find((column) => column.id === columnId).tickets;

            const updatedTicket = {
                board_id: draggedTicketData.board_id,
                column_id: columnId,
                ticket_id: draggedTicketData.id,
                ticket_title: draggedTicketData.ticket_title,
                column_title: columnTitle,
                description: draggedTicketData.description,
                links: draggedTicketData.links,
                column_change: true,
                column_indexes: columnIndexes
            };
    
            const request = {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': session
                },
                body: JSON.stringify(updatedTicket)
            };
    
            await fetch(`${url}/api/update-ticket`, request);
        }

        setDraggedTicket();
    };

    useEffect(() => {
        if (demo) {
            const sessionLogs = JSON.parse(localStorage.getItem("session-logs"));
            if (sessionLogs) {
                setBoard({
                    board: sessionLogs.data.boards.find((b) => b.id === Number(boardData.id)),
                    columns: sessionLogs.data.columns.filter((c) => c.board_id === Number(boardData.id)),
                    tickets: sessionLogs.data.tickets.filter((t) => t.board_id === Number(boardData.id))
                });
            }
            setLoading(false);
        }
    }, [demo]);

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
            {!loading && (
                <>
                    <div className={styles.boardsHeader}>
                        <h1>{board.board.board_title}</h1>
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
                        {board.board.columns.map((columnid) => (
                            <BoardColumn 
                                key={`column${columnid}`}
                                column={board.columns.find((column) => column.id === columnid)}
                                tickets={board.tickets}
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
                            demo={demo}
                            ticket={selectedTicket}
                            board={board.board}
                            exit={exitModal}
                            update={updateBoard}
                        />
                    }
                </>
            )}
        </div>
    );
}