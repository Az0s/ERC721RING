## env

please copy the .env.example and change the name to .env.
Fill it as you need.

## use

```bash
# install package
npm install
# start hardhat node
npx hardhat start
# deploy contract
npx hardhat run scripts/deploy.js --network hardhat
# start server
cd client  && npm start
```

## notice

make sure to add hardhat local node to your metamast custom network to connect to the local node
