'use client'

import { useEffect, useState } from "react";
import { Board, Column, Ticket } from "../../helpers/types";
import Link from "next/link";
import ButtonIcon from "../ButtonIcon/ButtonIcon";
import Toast from "../Toast/Toast";
import styles from "./styles.module.scss";

export default function DemoBoardSettings({ 
    boardID
} : { 
    boardID: number
}) {
    const [newBoardData, setNewBoardData] = useState<Board | null>(null);
    const [canSave, setCanSave] = useState(false);
    const [draggedColumn, setDraggedColumn] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [hitMax, setHitMax] = useState(false);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        // let elem = document.createElement("div");
        // elem.id = "customGhost";
        // document.body.appendChild(elem);

        // e.dataTransfer.setDragImage(elem, 0, 0);
        setDraggedColumn(index);
        console.log("dragging index", index);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();

        if (draggedColumn !== index) {
            const updatedCategories = [...(newBoardData!.categories ?? [])];
            const updatedColumns = [...(newBoardData!.columns ?? [])];
            const [movedCategory] = updatedCategories.splice(draggedColumn!, 1);
            const [movedColumn] = updatedColumns.splice(draggedColumn!, 1);
            updatedCategories.splice(index, 0, movedCategory);
            updatedColumns.splice(index, 0, movedColumn);

            setNewBoardData({
                ...newBoardData!,
                categories: updatedCategories,
                columns: updatedColumns
            });
            setDraggedColumn(index);
            return;
        }
    };

    const editColumn = (newColumnTitle: string, index: number) => {

        setNewBoardData({
            ...newBoardData!,
            categories: [
                ...(newBoardData!.categories ?? []).slice(0, index),
                newColumnTitle,
                ...(newBoardData!.categories ?? []).slice(index + 1)
            ]
        });
    };

    const deleteColumn = async (index: number) => {

        setNewBoardData({
            ...newBoardData!,
            categories: [
                ...(newBoardData!.categories ?? []).slice(0, index),
                ...(newBoardData!.categories ?? []).slice(index + 1)
            ],
            columns: [  
                ...(newBoardData!.columns ?? []).slice(0, index),
                ...(newBoardData!.columns ?? []).slice(index + 1)
            ]
        });
    };

    const addColumn = async () => {
        if (newBoardData!.categories.length >= 5) {
            setHitMax(true);
            return;
        }
        
        setHitMax(false);

        setNewBoardData(
            {
                ...newBoardData!,
                categories: [
                    ...(newBoardData!.categories ?? []),
                    "New Column"
                ],
                columns: [
                    ...(newBoardData!.columns ?? []),
                    newBoardData!.columns.length + 1
                ]
            }
        );
    };

    const saveBoardData = async () => {
        const sessionLogs = localStorage.getItem("session-logs") ? JSON.parse(localStorage.getItem("session-logs")!) : null;
        if (sessionLogs) {
            const nonboardColumns = sessionLogs.data.columns.filter((c: Column) => c.board_id !== boardID);
            const updateColumnArr = sessionLogs.data.columns.filter((c: Column) => c.board_id === boardID); 
            const updatedColumns = updateColumnArr.filter((c: Column) => {
                const columnIndex = newBoardData!.columns.indexOf(c.id);
                return c.id === newBoardData!.columns[columnIndex];
            }).map((c: Column) => {
                const columnIndex = newBoardData!.columns.indexOf(c.id);
                return {
                    ...c,
                    column_title: newBoardData!.categories[columnIndex]
                };
            });

            const newColumnsArr = newBoardData?.columns.filter((columnID) => {
                return !sessionLogs.data.columns.some((c: Column) => c.id === columnID && c.board_id === boardID);
            });
            
            const newColumns = newColumnsArr!.map((columnID) => {
                const index = newBoardData!.columns.indexOf(columnID);

                return {
                    id: columnID,
                    board_id: boardID,
                    column_title: newBoardData!.categories[index],
                    tickets: []
                };
            });

            const allColumns = [
                ...nonboardColumns,
                ...updatedColumns,
                ...newColumns
            ];

            const newSessionLogs = {
                data: {
                    boards: sessionLogs.data.boards.map((b: Board) => {
                        if (b.id === boardID) {
                            return newBoardData;
                        }
                        return b;
                    }),
                    columns: allColumns,
                    tickets: sessionLogs.data.tickets.map((t: Ticket) => {
                        if (t.board_id === boardID) {
                            const columnIndex = newBoardData!.columns.indexOf(t.column_id);
                            return {
                                ...t,
                                column_title: newBoardData!.categories[columnIndex]
                            };
                        }
                        return t;
                    })
                }
            };
            
            localStorage.setItem("session-logs", JSON.stringify(newSessionLogs));
        }
        
        window.location.href = `/board/${boardID}`;
    };

    const deleteBoard = async () => {
        const sessionLogs = localStorage.getItem("session-logs") ? JSON.parse(localStorage.getItem("session-logs")!) : null;
        if (sessionLogs) {
            const updatedBoards = sessionLogs.data.boards.filter((b: Board) => b.id !== boardID);
            const updatedColumns = sessionLogs.data.columns.filter((c: Column) => c.board_id !== boardID);
            const updatedTickets = sessionLogs.data.tickets.filter((t: Ticket) => t.board_id !== boardID);

            const newSessionLogs = {
                data: {
                    boards: updatedBoards,
                    columns: updatedColumns,
                    tickets: updatedTickets
                }
            };

            localStorage.setItem("session-logs", JSON.stringify(newSessionLogs));
        }
        window.location.href = "/";
        
    };

    useEffect(() => {

        const sessionLogs = localStorage.getItem("session-logs") ? JSON.parse(localStorage.getItem("session-logs")!) : null;

        if (sessionLogs && newBoardData === null) {
            console.log("what");
            const sessionBoard = sessionLogs.data.boards.find((b: Board) => b.id === boardID);
            setNewBoardData(sessionBoard);
        }

        if (sessionLogs && JSON.stringify(newBoardData) !== JSON.stringify(sessionLogs.data.boards.find((b: Board) => b.id === boardID))) {
            setCanSave(true);
        } else {
            setCanSave(false);
        }
        setLoading(false);
    }, [newBoardData, boardID]);

    return (
        <div className={styles.boardSettings}>
            <div className={styles.backToBoard}>
                <Link href={`/board/${boardID}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path d="M25.4 278.6L2.7 256l22.6-22.6 144-144L192 66.7 237.2 112l-22.6 22.6L125.2 224 416 224l32 0 0 64-32 0-290.7 0 89.4 89.4L237.2 400 192 445.3l-22.6-22.6-144-144z"/>
                    </svg>
                    <h3>Back to board</h3>
                </Link>
            </div>
            <h1>Board Settings</h1>
            {loading ? (
                <h2>Loading...</h2>
            ) : (
                <>
                    <div className={styles.titleSettings}>
                        <h2>Board Title</h2>
                        <input 
                            type="text" 
                            value={newBoardData!.board_title} 
                            onChange={(e) => setNewBoardData({
                                ...newBoardData!, 
                                board_title: e.target.value
                            })}
                        />
                    </div>
                    <div className={styles.columnsSettings}>
                        <h2>Columns</h2>
                        <div className={styles.columns}>
                            {newBoardData!.categories.map((category, index) => (
                                <div 
                                    className={styles.column} 
                                    key={index} 
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                >
                                    <div className={styles.columnDragContainer}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M48 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm0 160a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM96 416A48 48 0 1 0 0 416a48 48 0 1 0 96 0zM208 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48 112a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM208 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>
                                    </div>
                                    <input 
                                        type="text" 
                                        value={category}
                                        onChange={(e) => editColumn(e.target.value, index)}
                                    />
                                    <div className="columnButtons">
                                        <ButtonIcon 
                                            icon="delete"
                                            clickFunction={() => deleteColumn(index)}
                                        />
                                    </div>
                                </div>
                            ))}
                            <div 
                                className={`${styles.column} ${styles.addColumn}`}
                                onClick={addColumn}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M326.6 166.6L349.3 144 304 98.7l-22.6 22.6L192 210.7l-89.4-89.4L80 98.7 34.7 144l22.6 22.6L146.7 256 57.4 345.4 34.7 368 80 413.3l22.6-22.6L192 301.3l89.4 89.4L304 413.3 349.3 368l-22.6-22.6L237.3 256l89.4-89.4z"/></svg>
                            </div>
                        </div>
                    </div>         
                    {/* 
                    TODO: Add users settings
                    <div className="usersSettings">
                        <h2>Users</h2>
                    </div> 
                    */}
                    <div className={styles.settingsButtonsContainer}>
                        <button 
                            onClick={saveBoardData}
                            disabled={!canSave}
                        >
                            Save Board
                        </button>
                        <button 
                            className={styles.deleteButton}
                            onClick={deleteBoard}
                        >
                            Delete Board
                        </button>
                    </div>
                    {hitMax && (
                        <Toast 
                            message={"You can only create 5 columns in demo mode."}
                            endFunction={() => setHitMax(false)}
                        />
                    )}
                </>
            )}
        </div>
    )
};