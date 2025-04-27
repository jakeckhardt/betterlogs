"use client"

import { useState } from "react";
import ButtonIcon from "../../components/ButtonIcon/ButtonIcon";
import BoardModal from "@/app/components/BoardModal/BoardModal";
import { Board } from "@/app/helpers/types";
import styles from "./styles.module.scss";

export default function BoardsLayout({ boards }: { boards: Board[] }) {
    const [createdBoards, setCreatedBoards] = useState(boards);
    const [openModal, setOpenModal] = useState(false);

    const updateBoards = (newBoard: Board) => {
        setCreatedBoards([...createdBoards, newBoard]);
        setOpenModal(false);
    };

    return (
        <div className={styles.boardsPage}>
            <div className={styles.boardsHeader}>
                <h1>Boards</h1>
                <ButtonIcon
                    clickFunction={() => setOpenModal(true)}
                    icon={"add"}
                />
            </div>
            <div className={styles.boardsContainer}>
                <div className={styles.createdBoards}>
                    <div className={styles.boardTitleContainer}>
                        <h3>Created Boards</h3>
                    </div>
                    <div className={styles.boards}>
                        {createdBoards.map((board) => (
                            <a
                                className={styles.board}
                                key={board.id}
                                href={"/board/" + board.id}
                            >
                                <h2>{board.board_title}</h2>
                                <div className={styles.boardDetails}>
                                    <p>
                                        Created:{" "}
                                        {new Date(board.date_created).getMonth() +
                                            1}
                                        /
                                        {new Date(board.date_created).getDate()}
                                        /
                                        {new Date(board.date_created).getFullYear()}
                                    </p>
                                    <p>
                                        Updated Last:{" "}
                                        {new Date(board.updated_last).getMonth() +
                                            1}
                                        /
                                        {new Date(board.updated_last).getDate()}
                                        /
                                        {new Date(board.updated_last).getFullYear()}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
            {openModal && (
                <BoardModal 
                    demo={false}
                    exit={setOpenModal}
                    update={updateBoards}
                />
            )}
        </div>
    );
}
