import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { nftContractAddress, nftMarketContractAddress } from "@/config";
import { useRouter } from "next/router";
import axios from "axios";

const CreateDashBoard = () => {
  const [nfts, setNfts] = useState([]);
  const [sold, setSold] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loading");

  const router = useRouter();
  useEffect(() => {
    loadNFTs();
  }, []);
  const loadNFTs = async () => {
    try {
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
      console.log("ITEMS: ", items);
      const soldItems = items.filter((i) => i.sold);
      console.log("SoldItems: ", soldItems);
      setSold(soldItems);
      setNfts(items);
      setLoadingState("loaded");
    } catch (error) {
      router.push("/");
      alert("Switch your MetaMask wallet address", error);
    }
  };
  return (
    <div className="">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 mx-2 min-[px]:grid-cols760-1 max-[530px]:grid-cols-1">
        {sold.map((nft, i) => (
          <div key={i} className="card h-96 mb-6">
            <div className="">
              <img
                src={nft.image}
                alt="nft image"
                className="h-52 w-full object-fit"
              />
            </div>
            <div className="relative top-8 leading-7">
              <p className="font-semibold">{nft.name}</p>
              <div className="truncate">
                <p>{nft.description}</p>
              </div>
              <p>{nft.price} ETH</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateDashBoard;
