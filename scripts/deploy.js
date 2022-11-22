// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const { UPDATE_FRONT_END, FRONT_END_ADDRESS_FILE, FRONT_END_ABI_FILE } =
  process.env;

async function main() {
  // This is just a convenience check

  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory("ERC721RING");
  const token = await Token.deploy();
  await token.deployed();

  console.log("Token address:", token.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(token);
}

function saveFrontendFiles(token) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "client", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ Token: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("ERC721RING");

  fs.writeFileSync(
    path.join(contractsDir, "Token.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );

  // Update real front end project constant
  if (UPDATE_FRONT_END) {
    const chainId = network.config.chainId.toString();
    // network.config.chainId.toString();

    const currentAddresses = JSON.parse(
      fs.readFileSync(FRONT_END_ADDRESS_FILE, "utf8")
    );
    if (chainId in currentAddresses) {
      if (!currentAddresses[chainId].includes(token.address)) {
        currentAddresses[chainId].push(token.address);
      }
    }
    {
      currentAddresses[chainId] = [token.address];
    }

    fs.writeFileSync(FRONT_END_ADDRESS_FILE, JSON.stringify(currentAddresses));
    fs.writeFileSync(
      FRONT_END_ABI_FILE,
      token.interface.format(ethers.utils.FormatTypes.json)
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
