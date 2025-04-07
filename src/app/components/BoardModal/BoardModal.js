'use client'

import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import ButtonIcon from "../ButtonIcon/ButtonIcon";
import { getUrl } from "../../helpers/getUrl";
import styles from "./styles.module.scss";

const cookies = new Cookies(null, { path: '/'});

export default function BoardModal({exit, update}) {
    const url = getUrl();

    const [boardTitle, setBoardTitle] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [formDisabled, setFormDisabled] = useState(true);

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
                    <button type="submit" disabled={formDisabled}>
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