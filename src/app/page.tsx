
export default async function Home() {

  let res = await fetch("http://localhost:3000/api/get-board", { cache: 'no-store'});
  let data = await res.json();

  return (
    <div className="boardsPage">
      <div className="boardsHeader">
        <h1>Boards</h1>
        <div className="addBoard">
          <h2>+</h2>
        </div>
      </div>
      <div className="boardsContainer">
        <div className="createdBoards">
          <div className="boardTitleContainer">
            <h3>Created Boards</h3>
          </div>
          <div className="boards">
            {data.rows.map((board: object) => (
              <a 
                className="board"
                key={board.id}
                href={"/board/" + board.id}
              >
                <h2>{board.board_title}</h2>
                <div className="boardDetails">
                  <p>Items: 10</p>
                  <p>Created: 10/20/2015</p>
                  <p>Updated Last: 10/20/2015</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
