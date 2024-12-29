'use client'

import { useEffect, useState } from "react";
import { board } from "../helpers/types";
import { getUrl } from "@/app/helpers/getUrl";
import Cookies from "universal-cookie";
import Link from "next/link";
import ButtonIcon from "./ButtonIcon";

const cookies = new Cookies(null, { path: '/'});

export default function BoardSettings({ 
    boardData
} : { 
    boardData: board
}) {
    const url = getUrl();
    const session = cookies.get('session');
    const [newBoardData, setNewBoardData] = useState(boardData);
    const [canSave, setCanSave] = useState(false);

    const editColumn = (newColumnTitle: string, index: number) => {

        setNewBoardData({
            ...newBoardData,
            categories: [
                ...newBoardData.categories.slice(0, index),
                newColumnTitle,
                ...newBoardData.categories.slice(index + 1)
            ]
        });
    };

    const deleteColumn = async (index: number) => {

        setNewBoardData({
            ...newBoardData,
            categories: [
                ...newBoardData.categories.slice(0, index),
                ...newBoardData.categories.slice(index + 1)
            ],
            columns: [  
                ...newBoardData.columns.slice(0, index),
                ...newBoardData.columns.slice(index + 1)
            ]
        });
    };

    const addColumn = async () => {

        setNewBoardData(
            {
                ...newBoardData,
                categories: [
                    ...newBoardData.categories,
                    "New Column"
                ],
                columns: [
                    ...newBoardData.columns,
                    null
                ]
            }
        );
    };

    const saveBoardData = async () => {
        console.log("saving board data");

        const savedBoard = await fetch(`${url}/api/update-board`, {
            method: 'PUT',
            headers: {
                'Authorization': session
            },
            body: JSON.stringify(newBoardData)
        });

        const response = await savedBoard.json();
        console.log(response);
    };

    const deleteBoard = async () => {
        const deleteRes = await fetch(`${url}/api/delete-board`, {
            method: 'POST',
            headers: {
                'Authorization': session
            },
            body: JSON.stringify({
                id: boardData.id
            })
        });

        const response = await deleteRes.json();

        if (response.message) {
            window.location.href = "/";
        }
    };

    useEffect(() => {
        console.log(newBoardData);

        if (JSON.stringify(newBoardData) !== JSON.stringify(boardData)) {
            setCanSave(true);
        } else {
            setCanSave(false);
        }
    }, [newBoardData]);

    return (
        <div className="boardSettings">
            <div className="backToBoard">
                <Link href={`/board/${boardData.id}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path d="M25.4 278.6L2.7 256l22.6-22.6 144-144L192 66.7 237.2 112l-22.6 22.6L125.2 224 416 224l32 0 0 64-32 0-290.7 0 89.4 89.4L237.2 400 192 445.3l-22.6-22.6-144-144z"/>
                    </svg>
                    <h3>Back to board</h3>
                </Link>
            </div>
            <h1>Board Settings</h1>
            <div className="titleSettings">
                <h2>Board Title</h2>
                <input 
                    type="text" 
                    value={newBoardData.board_title} 
                    onChange={(e) => setNewBoardData({
                        ...newBoardData, 
                        board_title: e.target.value
                    })}
                />
            </div>
            <div className="columnsSettings">
                <h2>Columns</h2>
                <div className="columns">
                    {newBoardData.categories.map((category, index) => (
                        <div className="column" key={index} draggable>
                            <div className="columnDragContainer">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M48 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm0 160a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM96 416A48 48 0 1 0 0 416a48 48 0 1 0 96 0zM208 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48 112a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM208 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>
                            </div>
                            <input 
                                type="text" 
                                value={category}
                                onChange={(e) => editColumn(e.target.value, index)}
                            />
                            <div className="columnButtons">
                                <ButtonIcon 
                                    icon="delete"
                                    clickFunction={() => deleteColumn(index)}
                                />
                            </div>
                        </div>
                    ))}
                    <div 
                        className="column addColumn"
                        onClick={addColumn}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M326.6 166.6L349.3 144 304 98.7l-22.6 22.6L192 210.7l-89.4-89.4L80 98.7 34.7 144l22.6 22.6L146.7 256 57.4 345.4 34.7 368 80 413.3l22.6-22.6L192 301.3l89.4 89.4L304 413.3 349.3 368l-22.6-22.6L237.3 256l89.4-89.4z"/></svg>
                    </div>
                </div>
            </div>         
            {/* 
            TODO: Add users settings
            <div className="usersSettings">
                <h2>Users</h2>
            </div> 
            */}
            <div className="settingsButtonsContainer">
            <button 
                    onClick={saveBoardData}
                >
                    Save Board
                </button>
                <button 
                    className="deleteButton"
                    onClick={deleteBoard}
                >
                    Delete Board
                </button>
            </div>
        </div>
    )
};