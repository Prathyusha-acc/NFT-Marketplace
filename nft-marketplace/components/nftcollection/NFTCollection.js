import React, { useEffect, useState } from "react";
import { nftContractAddress, nftMarketContractAddress } from "@/config";
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { ethers } from "ethers";
import axios from "axios";

function NFTCollection() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loading");
  useEffect(() => {
    loadNFTs();
  }, []);

  const loadNFTs = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-mumbai.g.alchemy.com/v2/bglAUCdiAASjv11NljMLl_Zca0RCi_Up"
    );
    //const provider = new ethers.providers.Web3Provider(window.ethereum);
    const NFTInstances = new ethers.Contract(
      nftContractAddress,
      NFT.abi,
      provider
    );
    const NFTMarketInstances = new ethers.Contract(
      nftMarketContractAddress,
      NFTMarket.abi,
      provider
    );
    //const MyNFTs = await NFTMarketInstances.fetchMyNFTs();
    //console.log("MyNFTS : ", MyNFTs);
    const data = await NFTMarketInstances.fetchMarketItems();
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
          name: meta.data.name,
          image: meta.data.image,
          description: meta.data.description,
        };
        return item;
      })
    );
    console.log("Items loadNFTs : ", items);
    setNfts(items);
    setLoadingState("loaded");
  };
  const buyNFT = async (nft) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const NFTMarketInstances = new ethers.Contract(
      nftMarketContractAddress,
      NFTMarket.abi,
      signer
    );
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await NFTMarketInstances.createMarketSale(
      nftContractAddress,
      nft.tokenId,
      {
        value: price,
      }
    );
    await transaction.wait();
    loadNFTs();
  };
  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="font-semibold p-3">No items in MarketPlace</h1>;

  return (
    <div className="">
      {/* <h2 className="text-2xl m-6 text-23xl font-semibold">NFT DashBoard</h2> */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 mx-2 min-[px]:grid-cols760-1 max-[530px]:grid-cols-1">
        {nfts.map((nft, i) => (
          <div key={i} className="card mb-6">
            <div>
              <img
                src={nft.image}
                alt="nft image"
                className="h-52 w-full object-fit"
              />
            </div>
            <div className="p-4">
              <p className="font-semibold">{nft.name}</p>
              <p className="text-gray-600">{nft.description}</p>
            </div>
            <div className="p-4 bg-slate-400 rounded">
              <p className=" mb-4 font-semibold text-black">{nft.price} ETH</p>
              <button
                className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                onClick={() => buyNFT(nft)}
              >
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NFTCollection;
