'use client'

import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import ButtonIcon from "../ButtonIcon/ButtonIcon";
import { getUrl } from "../../helpers/getUrl";
import styles from "./styles.module.scss";

const cookies = new Cookies(null, { path: '/'});

export default function BoardModal({demo, exit, update}) {
    const url = getUrl();

    const [boardTitle, setBoardTitle] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [formDisabled, setFormDisabled] = useState(true);

    const handleSubmit = async () => {
        setSubmitting(true);

        if (demo) {
            const sessionLogs = JSON.parse(localStorage.getItem("session-logs"));
            const now = new Date(),
                year = now.getFullYear(),
                month = now.getMonth() + 1,
                date = now.getDate(),
                newDate = `${year}/${month.toString().padStart(2, "0")}/${date.toString().padStart(2, "0")}`;

            const updatedSessionLogs = {
                data: {
                    boards: [
                        ...sessionLogs.data.boards,
                        {
                            board_title: boardTitle,
                            date_created: newDate,
                            updated_last: newDate,
                            id: sessionLogs.data.boards.length + 1,
                            categories: ["Plan", "Doing", "Done"],
                            columns: [
                                sessionLogs.data.columns.length + 1, 
                                sessionLogs.data.columns.length + 2, 
                                sessionLogs.data.columns.length + 3
                            ],
                        }
                    ],
                    columns: [
                        ...sessionLogs.data.columns,
                        {
                            id: sessionLogs.data.columns.length + 1,
                            column_title: "Plan",
                            board_id: sessionLogs.data.boards.length + 1,
                            tickets: []
                        },
                        {
                            id: sessionLogs.data.columns.length + 2,
                            column_title: "Doing",
                            board_id: sessionLogs.data.boards.length + 1,
                            tickets: []
                        },
                        {
                            id: sessionLogs.data.columns.length + 3,
                            column_title: "Done",
                            board_id: sessionLogs.data.boards.length + 1,
                            tickets: []
                        }
                    ],
                    tickets: [
                        ...sessionLogs.data.tickets
                    ]
                }
            };

            localStorage.setItem("session-logs", JSON.stringify(updatedSessionLogs));
            update({
                board_title: boardTitle,
                columns: [1, 2, 3],
                date_created: new Date(),
                id: 2,
                updated_last: new Date()
            });
            setSubmitting(false);
        } else {
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
    
            const response = await fetch(`${url}/api/add-board`, request);
            const data = await response.json();
            
            if (response.status === 200) {
                console.log(data);
                update(data.newBoard.rows[0]);
                setSubmitting(false);
                setOpenModal(false);
            } else if (response.status === 500) {
                setSubmitting(false);
            }  
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
        <div className={styles.addModal}>
            <div className={styles.innerModal}>
                <div className={styles.modalActionsContainer}>
                    <ButtonIcon
                        clickFunction={() => exit(false)}
                        icon={"exit"}
                    />
                </div>
                <form action={handleSubmit}>
                    <h2 className={styles.title}>Create Board</h2>
                    <input 
                        name="boardTitle"
                        placeholder="Board Title"
                        value={boardTitle}
                        onChange={(e) => setBoardTitle(e.target.value)}
                    />
                    <button className="greenButton" type="submit" disabled={formDisabled}>
                        {submitting ? (
                            "Creating"
                        ) : (
                            "Create"
                        )}
                    </button>
                </form>
            </div>
        </div>

    );
}