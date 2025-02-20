import TAT from "./TAT/TAT";
import TATserver from "./TAT/TATserver";
let connect = new WebSocket("ws://localhost:1000");

let con = false;
let connection = {
  ser: connect,
  active: false,
};

connect.onopen = () => {
  console.log("Connected to server");
  connection.active = true;
};

function App() {
  return (
    <>
      <div>The Project</div>
      <div>
        <TAT />
      </div>
    </>
  );
}

export default App;

export { connection };
