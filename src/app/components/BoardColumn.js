'use client'

export default function BoardColumn({
    column, 
    tickets, 
    selectTicket,
    dragStart,
    dragOver,
    drop,
    ifDragging
}) {

    return (
        <div 
            className="category"
            onDrop={() => drop(column.id, column.column_title)}
        >
            <div className="header">
                <h2>{column.column_title}</h2>
            </div>
            {column.tickets.length > 0 ? (
                <>
                    {column.tickets.map((ticketid, index) => (
                        <button 
                            key={"ticket" + ticketid} 
                            className={!ifDragging ? "ticket" : "ticket noBorder"}
                            draggable="true"
                            onClick={() => selectTicket(tickets.find((ticket) => ticket.id === ticketid), index)}
                            onDragStart={(event) => dragStart(event, ticketid)}
                            onDragOver={(event) => dragOver(event, column.id, ticketid)}
                        >
                            <div className="ticketDragContainer">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M48 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm0 160a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM96 416A48 48 0 1 0 0 416a48 48 0 1 0 96 0zM208 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48 112a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM208 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>
                            </div>
                            <h3>{tickets.find((ticket) => ticket.id === ticketid).ticket_title}</h3>
                        </button>
                    ))}
                </>
            ) : (
                <div 
                    className="ticket emptyTicket"
                    onDragOver={(e) => dragOver(e, column.id)}
                >
                </div>
            )}
        </div>
    );
}