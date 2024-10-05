
import { sql } from "@vercel/postgres";

export default async function CreateTicket() {

  return (
    <div className="createTicket">
        <form>
            <input name="ticketTitle"></input>
        </form>
    </div>
  );
}
