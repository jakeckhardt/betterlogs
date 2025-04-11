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
            console.log(err.inner);
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
            cookies.set('session', data.token);
            // window.location.href = `${url}/`;
        } else {
            console.log(data.message);
            setErrors([{
                key: "all",
                message: data.message
            }])
            setSubmitting(false);
        }  
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
                    className={Object.entries(errors).find(([_, error]) => (error.key === "email" || error.key === "all")) && styles.error}
                    placeholder="Email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({
                        ...loginData,
                        email: e.target.value
                    })}
                />
                <input 
                    name="password" 
                    className={Object.entries(errors).find(([_, error]) => (error.key === "all")) && styles.error}
                    placeholder="Password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({
                        ...loginData,
                        password: e.target.value
                    })}
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
