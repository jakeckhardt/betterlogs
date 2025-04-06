'use client'

import { useEffect, useState } from "react";
import { getUrl } from "../helpers/getUrl";
import styles from "./styles.module.scss";

export default function SignUp() {
    const url = getUrl();

    const [canSub, setCanSub] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [boardName, setBoardName] = useState(String);

    useEffect(() => {
        if (boardName) {
            setCanSub(true);
        } else {
            setCanSub(false);
        }
    }, [boardName])

    const handleSubmit = async () => {
        setSubmitting(true);

        const request = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title: boardName,
            })
        };

        const response = await fetch(`${url}/api/add-board`, request);

        if (response.status === 200) {
            const json = await response.json();
            window.location.href = `${url}/board/${json.newBoard.rows[0].id}`;
        } else if (response.status === 500) {
            console.log(response);
            setSubmitting(false);
        }  
    };

    return (
        <div className={styles.createBoard}>
            <form action={handleSubmit}>
                <input 
                    name="title" 
                    placeholder="Board Title" 
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                />
                <button type="submit" disabled={!canSub}>
                    {submitting ? "Submitting" : "Create Board"}
                </button>
            </form>
        </div>
    );
}
