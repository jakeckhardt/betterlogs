"use client"

import { useState, useEffect } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies(null, { path: '/'});

export default function BoardLayout({ boards }) {
    const [createdBoards, setCreatedBoards] = useState(boards || []);
    const [openModal, setOpenModal] = useState(false);
    const [formDisabled, setFormDisabled] = useState(true);
    const [boardTitle, setBoardTitle] = useState("");
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
                title: boardTitle
            })
        };

        const response = await fetch("http://localhost:3000/api/add-board", request);
        const data = await response.json();

        if (response.status === 200) {
            setCreatedBoards([...createdBoards, data.newBoard.rows[0]]);
            setSubmitting(false);
            setOpenModal(false);
        } else if (response.status === 500) {
            setSubmitting(false);
        }  
    };

    useEffect(() => {

        if (!boardTitle) {
            setFormDisabled(true);
        } else {
            setFormDisabled(false);
        }

    }, [boardTitle]);

    return (
        <div className="boardsPage">
            <div className="boardsHeader">
                <h1>Boards</h1>
                <button 
                    className="addBoard"
                    onClick={() => setOpenModal(true)}
                >
                    <h2>+</h2>
                </button>
            </div>
            <div className="boardsContainer">
                <div className="createdBoards">
                    <div className="boardTitleContainer">
                        <h3>Created Boards</h3>
                    </div>
                    <div className="boards">
                        {createdBoards.map((board) => (
                            <a
                                className="board"
                                key={board.id}
                                href={"/board/" + board.id}
                            >
                                <h2>{board.board_title}</h2>
                                <div className="boardDetails">
                                    <p>Items: {board.tickets.length}</p>
                                    <p>Created: {new Date(board.date_created).getMonth()}/{new Date(board.date_created).getDay()}/{new Date(board.date_created).getFullYear()}</p>
                                    <p>Updated Last: {new Date(board.date_created).getMonth()}/{new Date(board.date_created).getDay()}/{new Date(board.date_created).getFullYear()}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
                {/* <div className="linkedBoards">
                    <div className="boardTitleContainer">
                        <h3>Linked Boards</h3>
                    </div>
                    <div className="boards">
                        {boards.map((board) => (
                            <a
                                className="board"
                                key={board.id}
                                href={"/board/" + board.id}
                            >
                                <h2>{board.board_title}</h2>
                                <div className="boardDetails">
                                    <p>Items: 10</p>
                                    <p>Created: 10/20/2015</p>
                                    <p>Updated Last: 10/20/2015</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div> */}
            </div>
            {openModal ? (
                <div className="addBoardModal">
                    <form action={handleSubmit}>
                        <button 
                            className="exitModal"
                            onClick={() => setOpenModal(false)}
                        >
                            +
                        </button>
                        <h2>Create Board</h2>
                        <input 
                            name="boardTitle"
                            placeholder="Board Title"
                            value={boardTitle}
                            onChange={(e) => setBoardTitle(e.target.value)}
                        />
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
