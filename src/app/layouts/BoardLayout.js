'use client'

import { useState } from "react";
import { getUrl } from "../helpers/getUrl";
import ButtonIcon from "@/app/components/ButtonIcon.js";
import BoardColumn from "@/app/components/BoardColumn.js";
import TicketModal from "@/app/components/TicketModal.js";
import Cookies from "universal-cookie";

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

    const handleDragStart = (e, ticket_id) => {
        // let elem = document.createElement("div");
        // elem.id = "customGhost";
        // document.body.appendChild(elem);

        // e.dataTransfer.setDragImage(elem, 0, 0);
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

        setBoard({
            board: board.board,
            columns: currCols,
            tickets: board.tickets
        });
    };

    const handleDrop = async (columnId, columnTitle) => {
        // document.getElementById("customGhost").remove();

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

        const response = await fetch(`${url}/api/update-ticket`, request);
        const { newColumns, newTickets} = await response.json();

        setBoard({
            ...board,
            columns: newColumns.rows,
            tickets: newTickets.rows
        });
        setDraggedTicket();
    };

    return (
        <div className="boardPage">
            <div className="backToBoards">
                <a href="/">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path d="M18.2 273l-17-17 17-17L171.8 85.4l17-17 33.9 33.9-17 17L93.1 232 424 232l24 0 0 48-24 0L93.1 280 205.8 392.6l17 17-33.9 33.9-17-17L18.2 273z"/>
                    </svg>
                    <h4>back to boards</h4>
                </a>
            </div>
            <div className="boardsHeader">
                <h1>{board.board.board_title}</h1>
                <ButtonIcon
                    clickFunction={openModalClick}
                    icon={"add"}
                />
            </div>
            <div className="boardContainer">
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
                    ticket={selectedTicket}
                    board={board.board}
                    exit={exitModal}
                    update={updateBoard}
                />
            }
        </div>
    );
}