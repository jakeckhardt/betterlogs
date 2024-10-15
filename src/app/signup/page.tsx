'use client'

import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies(null, { path: '/'});

export default function SignUp() {
    const [canSub, setCanSub] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [firstName, setFirstName] = useState(String);
    const [lastName, setLastName] = useState(String);
    const [email, setEmail] = useState(String);
    const [password, setPass] = useState(String);
    const [confPass, setConfPass] = useState(String);
    const [passMatch, setPassMatch] = useState(false);

    useEffect(() => {
        if (firstName && lastName && email && passMatch) {
            setCanSub(true);
        } else {
            setCanSub(false);
        }
    }, [firstName, lastName, email, passMatch]);

    useEffect(() => {
        if (password && confPass && password === confPass) {
            setPassMatch(true);
        } else {
            setPassMatch(false);
        }
    }, [password, confPass]);

    const handleSubmit = async () => {
        setSubmitting(true);

        const request = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                firstname: firstName,
                lastname: lastName,
                email: email,
                password: password
            })
        };

        const response = await fetch("http://localhost:3000/api/add-user", request);
        const data = await response.json();

        if (response.status === 200) {
            cookies.set('session', data.token);
            window.location.href = "http://localhost:3000/";
        } else if (response.status === 500) {
            setSubmitting(false);
        }  
    };

    return (
        <div className="signup">
            <form action={handleSubmit}>
                <input 
                    name="firstname" 
                    placeholder="First Name" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <input 
                    name="lastname" 
                    placeholder="Last Name" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
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
                <input 
                    name="confirmPassword" 
                    placeholder="Confirm Password"
                    type="password"
                    value={confPass}
                    onChange={(e) => setConfPass(e.target.value)}
                />
                <button type="submit" disabled={!canSub}>
                    {submitting ? "Submitting" : "Sign Up"}
                </button>
                <a href="/login">
                    Login
                </a>
            </form>
        </div>
    );
}
