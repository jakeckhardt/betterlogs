'use client'

import { useEffect, useState } from "react";
import ButtonIcon from "../ButtonIcon/ButtonIcon";
import Cookies from "universal-cookie";
import { getUrl } from "../../helpers/getUrl";
import { Board, Column, Ticket, Link }  from "../../helpers/types";
import styles from "./styles.module.scss";

const cookies = new Cookies(null, { path: '/'});

interface FormData {
    board_id: number,
    column_id: number,
    ticket_id?: number | undefined,
    ticket_title: string,
    column_title: string,
    description: string[],
    links: Link[],
    column_change: boolean
}

interface UpdateData {
    newColumns: Column[];
    newTickets: Ticket[];
}

export default function TicketModal({ 
    demo, 
    ticket, 
    board, 
    exit, 
    update 
} : {
    demo: boolean;
    ticket: Ticket | undefined;
    board: Board;
    exit: () => void;
    update: (data: UpdateData) => void;
}) {
    const url = getUrl();

    const [editTicket, setEditTicket] = useState(false);
    const [openAddLink, setOpenAddLink] = useState(false);
    const [ticketLinkText, setTicketLinkText] = useState("");
    const [ticketLinkURL, setTicketLinkURL] = useState("");
    const [ifLinkAddDisabled, setIfLinkAddDisabled] = useState(false);
    const [ticketDescriptionString, setTicketDescriptionString] = useState("");
    const [formDisabled, setFormDisabled] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState<FormData>({
        board_id: board.id,
        column_id: board.columns[0],
        ticket_id: undefined,
        ticket_title: "",
        column_title: board.categories[0],
        description: [],
        links: [],
        column_change: false
    });

    const handleColumnChange = (id: number, title: string) => {
        setForm({
            ...form,
            column_id: id,
            column_title: title,
            column_change: true
        })
    };

    const toggleAddLink = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setOpenAddLink(!openAddLink);
    };

    const addLink = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setForm({
            ...form,
            links: form.links ? [...form.links, { link_text: ticketLinkText, link_url: ticketLinkURL }] : [{ link_text: ticketLinkText, link_url: ticketLinkURL }],
        });
        setTicketLinkText("");
        setTicketLinkURL("");
    };

    const deleteLink = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        e.preventDefault();
        const updatedLinks = form.links;
        updatedLinks.splice(index, 1);

        setForm({
            ...form,
            links: updatedLinks
        });
    };

    const configureDescription = (description: string) => {
        setTicketDescriptionString(description);
        setForm({
            ...form,
            description: description.split(/\r?\n/),
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (demo) {
            const sessionLogs = localStorage.getItem("session-logs") ? JSON.parse(localStorage.getItem("session-logs")!) : null;

            const updatedSessionLogs = {
                newColumns: 
                    sessionLogs.data.columns.map((column: Column) => {
                        if (column.id === ticket!.column_id) {
                            return {
                                ...column,
                                tickets: column.tickets.filter((t) => t !== ticket!.id)
                            }
                        } else {
                            return {
                                ...column
                            }
                        }
                    }),
                newTickets: [
                    ...sessionLogs.data.tickets.filter((t: Ticket) => t.id !== ticket!.id)
                ]
            };

            update(updatedSessionLogs);
        } else {
            const session = cookies.get('session');
    
            const request = {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': session
                },
                body: JSON.stringify({
                    id: ticket!.id,
                    column_id: ticket!.column_id,
                    board_id: ticket!.board_id
                })
            };
    
            const response = await fetch(`${url}/api/delete-ticket`, request);
            const data = await response.json();
    
            const updatedData = {
                newColumns: data.newColumns.rows,
                newTickets: data.newTickets.rows,
            };
    
            if (response.status === 200) {
                update(updatedData);
            } else {
                console.log(response)
            }
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);

        if (demo) {
            const sessionLogs = localStorage.getItem("session-logs") ? JSON.parse(localStorage.getItem("session-logs")!) : null;

            const now = new Date(),
                year = now.getFullYear(),
                month = now.getMonth() + 1,
                date = now.getDate(),
                newDate = `${year}/${month.toString().padStart(2, "0")}/${date.toString().padStart(2, "0")}`;

            const updatedSessionLogs = {
                newColumns:
                    sessionLogs.data.columns.map((column: Column) => {
                        if (form.ticket_id) {
                            return {
                                ...column,
                                tickets: (column.id === form.column_id ? (
                                    [
                                        ...column.tickets.filter((ticket) => ticket !== form.ticket_id),
                                        form.ticket_id
                                    ] 
                                ) : (
                                    column.tickets.filter((ticket) => ticket !== form.ticket_id)      
                                ))
                            }
                        } else if (column.id === form.column_id) {
                            return {
                                ...column,
                                tickets: [
                                    ...column.tickets,
                                    sessionLogs.data.tickets.length + 1,
                                ]
                            };
                        } else {
                            return {
                                ...column
                            }
                        }
                    }),
                newTickets: (form.ticket_id ? (
                    sessionLogs.data.tickets.map((ticket: Ticket) => {
                        if (ticket.id === form.ticket_id) {
                            return {
                                ...ticket,
                                board_id: form.board_id,
                                column_id: form.column_id,
                                ticket_title: form.ticket_title,
                                column_title: form.column_title,
                                description: form.description,
                                links: form.links,
                                date_created: newDate,
                            }
                        } else {
                            return ticket;
                        }
                    })
                ) : (
                    [
                        ...sessionLogs.data.tickets,
                        {
                            board_id: form.board_id,
                            id: sessionLogs.data.tickets.length + 1,
                            column_id: form.column_id,
                            ticket_title: form.ticket_title,
                            column_title: form.column_title,
                            description: form.description,
                            links: form.links,
                            date_created: newDate,
                        }
                    ]
                ))
            };

            setSubmitting(false);
            update(updatedSessionLogs);
        } else {
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
    
            const response = await fetch(`${url}/api/${fetchUrl}`, request);
            const data = await response.json();
    
            const updatedData = {
                newColumns: data.newColumns.rows,
                newTickets: data.newTickets.rows
            };
    
            if (response.status === 200) {
                setSubmitting(false);
                update(updatedData);
            } else {
                console.log(response)
            }
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
                column_id: ticket!.column_id,
                ticket_id: ticket!.id,
                ticket_title: ticket!.ticket_title,
                column_title: ticket!.column_title,
                description: ticket!.description,
                links: ticket!.links
            });

            setTicketDescriptionString(ticket!.description ? ticket!.description.join('\n') : "");
        };
    }, [editTicket, ticket, form]);

    useEffect(() => {

        const hasProtocol = ["https://", "http://"].some(term => ticketLinkURL.includes(term));

        if (ticketLinkText && hasProtocol) {
            setIfLinkAddDisabled(false);
        } else {
            setIfLinkAddDisabled(true);
        }
    }, [ticketLinkText, ticketLinkURL]);

    return (
        <div className={styles.addModal}>
            <div className={styles.innerModal}>
                <div className={styles.modalActionsContainer}>
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
                    <div className={styles.viewTicket}>
                        <h2 className={styles.ticketId}>#{ticket.id}</h2>
                        <h2 className={styles.title}>{ticket.ticket_title}</h2> 
                        <div className={styles.ticketCategory}>
                            <div>
                                <h3>{ticket.column_title}</h3>
                            </div>
                        </div>
                        <div className={styles.ticketLinksContainer}>
                            <h3>Links</h3>
                            {ticket.links.length > 0 ? (
                                <div className={styles.links}>
                                    {ticket.links.map((link) => (
                                        <a 
                                            href={link.link_url}
                                            target="_blank"
                                            key={link.link_text + "ticketLink"}
                                        >
                                            <h4>{link.link_text}</h4>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.links}>
                                    <p>No links</p>
                                </div>
                            )}
                        </div>
                        <div className={styles.ticketDescriptionContainer}>
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
                        <h2 className={styles.title}>{ticket ? ("Edit") : ("Create")} Ticket</h2>
                        <div className={styles.ticketTitleContainer}>
                            <label htmlFor="ticket_title">Title</label>
                            <input 
                                name="ticket_title"
                                id="ticket_title"
                                value={form.ticket_title}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.createTicketCategories}>
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
                        <div className={styles.ticketLinksContainer}>
                            <div className={styles.ticketLinksHeader}>
                                <h3>Links</h3>
                                <ButtonIcon
                                    clickFunction={toggleAddLink}
                                    icon={"add"}
                                />
                            </div>
                            {openAddLink && (
                                <div className={styles.addLink}>
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
                                        className="greenButton"                                    
                                        onClick={(e) => addLink(e)}
                                        disabled={ifLinkAddDisabled}
                                    >
                                        Add
                                    </button>
                                </div>
                            )}
                            <div className={styles.links}>
                                {form.links.length > 0 ? (
                                    <>
                                        {form.links.map((link, index) => (
                                            <button 
                                                key={link.link_text + "ticketLink"}
                                                onClick={(e) => deleteLink(e, index)}
                                            >
                                                <h4>{link.link_text}</h4>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M326.6 166.6L349.3 144 304 98.7l-22.6 22.6L192 210.7l-89.4-89.4L80 98.7 34.7 144l22.6 22.6L146.7 256 57.4 345.4 34.7 368 80 413.3l22.6-22.6L192 301.3l89.4 89.4L304 413.3 349.3 368l-22.6-22.6L237.3 256l89.4-89.4z"/></svg>
                                            </button>
                                        ))}
                                    </>
                                ) : (
                                    <p>No links</p>
                                )}
                            </div>
                        </div>
                        <div className={styles.ticketDescriptionContainer}>
                            <label htmlFor="ticketDescription">Description</label>
                            <textarea
                                id="ticketDescription"
                                value={ticketDescriptionString}
                                onChange={(e) => configureDescription(e.target.value)}
                            />
                        </div>
                        <button className="greenButton" type="submit" disabled={formDisabled}>
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