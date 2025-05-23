'use client'

import { useState } from "react";
import { getUrl } from "../../helpers/getUrl";
import ButtonIcon from "@/app/components/ButtonIcon/ButtonIcon";
import BoardColumn from "@/app/components/BoardColumn/BoardColumn";
import TicketModal from "@/app/components/TicketModal/TicketModal";
import Cookies from "universal-cookie";
import Link from "next/link";
import styles from "./styles.module.scss";

const cookies = new Cookies(null, { path: '/'});

export default function Board({ boardData, columnsData, ticketData }) {
    const url = getUrl();
    const [board, setBoard] = useState({
        board: boardData,
        columns: columnsData,
        tickets: ticketData 
    });
    const [openModal, setOpenModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState();
    const [draggedTicket, setDraggedTicket] = useState();

    function adjustContainerClass() {
        switch (columnsData.length) {
            case 1:
                return styles.oneCategory;
            case 2:
                return styles.twoCategories;
            case 3:
                return styles.threeCategories;
            case 4:
                return styles.fourCategories;
            default:
                return styles.fiveCategories;
        }
    };

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

        setOpenModal(false);
        setSelectedTicket();
    };

    const handleTicketDragStart = (e, ticket_id) => {
        setDraggedTicket(ticket_id);
    };

    const handleTicketDragOver = (e, column_id, ticket_id) => {
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

    const handleTicketDrop = async (columnId, columnTitle) => {
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
        setDraggedTicket();
    };

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
            <div className={styles.boardHeader}>
                <h1>{board.board.board_title}</h1>
                <div className={styles.boardActionsContainer}>
                    <ButtonIcon
                        clickFunction={openModalClick}
                        icon={"add"}
                    />
                    <ButtonIcon
                        clickFunction={() => {}}
                        icon={"settings"}
                    />
                </div>
            </div>
            <div className={styles.boardContainer}>
                <div className={`${styles.innerBoardContainer} ${adjustContainerClass()}`}>
                    {board.board.columns.map((columnid) => (
                        <BoardColumn 
                            key={`column${columnid}`}
                            column={board.columns.find((column) => column.id === columnid)}
                            tickets={board.tickets}
                            selectTicket={selectTicket}
                            dragStart={handleTicketDragStart}
                            dragOver={handleTicketDragOver}
                            drop={handleTicketDrop}
                            ifDragging={Boolean(draggedTicket)}
                        />
                    ))}
                </div>
            </div>
            {openModal &&
                <TicketModal
                    demo={false}
                    ticket={selectedTicket}
                    board={board.board}
                    exit={exitModal}
                    update={updateBoard}
                />
            }
        </div>
    );
}