'use client'

import { useEffect, useState } from "react";
import ButtonIcon from "./ButtonIcon";
import Cookies from "universal-cookie";

const cookies = new Cookies(null, { path: '/'});

export default function TicketModal({ ticket, board, exit, update }) {
    const [editTicket, setEditTicket] = useState(false);
    const [openAddLink, setOpenAddLink] = useState(false);
    const [ticketLinkText, setTicketLinkText] = useState("");
    const [ticketLinkURL, setTicketLinkURL] = useState("");
    const [ticketDescriptionString, setTicketDescriptionString] = useState("");
    const [formDisabled, setFormDisabled] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        board_id: board.id,
        column_id: board.columns[0],
        ticket_id: undefined,
        ticket_title: "",
        column_title: board.categories[0],
        description: [],
        links: [],
        column_change: false
    });

    const handleColumnChange = (id, title) => {
        setForm({
            ...form,
            column_id: id,
            column_title: title,
            column_change: true
        })
    };

    const toggleAddLink = (e) => {
        e.preventDefault();
        setOpenAddLink(!openAddLink);
    };

    const addLink = (e) => {
        e.preventDefault();
        setForm({
            ...form,
            links: form.links ? [...form.links, {link_text: ticketLinkText, link_url: ticketLinkURL}] : [{link_text: ticketLinkText, link_url: ticketLinkURL}],
        });
        setTicketLinkText("");
        setTicketLinkURL("");
    };

    const configureDescription = (description) => {
        setTicketDescriptionString(description);
        setForm({
            ...form,
            description: description.split(/\r?\n/),
        });
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        const session = cookies.get('session');

        const request = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': session
            },
            body: JSON.stringify({
                id: ticket.id,
                column_id: ticket.column_id,
                board_id: ticket.board_id
            })
        };

        const response = await fetch(`http://localhost:3000/api/delete-ticket`, request);
        const data = await response.json();

        const updatedData = {
            newColumns: data.newColumns.rows,
            newTickets: data.newTickets.rows,
        };

        if (response.status === 200) {
            await update(updatedData);
        } else {
            console.log(response)
        }
    };

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
            body: JSON.stringify(form)
        };

        const response = await fetch(`http://localhost:3000/api/${fetchUrl}`, request);
        const data = await response.json();

        const updatedData = {
            newColumns: data.newColumns.rows,
            newTickets: data.newTickets.rows
        };

        if (response.status === 200) {
            setSubmitting(false);
            await update(updatedData);
        } else {
            console.log(response)
        }
    };

    useEffect(() => {
        if (!form.ticket_title) {
            setFormDisabled(true);
        } else {
            setFormDisabled(false);
        }
    }, [form.ticket_title]);

    useEffect(() => {
        if (editTicket) {
            setForm({
                ...form,
                column_id: ticket.column_id,
                ticket_id: ticket.id,
                ticket_title: ticket.ticket_title,
                column_title: ticket.column_title,
                description: ticket.description,
                links: ticket.links
            });

            setTicketDescriptionString(ticket.description ? ticket.description.join('\n') : "");
        };
    }, [editTicket]);

    return (
        <div className="addModal">
            <div className="innerModal">
                <div className="modalActionsContainer">
                    {ticket && (
                        <>
                            <ButtonIcon
                                clickFunction={handleDelete}
                                icon={"delete"}
                            />
                            <ButtonIcon
                                clickFunction={()=> setEditTicket(!editTicket)}
                                icon={"edit"}
                            />
                        </>
                    )}
                    <ButtonIcon
                        clickFunction={exit}
                        icon={"exit"}
                    />
                </div>
                {ticket && !editTicket ? (
                    <div className="viewTicket">
                        <h2 className="title">{ticket.ticket_title}</h2> 
                        <div className="ticketCategory">
                            <div>
                                <h3>{ticket.column_title}</h3>
                            </div>
                        </div>
                        <div className="ticketLinksContainer">
                            <h3>Links</h3>
                            {ticket.links.length > 0 ? (
                                <>
                                    {ticket.links.map((link) => (
                                        <a 
                                            href={link.link_url}
                                            key={link.link_text + "ticketLink"}
                                        >
                                            <h4>{link.link_text}</h4>
                                        </a>
                                    ))}
                                </>
                            ) : (
                                <div className="links">
                                    <p>No links</p>
                                </div>
                            )}
                        </div>
                        <div className="ticketDescriptionContainer">
                            <h3>Description</h3>
                            {ticket.description.length > 0 ? (
                                <>
                                    {ticket.description.map((text, index) => (
                                        <p key={"description" + index}>{text}</p>
                                    ))}
                                </>
                            ) : (
                                <p>No description</p>
                            )}
                        </div>   
                    </div>
                ) : (
                    <form action={handleSubmit}>
                        <h2 className="title">{ticket ? ("Edit") : ("Create")} Ticket</h2>
                        <div className="ticketTitleContainer">
                            <label htmlFor="ticket_title">Title</label>
                            <input 
                                name="ticket_title"
                                id="ticket_title"
                                value={form.ticket_title}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="createTicketCategories">
                            {board.columns.map((column, index) => (
                                <div key={column + "selectedColumn"}>
                                    <input 
                                        type="checkbox" 
                                        name="column_title"
                                        id={"column_title" + column}
                                        checked={form.column_title === board.categories[index]}
                                        onChange={() => handleColumnChange(column, board.categories[index])}
                                    />
                                    <label htmlFor={"column_title" + column}>
                                        {board.categories[index]}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="ticketLinksContainer">
                            <div className="ticketLinksHeader">
                                <h3>Links</h3>
                                <ButtonIcon
                                    clickFunction={toggleAddLink}
                                    icon={"add"}
                                />
                            </div>
                            {openAddLink ? (
                                <div className="addLink">
                                    <input 
                                        placeholder="Link Text"
                                        value={ticketLinkText}
                                        onChange={(e) => setTicketLinkText(e.target.value)}
                                    />
                                    <input 
                                        placeholder="Link URL"
                                        value={ticketLinkURL}
                                        onChange={(e) => setTicketLinkURL(e.target.value)}
                                    />
                                    <button
                                        onClick={(e) => addLink(e)}
                                    >
                                        Add
                                    </button>
                                </div>
                            ) : (
                                ""
                            )}
                            <div className="links">
                                {form.links.length > 0 ? (
                                    <>
                                        {form.links.map((link) => (
                                            <h4 key={link.link_text + "ticketLink"}>{link.link_text}</h4>
                                        ))}
                                    </>
                                ) : (
                                    <p>No links</p>
                                )}
                            </div>
                        </div>
                        <div className="ticketDescriptionContainer">
                            <label htmlFor="ticketDescription">Description</label>
                            <textarea
                                id="ticketDescription"
                                value={ticketDescriptionString}
                                onChange={(e) => configureDescription(e.target.value)}
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