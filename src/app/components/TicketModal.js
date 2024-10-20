'use client'

import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies(null, { path: '/'});

export default function TicketModal({ ticket, boardID, categories, exit, update }) {

    const [editTicket, setEditTicket] = useState(false);
    const [ticketTitle, setTicketTitle] = useState("");
    const [ticketCategory, setTicketCategory] = useState(categories[0]);
    const [formDisabled, setFormDisabled] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);
        const fetchUrl = editTicket ? "update-ticket" : "add-ticket";
        const session = cookies.get('session');

        const request = {
            method: editTicket ? 'PUT' : 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': session
            },
            body: JSON.stringify({
                board_id: boardID,
                ticket_id: ticket ? ticket.id : "",
                title: ticketTitle,
                category: ticketCategory
            })
        };

        const response = await fetch(`http://localhost:3000/api/${fetchUrl}`, request);
        const data = await response.json();

        let returnTicket = editTicket ? data.updatedTicket.rows[0] : data.newTicket.rows[0];

        if (response.status === 200) {
            update(editTicket, returnTicket);
            setSubmitting(false);
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

    useEffect(() => {
        if (editTicket) {
            setTicketTitle(ticket.ticket_title);
            setTicketCategory(ticket.category);
        };
    }, [editTicket]);

    return (
        <div className="ticketModal">
            <div className="innerTicketModal">
                <div className="modalActionsContainer">
                    {ticket ? (
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 512 512"
                            onClick={() => setEditTicket(!editTicket)}
                        >
                            <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg>
                    ) : (
                        ""
                    )}
                    <button 
                        className="exitModal"
                        onClick={() => exit()}
                    >
                        +
                    </button>
                </div>
                {ticket && !editTicket ? (
                    <div className="viewTicket">
                        <h2>{ticket.ticket_title}</h2> 
                        <div className="ticketCategory">
                            <div>
                                <h3>{ticket.category}</h3>
                            </div>
                        </div>
                        <div className="ticketLinksContainer">
                            <h3>Links</h3>
                            <div className="links">
                                <p>No links</p>
                            </div>
                        </div>
                        <div className="ticketDescriptionContainer">
                            <h3>Description</h3>
                            <p>No description</p>
                        </div>   
                    </div>
                ) : (
                    <form action={handleSubmit}>
                        <h2>{ticket ? ("Edit") : ("Create")} Ticket</h2>
                        <div className="ticketTitleContainer">
                            <label htmlFor="ticketTitle">Title</label>
                            <input 
                                name="ticketTitle"
                                id="ticketTitle"
                                value={ticketTitle}
                                onChange={(e) => setTicketTitle(e.target.value)}
                            />
                        </div>
                        <div className="createTicketCategories">
                            {categories.map((category) => (
                                <>
                                    <input 
                                        type="checkbox" 
                                        name="ticketCategory"
                                        id={"ticketCategory" + category}
                                        checked={ticketCategory === category}
                                        onChange={() => {
                                            setTicketCategory(category)
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
                        <div className="ticketDescriptionContainer">
                            <label htmlFor="ticketDescription">Description</label>
                            <textarea
                                id="ticketDescription"
                            />
                        </div>
                        <button type="submit" disabled={formDisabled}>
                            {ticket ? (
                                <>
                                    {submitting ? (
                                        "Saving"
                                    ) : (
                                        "Save"
                                    )}
                                </>
                            ) : (
                                <>
                                    {submitting ? (
                                        "Creating"
                                    ) : (
                                        "Create"
                                    )}
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}