"use client"

import { useState, useEffect } from "react";
import ButtonIcon from "../../components/ButtonIcon/ButtonIcon";
import BoardModal from "@/app/components/BoardModal/BoardModal";
import Toast from "@/app/components/Toast/Toast";
import { Board } from "@/app/helpers/types";
import styles from "./styles.module.scss";

export default function DemoBoardsLayout() {
    const [boards, setBoards] = useState<Board[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [hitMax, setHitMax] = useState(false);

    const updateBoards = (newBoard: Board) => {
        setBoards([...boards, newBoard]);
        setOpenModal(false);
    };

    const addBoard = () => {
        if (boards.length >= 3) {
            setHitMax(true);
        } else {
            setOpenModal(true);
        }
    };

    useEffect(() => {
        const sessionLogs = localStorage.getItem("session-logs") ? JSON.parse(localStorage.getItem("session-logs")!) : null;
        if (sessionLogs && boards.length === 0) {
            setBoards(sessionLogs.data.boards);
        }

        setLoading(false);
    }, [boards]);

    return (
        <div className={styles.boardsPage}>
            <div className={styles.boardsHeader}>
                <h1>Boards</h1>
                <ButtonIcon
                    clickFunction={addBoard}
                    icon={"add"}
                />
            </div>
            {loading ? (
                <>
                    <h2>Loading</h2>
                </>
            ) : (
                <>
                    <div className={styles.boardsContainer}>
                        <div className={styles.createdBoards}>
                            <div className={styles.boardTitleContainer}>
                                <h3>Created Boards</h3>
                            </div>
                            <div className={styles.boards}>
                                {boards.map((board) => (
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
                            demo={true}
                            exit={setOpenModal}
                            update={updateBoards}
                        />
                    )}
                    {hitMax && (
                        <Toast 
                            message={"You can only create 3 boards in demo mode."}
                            endFunction={() => setHitMax(false)}
                        />
                    )}
                </>
            )}
        </div>
    );
}
