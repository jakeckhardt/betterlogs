'use client'

import { useEffect, useState } from "react";

export default function SignUp() {
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

        const response = await fetch("http://localhost:3000/api/add-board", request);

        if (response.status === 200) {
            const json = await response.json();
            window.location.href = `http://localhost:3000/board/${json.newBoard.rows[0].id}`;
        } else if (response.status === 500) {
            console.log(response);
            setSubmitting(false);
        }  
    };

    return (
        <div className="createBoard">
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
