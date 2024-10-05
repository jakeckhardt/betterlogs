

export default async function Users() {
    
    let res = await fetch("http://localhost:3000/api/get-users", { cache: "no-store"});
    let data = await res.json();

    return (
        <>
            {data.rows.map((user: Object) => (
                <p>{user.firstname}</p>
            ))}
        </>
    );
}
