import Sign from "./page/Sign";
import Mint from "./page/Mint";
import {useState} from "react";

function App() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const container = {
      height: "100vh",
      width: "100vw",
      display: "flex",
      "flex-direction": "column",
      "justify-content": "center",
      "align-items": "center",
  };
    const divstyle = {
        height: "100vh",

        width: "60vw",
        display: "flex",
        "flex-direction": "column",
        "justify-content": "center",
        "align-items": "center",
        gap: "1rem",
        "font-size": "0.5rem",
        "word-break": "break-all",
    };
    return (
        <div style={container}>
            <div style={divstyle}>
                <Sign title={"Signer A"} setter={setA} />
                <Sign title={"Signer B"} setter={setB} />
                <Mint params={{toA:a.signer, signatureA:a.signature, toB:b.signer, signatureB:b.signature}}/>
            </div>
        </div>
    );
}

export default App;
