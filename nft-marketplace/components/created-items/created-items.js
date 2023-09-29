import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { nftContractAddress, nftMarketContractAddress } from "@/config";
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

const CreatedItems = () => {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loading");
  useEffect(() => {
    loadNFTs();
  }, []);
  const loadNFTs = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const NFTInstances = new ethers.Contract(
      nftContractAddress,
      NFT.abi,
      provider
    );
    const NFTMarketInstances = new ethers.Contract(
      nftMarketContractAddress,
      NFTMarket.abi,
      signer
    );

    const data = await NFTMarketInstances.fetchItemsCreated();
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUrl = await NFTInstances.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUrl);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          sold: i.sold,
          name: meta.data.name,
          image: meta.data.image,
          description: meta.data.description,
        };

        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  };
  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="font-semibold p-3">No items in MarketPlace</h1>;
  return (
    <div className="flex justify-center bg-slate-200">
      Created NFTs
      <div className="px-4" style={{ width: "6400px" }}>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 mx-2 min-[px]:grid-cols760-1 max-[530px]:grid-cols-1">
          {nfts.map((nfts, i) => (
            <div key={i} className="card h-96 mb-6">
              <div className="">
                <img src={nfts.image} alt="nfts image" />
              </div>
              <div className="p-4">
                <p>{nfts.name}</p>

                <p className="truncate">{nfts.description}</p>
              </div>
              <div className="p-4 bg-black">
                <p className=" mb-4 font-semibold text-white">
                  {nfts.price} ETH
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatedItems;
