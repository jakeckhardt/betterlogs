'use client'

import { useState } from "react";
import AddButton from "@/app/components/AddButton.js";
import TicketModal from "@/app/components/TicketModal.js";

export default function Board({ board, ticketData }) {

    const [tickets, setTickets] = useState(ticketData);
    const [openModal, setOpenModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState();
    const [selectedTicketIndex, setSelectedTicketIndex] = useState();

    const openModalClick = () => {
        setOpenModal(true);
    };

    const selectTicket = (ticket, index) => {
        setSelectedTicketIndex(index);
        setSelectedTicket(ticket);
        setOpenModal(true);
    };

    const exitModal = () => {
        setOpenModal(false);
        setSelectedTicket();
    };

    const updateTickets = (ifEdit, newTicket) => {
        setOpenModal(false);
        setSelectedTicket();

        // Set up if statement for if the ticket is updated or if it's being added.
        if (ifEdit) {
            setTickets([...tickets.slice(0, selectedTicketIndex), newTicket, ...tickets.slice(selectedTicketIndex + 1)]);
        } else {
            setTickets([...tickets, newTicket]);
        }

        setSelectedTicketIndex();
    };

    return (
        <div className="boardPage">
            <div className="boardsHeader">
                <h1>{board.board_title}</h1>
                <AddButton
                    clickFunction={openModalClick}
                />
            </div>
            <div className="boardContainer">
                {board.categories.map((category) => (
                    <div key={"catContainer" + category} className="category">
                        <div className="header">
                            <h2>{category}</h2>
                        </div>
                        {tickets.map((ticket, index) => (
                            <>
                                {ticket.category === category ? (
                                    <button 
                                        key={"ticket" + ticket.id} 
                                        className="ticket"
                                        onClick={() => selectTicket(ticket, index)}
                                    >
                                        <h3>{ticket.ticket_title}</h3>
                                    </button>
                                ) : (
                                    ""
                                )}
                            </>
                        ))}
                        <div className="ticket emptyTicket">
                        </div>
                    </div>
                ))}
            </div>
            {openModal ? (
                <TicketModal
                    ticket={selectedTicket}
                    boardID={board.id}
                    categories={board.categories}
                    exit={exitModal}
                    update={updateTickets}
                />
            ) : (
                ""
            )}
        </div>
    );
}