"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import styles from "./styles.module.scss";

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
        <div className={styles.nav}>
            <Link href="/">
                <h1>Better<span>Logs</span></h1>
            </Link>
            <div className={styles.linkContainer}>
                {loggedIn ? (
                    <>
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
                    </>
                ) : (
                    <>
                        <Link
                            href="/login"
                        >
                            Login
                        </Link>
                        <Link
                            href="/signup"
                        >
                            Signup
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}