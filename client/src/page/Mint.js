import React from "react";
import { useState } from "react";
import { ethers } from "ethers";
import TokenArtifact from "../contracts/Token.json";
import contractAddress from "../contracts/contract-address.json";
const Mint = (props) => {
    const [state, setState] = useState("TRANSACT");
    // will handle connection to web3 once clicked.
    // use in useEffect while in production
    const handleTransact = async () => {
        function sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }
        sleep(1000);
        // get web3 provider
        const _provider = new ethers.providers.Web3Provider(window.ethereum);
        setState("gProvider..");
        // initialize contract
        const _token = new ethers.Contract(
            contractAddress.Token,
            TokenArtifact.abi,
            _provider.getSigner(0)
        );
        try {
            const tx = await _token.safeMintRingSync(
                props.params.toA,
                props.params.toB,
                props.params.signatureA,
                props.params.signatureB
            );
            setState("PENDING..");
            console.log("transacting with params: ", props.params);
            const receipt = await tx.wait();
            if (receipt.status === 0) {
                // We can't know the exact error that made the transaction fail when it
                // was mined, so we throw this generic one.
                throw new Error("Transaction failed");
            }
            else{
                setState("SUCCESS");
            }
        } catch {
            setState("FAILED");
        }
    };
    return (
        <div>
            <h1>MINT</h1>
            <h3>toA: {props.params.toA}</h3>
            <h3>toB: {props.params.toB}</h3>
            <h3>signatureA: {props.params.signatureA}</h3>
            <h3>signatureB: {props.params.signatureB}</h3>
            <button onClick={handleTransact}>{state}</button>
        </div>
    );
};

export default Mint;
