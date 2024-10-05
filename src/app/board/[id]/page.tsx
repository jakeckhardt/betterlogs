'use client'

import { useEffect, useState } from "react";

export default function Board({
    params: { id }
}: {
    params: { id: string }
}) {
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/get-board/${id}`)
      .then(response => response.json())
      .then(json => setBoard(json.boards.rows[0]));

    setLoading(false);
  }, []);

  return (
    <div>
      {loading ? (
        <h1>loading</h1>
      ) : (
        <div key={board.id}>
            <h1>{board.board_title}</h1>
        </div>
      )}
    </div>
  );
}