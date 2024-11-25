export default function ButtonIcon({clickFunction, icon}) {

    const icons = [
        {
            name: "add",
            iconElement: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M326.6 166.6L349.3 144 304 98.7l-22.6 22.6L192 210.7l-89.4-89.4L80 98.7 34.7 144l22.6 22.6L146.7 256 57.4 345.4 34.7 368 80 413.3l22.6-22.6L192 301.3l89.4 89.4L304 413.3 349.3 368l-22.6-22.6L237.3 256l89.4-89.4z"/></svg>
        },
        {
            name: "delete",
            iconElement: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M144 0L128 32 0 32 0 96l448 0 0-64L320 32 304 0 144 0zM416 128L32 128 56 512l336 0 24-384z"/></svg>
        },
        {
            name: "edit",
            iconElement: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M10.2 461L0 512l51-10.2L160 480 420.7 219.3l-16-16-96-96-16-16L32 352 10.2 461zM315.3 68.7l16 16 96 96 16 16 34.7-34.7L512 128 478.1 94.1 417.9 33.9 384 0 350.1 33.9 315.3 68.7zM99.9 352l12.1 0 0 48 48 0 0 12.1-23.7 23.7-75.1 15 15-75.1L99.9 352zM326.6 176l-11.3 11.3-144 144L160 342.6 137.4 320l11.3-11.3 144-144L304 153.4 326.6 176z"/></svg>
        },
        {
            name: "exit",
            iconElement: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M326.6 166.6L349.3 144 304 98.7l-22.6 22.6L192 210.7l-89.4-89.4L80 98.7 34.7 144l22.6 22.6L146.7 256 57.4 345.4 34.7 368 80 413.3l22.6-22.6L192 301.3l89.4 89.4L304 413.3 349.3 368l-22.6-22.6L237.3 256l89.4-89.4z"/></svg>
        }
    ];

    return (
        <button
            className={`buttonIcon ${icons.find(iconObject => iconObject.name === icon).name}`}
            onClick={(e) => clickFunction(e)}
        >
            {icons.find(iconObject => iconObject.name === icon).iconElement}
        </button>
    );
}