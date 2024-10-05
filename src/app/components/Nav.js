"use client"

import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: '/'});

export default function Nav() {
    const [loggedIn, setLoggedIn] = useState(false);
    
    const handleLogout = () => {
        cookies.remove('session');
        console.log("Logging out");
        window.location.href = "/login";
    };

    useEffect(() => {
        setLoggedIn(cookies.get('session'));
    }, []);

    return (
        <div className="nav">
            <a href="/">
                <h1>Better<span>Logs</span></h1>
            </a>
            {loggedIn ? (
                <div className="linkContainer">
                    <a href="/profile">
                        Profile
                    </a>
                    <button
                        onClick={(e) => handleLogout()}
                    >
                        Logout
                    </button>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}