import React from "react";
import { ethers } from "ethers";
import { nftContractAddress, nftMarketContractAddress } from "@/config";
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { checkWallet, connectWallet } from "@/web3";

export const NFTMarketPlaceContext = React.createContext();

export const NFTContractInstances = () => {
  const NFTContractInstances = new ethers.Contract(
    nftContractAddress,
    NFT.abi,
    checkWallet().signer
  );
  console.log("INST: ", NFTContractInstances);
  return NFTContractInstances;
};
export const NFTMarketContractInstances = () => {
  const NFTMarketContractInstances = new ethers.Contract(
    nftMarketContractAddress,
    NFTMarket.abi,
    checkWallet().signer
  );
  return NFTMarketContractInstances;
};

export const NFTMarketPlaceProvider = ({ children }) => {
  const title = "NFT MarketPlace";
  return (
    <NFTMarketPlaceContext.Provider
      value={{
        title,
        checkWallet,
        connectWallet,
        NFTContractInstances,
        NFTMarketContractInstances,
      }}
    >
      {children}
    </NFTMarketPlaceContext.Provider>
  );
};
