"use client"

import { useState } from "react";
import BoardModal from "@/app/components/BoardModal";

export default function BoardLayout({ boards }) {
    const [createdBoards, setCreatedBoards] = useState(boards || []);
    const [openModal, setOpenModal] = useState(false);

    const updateBoards = (newBoard) => {
        setCreatedBoards([...createdBoards, newBoard]);
        setOpenModal(false);
    };

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
                                    {/* <p>Items: {board.tickets.length}</p> */}
                                    <p>Created: {new Date(board.date_created).getMonth() + 1}/{new Date(board.date_created).getDate()}/{new Date(board.date_created).getFullYear()}</p>
                                    <p>Updated Last: {new Date(board.updated_last).getMonth() + 1}/{new Date(board.updated_last).getDate()}/{new Date(board.updated_last).getFullYear()}</p>
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
            {openModal && (
                <BoardModal 
                    exit={setOpenModal}
                    update={updateBoards}
                />
            )}
        </div>
    );
}
