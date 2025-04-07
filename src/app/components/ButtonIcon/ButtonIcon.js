import Link from "next/link";
import { usePathname } from 'next/navigation';
import styles from "./styles.module.scss";

export default function ButtonIcon({clickFunction, icon}) {
    const pathname = usePathname();

    const icons = [
        {
            name: "add",
            className: styles.add,
            iconElement: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M326.6 166.6L349.3 144 304 98.7l-22.6 22.6L192 210.7l-89.4-89.4L80 98.7 34.7 144l22.6 22.6L146.7 256 57.4 345.4 34.7 368 80 413.3l22.6-22.6L192 301.3l89.4 89.4L304 413.3 349.3 368l-22.6-22.6L237.3 256l89.4-89.4z"/></svg>
        },
        {
            name: "delete",
            className: styles.delete,
            iconElement: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M144 0L128 32 0 32 0 96l448 0 0-64L320 32 304 0 144 0zM416 128L32 128 56 512l336 0 24-384z"/></svg>
        },
        {
            name: "edit",
            className: styles.edit,
            iconElement: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M10.2 461L0 512l51-10.2L160 480 420.7 219.3l-16-16-96-96-16-16L32 352 10.2 461zM315.3 68.7l16 16 96 96 16 16 34.7-34.7L512 128 478.1 94.1 417.9 33.9 384 0 350.1 33.9 315.3 68.7zM99.9 352l12.1 0 0 48 48 0 0 12.1-23.7 23.7-75.1 15 15-75.1L99.9 352zM326.6 176l-11.3 11.3-144 144L160 342.6 137.4 320l11.3-11.3 144-144L304 153.4 326.6 176z"/></svg>
        },
        {
            name: "exit",
            className: styles.exit,
            iconElement: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M326.6 166.6L349.3 144 304 98.7l-22.6 22.6L192 210.7l-89.4-89.4L80 98.7 34.7 144l22.6 22.6L146.7 256 57.4 345.4 34.7 368 80 413.3l22.6-22.6L192 301.3l89.4 89.4L304 413.3 349.3 368l-22.6-22.6L237.3 256l89.4-89.4z"/></svg>
        },
        {
            name: "settings",
            className: styles.settings,
            iconElement: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>
        }
    ];

    return (
        <>
            {icon === "settings" ? (
                <Link href={pathname + `/settings`} className={`${styles.buttonIcon} ${styles.settings}`}>
                    {icons.find(iconObject => iconObject.name === icon).iconElement}
                </Link>
            ) : (
                <button
                    className={`${styles.buttonIcon} ${icons.find(iconObject => iconObject.name === icon).className}`}
                    onClick={(e) => clickFunction(e)}
                >
                    {icons.find(iconObject => iconObject.name === icon).iconElement}
                </button>
            )}
        </>
    );
}