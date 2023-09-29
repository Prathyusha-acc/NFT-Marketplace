require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
/** @type import('hardhat/config').HardhatUserConfig */
privateKey = "38d0e9498c95d05fcf85da5f9015b6b57b3104bab8f3e16465f48d47777ed98e";

module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      chainId: 80001,
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/bglAUCdiAASjv11NljMLl_Zca0RCi_Up",
      accounts: [privateKey],
    },
  },
};
