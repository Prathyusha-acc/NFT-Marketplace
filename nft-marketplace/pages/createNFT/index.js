import { create as ipfsHttpClient } from "ipfs-http-client";
import { ethers } from "ethers";
import { nftContractAddress, nftMarketContractAddress } from "@/config";
import { useState } from "react";
import { useRouter } from "next/router";
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

const projectId = "2UW1hzf9kZE1uMBpeijKEqfusDQ";
const projectSecret = "83c50fb4ca4845aabb136bd72139f858";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
export const client = ipfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export default function CreatedItems() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://smartcontract.infura-ipfs.io/ipfs/${added.path}`;
      console.log("URL: ", url);
      setFileUrl(url);
    } catch (e) {
      console.log(e);
    }
  }

  async function createItem() {
    const { name, description, price } = formInput;
    if (!name || !price || !description) return;
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://smartcontract.infura-ipfs.io/ipfs/${added.path}`;
      createSale(url);
    } catch (error) {
      console.log("Error uploading file :", error);
    }
  }
  async function createSale(url) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = new ethers.Contract(
      nftContractAddress,
      NFT.abi,
      provider.getSigner()
    );
    let transaction = await signer.createToken(url);
    let tx = await transaction.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();

    const price = ethers.utils.parseUnits(formInput.price, "ether");

    const NFTMarketContract = new ethers.Contract(
      nftMarketContractAddress,
      NFTMarket.abi,
      provider.getSigner()
    );
    let listingPrice = await NFTMarketContract.getListingPrice();
    listingPrice = listingPrice.toString();
    console.log("NFTMarket");
    transaction = await NFTMarketContract.createMarketItems(
      nftContractAddress,
      tokenId,
      price,
      { value: listingPrice }
    );
    await transaction.wait();
    router.push("/");
  }

  return (
    <div className="flex justify-center pt-10">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset name"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="Asset Price in ETH"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <input type="file" name="Asset" className="my-4" onChange={onChange} />
        {fileUrl && <img className="rounded mt-4" width="350" src={fileUrl} />}
        <button
          onClick={createItem}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Create Digital asset
        </button>
      </div>
    </div>
  );
}
