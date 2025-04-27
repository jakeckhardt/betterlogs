'use client'

import { useEffect, useState } from "react";
import { getUrl } from "../helpers/getUrl";
import Cookies from "universal-cookie";
import { loginSchema } from "../validations/login";
import styles from "./styles.module.scss";

interface Error {
    key: string;
    message: string;
}

const cookies = new Cookies(null, { path: '/'});

export default function Login() { 
    const url = getUrl();
    const [canSub, setCanSub] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Error[]>([]);
    const [ loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        if (loginData.email && loginData.password) {
            setCanSub(true);
        } else {
            setCanSub(false);
        }
    }, [loginData]);

    const handleSubmit = async () => {
        setSubmitting(true);

        const verifyData = await loginSchema.validate(
            loginData, 
            {abortEarly: false}
        ).catch((err) => {
            setErrors(err.errors);
            setSubmitting(false);
            return;
        });

        if (!verifyData) {
            setSubmitting(false);
            return;
        }

        const request = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        };

        const response = await fetch(`${url}/api/login`, request);
        const data = await response.json();

        if (response.status === 200) {
            cookies.set('session-demo', false);
            cookies.set('session', data.token);
            window.location.href = `${url}/`;
        } else {
            setErrors([{
                key: "all",
                message: data.message
            }])
            setSubmitting(false);
        }  
    };

    const handleTestBetterlogs = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const now = new Date(),
            year = now.getFullYear(),
            month = now.getMonth() + 1,
            date = now.getDate(),
            newDate = `${year}/${month.toString().padStart(2, "0")}/${date.toString().padStart(2, "0")}`;
        
        cookies.set('session-demo', true);
        const sessionLogs = {
            "data": {
                "boards": [
                    {
                        "id": 1,
                        "board_title": "My First Board",
                        "date_created": newDate,
                        "updated_last": newDate,
                        "categories": ["Plan", "Doing", "Done"],
                        "columns": [1, 2, 3]
                    }
                ],
                "columns": [
                    {
                        "id": 1,
                        "board_id": 1,
                        "column_title": "Plan",
                        "tickets": [1]
                    },
                    {
                        "id": 2,
                        "board_id": 1,
                        "column_title": "Doing",
                        "tickets": []
                    },
                    {
                        "id": 3,
                        "board_id": 1,
                        "column_title": "Done",
                        "tickets": []
                    }
                ],
                "tickets": [
                    {
                        "id": 1,
                        "board_id": 1,
                        "column_id": 1,
                        "ticket_title": "My First Ticket",
                        "date_created": newDate,
                        "column_title": "Plan",
                        "links": [],
                        "description": ["This is my first ticket"],
                    }
                ]
            }
        };

        localStorage.setItem('session-logs', JSON.stringify(sessionLogs));

        window.location.href = `${url}/`;
    };

    return (
        <div className={styles.login}>
            <form action={handleSubmit}>
                {errors.length > 0 && (
                    <div className={styles.errors}>
                        {errors.map((error, index) => (
                            <p key={index}>{error.message}</p>
                        ))}
                    </div>
                )}
                <input 
                    name="email" 
                    className={Object.entries(errors).find(([, error]) => (error.key === "email" || error.key === "all")) && styles.error}
                    placeholder="Email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({
                        ...loginData,
                        email: e.target.value
                    })}
                />
                <input 
                    name="password" 
                    className={Object.entries(errors).find(([, error]) => (error.key === "all")) && styles.error}
                    placeholder="Password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({
                        ...loginData,
                        password: e.target.value
                    })}
                />
                <button className="greenButton" type="submit" disabled={!canSub}>
                    {submitting ? "Logging in" : "Login"}
                </button>
                <a className="transparentButton" href="/signup">
                    Sign Up
                </a>
                <button 
                    className="transparentButton"
                    onClick={(e) => handleTestBetterlogs(e)}
                >
                    Demo Mode
                </button>
            </form>
        </div>
    );
}
