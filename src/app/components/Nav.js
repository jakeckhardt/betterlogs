"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies(null, { path: '/'});

export default function Nav() {
    const [loggedIn, setLoggedIn] = useState(false);
    
    const handleLogout = () => {
        cookies.remove('session');
        window.location.href = "/login";
    };

    useEffect(() => {
        setLoggedIn(cookies.get('session'));
    }, []);

    return (
        <div className="nav">
            <Link href="/">
                <h1>Better<span>Logs</span></h1>
            </Link>
            {loggedIn ? (
                <div className="linkContainer">
                    <Link
                        href="/profile"
                    >
                        Profile
                    </Link>
                    <button
                        onClick={handleLogout}
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