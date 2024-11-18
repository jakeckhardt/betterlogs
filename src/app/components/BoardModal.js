'use client'

import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies(null, { path: '/'});

export default function BoardModal({exit, update}) {

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

        const response = await fetch("http://localhost:3000/api/add-board", request);
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
        <div className="addModal">
            <div className="innerModal">
                <div className="modalActionsContainer">
                    <svg 
                        className="closeModal"
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 384 512"
                        onClick={() => exit(false)}
                    >
                        <path d="M326.6 166.6L349.3 144 304 98.7l-22.6 22.6L192 210.7l-89.4-89.4L80 98.7 34.7 144l22.6 22.6L146.7 256 57.4 345.4 34.7 368 80 413.3l22.6-22.6L192 301.3l89.4 89.4L304 413.3 349.3 368l-22.6-22.6L237.3 256l89.4-89.4z"/>
                    </svg>
                </div>
                <form action={handleSubmit}>
                    <h2 className="title">Create Board</h2>
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