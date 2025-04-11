'use client'

import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { getUrl } from "../helpers/getUrl";
import { signupSchema } from "../validations/signup";
import styles from "./styles.module.scss";

const cookies = new Cookies(null, { path: '/'});

interface Error {
    key: string;
    message: string;
};

export default function SignUp() {
    const [canSub, setCanSub] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Error[]>([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '' 
    });
    const [confPass, setConfPass] = useState(String);
    const [passMatch, setPassMatch] = useState(false);

    useEffect(() => {
        if (formData.firstName && formData.lastName && formData.email && passMatch) {
            setCanSub(true);
        } else {
            setCanSub(false);
        }
    }, [formData, passMatch]);

    useEffect(() => {
        if (formData.password && confPass && formData.password === confPass) {
            setPassMatch(true);
        } else {
            setPassMatch(false);
        }
    }, [formData, confPass]);

    const handleSubmit = async () => {
        setSubmitting(true);

        const verifyData = await signupSchema.validate(
            formData, 
            {abortEarly: false}
        ).catch((err) => {
            let errArr = [];

            for (let error of err.inner) {
                errArr.push({
                    key: error.path,
                    message: error.message
                });
            };
            setErrors(errArr);
            setSubmitting(false);
            return;
        });

        if (!verifyData) {
            setSubmitting(false);
            return;
        }

        const url = getUrl();

        const request = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        };

        const response = await fetch(`${url}/api/add-user`, request);
        const data = await response.json();

        if (response.status === 200) {
            cookies.set('session', data.token);
            window.location.href = url;
        } else if (response.status === 500) {
            console.log(response)
            setSubmitting(false);
        }  
    };

    return (
        <div className={styles.signup}>
            <form action={handleSubmit}>
                {errors.length > 0 && (
                    <div className={styles.errors}>
                        {errors.map((error, index) => (
                            <p key={index}>{error.message}</p>
                        ))}
                    </div>
                )}
                <input 
                    name="firstname" 
                    className={Object.entries(errors).find(([_, error]) => (error.key === "firstName")) && styles.error}
                    placeholder="First Name" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({
                        ...formData,
                        firstName: e.target.value
                    })}
                />
                <input 
                    name="lastname" 
                    className={Object.entries(errors).find(([_, error]) => (error.key === "lastName")) && styles.error}
                    placeholder="Last Name" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({
                        ...formData,
                        lastName: e.target.value
                    })}
                />
                <input 
                    name="email" 
                    className={Object.entries(errors).find(([_, error]) => (error.key === "email")) && styles.error}
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({
                        ...formData,
                        email: e.target.value
                    })}
                />
                <input 
                    name="password" 
                    className={Object.entries(errors).find(([_, error]) => (error.key === "password")) && styles.error}
                    placeholder="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({
                        ...formData,
                        password: e.target.value
                    })}
                />
                <input 
                    name="confirmPassword" 
                    className={Object.entries(errors).find(([_, error]) => (error.key === "password")) && styles.error}
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
