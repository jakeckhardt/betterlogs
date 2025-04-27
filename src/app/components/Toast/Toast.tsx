'use client'

import { useEffect } from "react";
import ButtonIcon from "../ButtonIcon/ButtonIcon";
import styles from "./styles.module.scss";

export default function Toast({
    message,
    endFunction
} : {
    message: string;
    endFunction: () => void;
}) {

    useEffect(() => {
        const timer = setTimeout(() => {
            endFunction();
        }, 5000);

        return () => clearTimeout(timer);
    });

    return (
        <div 
            className={styles.toast}
        >
            <h3>{ message }</h3>
            <ButtonIcon
                clickFunction={endFunction}
                icon={"exit"}
            />
        </div>
    );
}