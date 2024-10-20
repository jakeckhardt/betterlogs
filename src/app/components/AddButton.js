"use client"

export default function AddButton({clickFunction}) {

    return (
        <button
            className="addButton"
            onClick={(e) => clickFunction(e)}
        >
            <h2>+</h2>
        </button>
    );
}