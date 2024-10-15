'use client'

import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies(null, { path: '/'});

export default function Board({ board, tickets }) {

    const [createdTickets, setCreatedTickets] = useState(board || []);
    const [openModal, setOpenModal] = useState(false);
    const [formDisabled, setFormDisabled] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(board.categories[0]);
    const [ticketTitle, setTicketTitle] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);
        const session = cookies.get('session');

        const request = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': session
            },
            body: JSON.stringify({
                board_id: board.id,
                title: ticketTitle,
                category: selectedCategory
            })
        };

        const response = await fetch("http://localhost:3000/api/add-ticket", request);
        const data = await response.json();

        if (response.status === 200) {
            // setCreatedBoards([...createdBoards, data.newBoard.rows[0]]);
            setSubmitting(false);
            setOpenModal(false);
        } else if (response.status === 500) {
            setSubmitting(false);
        }  
    };

    useEffect(() => {
        if (!ticketTitle) {
            setFormDisabled(true);
        } else {
            setFormDisabled(false);
        }
    }, [ticketTitle]);

    return (
        <div className="boardPage">
            <div className="boardsHeader">
                <h1>{board.board_title}</h1>
                <button
                    className="addTicket"
                    onClick={() => setOpenModal(true)}
                >
                    <h2>+</h2>
                </button>
            </div>
            <div className="boardContainer">
                {board.categories.map((category) => (
                    <div key={"catContainer" + category} className="category">
                        <div className="header">
                            <h2>{category}</h2>
                        </div>
                        {tickets.map((ticket) => (
                            <>
                                {ticket.category === category ? (
                                    <div key={"ticket" + ticket.id} className="ticket">
                                        <h3>{ticket.ticket_title}</h3>
                                    </div>
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
                <div className="addTicketModal">
                    <form action={handleSubmit}>
                        <button 
                            className="exitModal"
                            onClick={() => setOpenModal(false)}
                        >
                            +
                        </button>
                        <h2>Create Ticket</h2>
                        <div className="createTicketCategories">
                            {board.categories.map((category) => (
                                <>
                                    <input 
                                        type="checkbox" 
                                        name="ticketCategory"
                                        id={"ticketCategory" + category}
                                        checked={selectedCategory === category}
                                        onChange={() => {
                                            setSelectedCategory(category)
                                        }}
                                    />
                                    <label htmlFor={"ticketCategory" + category}>
                                        {category}
                                    </label>
                                </>
                            ))}
                        </div>
                        <div className="ticketLinksContainer">
                            <h3>Links</h3>
                            <div className="addLink">
                                <input 
                                    placeholder="Link Text"
                                />
                                <input 
                                    placeholder="Link URL"
                                />
                                <button>Add</button>
                            </div>
                            <div className="links">
                                <p>No links</p>
                            </div>
                        </div>
                        <div className="ticketTitleContainer">
                            <label htmlFor="ticketTitle">Title</label>
                            <input 
                                name="ticketTitle"
                                id="ticketTitle"
                                value={ticketTitle}
                                onChange={(e) => setTicketTitle(e.target.value)}
                            />
                        </div>
                        <div className="ticketDescriptionContainer">
                            <label htmlFor="ticketDescription">Description</label>
                            <textarea
                                id="ticketDescription"
                            />
                        </div>
                        <button type="submit" disabled={formDisabled}>
                            {submitting ? (
                                "Creating"
                            ) : (
                                "Create"
                            )}
                        </button>
                    </form>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}