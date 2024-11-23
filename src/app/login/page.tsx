'use client'

import { useEffect, useState } from "react";
import { getUrl } from "../helpers/getUrl";
import Cookies from "universal-cookie";

const cookies = new Cookies(null, { path: '/'});

export default function SignUp() { 
    const url = getUrl();
    const [canSub, setCanSub] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [email, setEmail] = useState(String);
    const [password, setPass] = useState(String);

    useEffect(() => {
        if (email && password) {
            setCanSub(true);
        } else {
            setCanSub(false);
        }
    }, [email, password]);

    const handleSubmit = async () => {
        setSubmitting(true);

        const request = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: email,
                password: password
            })
        };

        const response = await fetch(`${url}/api/login`, request);
        const data = await response.json();

        if (response.status === 200) {
            cookies.set('session', data.token);
            window.location.href = `${url}/`;
        } else if (response.status === 500) {
            setSubmitting(false);
        }  
    };

    return (
        <div className="login">
            <form action={handleSubmit}>
                <input 
                    name="email" 
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    name="password" 
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPass(e.target.value)}
                />
                <button type="submit" disabled={!canSub}>
                    {submitting ? "Logging in" : "Login"}
                </button>
                <a href="/signup">
                    Sign Up
                </a>
            </form>
        </div>
    );
}
