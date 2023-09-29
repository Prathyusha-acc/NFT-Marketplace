import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { client } from "../createNFT";
import NFTCollection from "@/components/nftcollection/NFTCollection";
import CreateDashBoard from "@/components/create-dashboard/CreateDashBoard";
import { NFTMarketPlaceContext } from "@/components/context/NFTMarketPlaceContext";

const Profile = () => {
  const [url, setUrl] = useState("");
  const [address, setAddress] = useState();
  const [balance, setBalance] = useState(0);
  const [collected, setCollected] = useState(true);
  const [created, setCreated] = useState(false);
  const context = useContext(NFTMarketPlaceContext);
  useEffect(() => {
    connect();
  });
  const connect = async () => {
    try {
      context.connectWallet();
      const details = await context.checkWallet();
      const address = await details.accounts;
      const balance = await details.balance;
      setAddress(address[0]);
      setBalance(balance);
    } catch (error) {
      console.log(error.message);
    }
  };
  const onChange = async (e) => {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://smartcontract.infura-ipfs.io/ipfs/${added.path}`;
      setUrl(url);
    } catch (e) {
      console.log(e);
    }
  };
  const handleCollections = () => {
    setCreated(true);
    setCollected(false);
  };
  const handleCreated = () => {
    setCreated(false);
    setCollected(true);
  };
  return (
    <div className="bg-slate-200">
      <div className="">
        <div className="bg-slate-300 w-full h-80 cursor-pointer hover:bg-slate-500">
          <img src={url} />
          <label className="relative inset-1/2 cursor-pointer">
            heart
            <input
              type="file"
              name="myImage"
              accept="image/*"
              onChange={onChange}
              className="hidden"
            />
          </label>
          <div className="flex absolute left-10 top-64">
            <img
              src="https://gateway.pinata.cloud/ipfs/QmQwCRrDPzMPRugQzfHGN13o9s4avryBLf9s9EuM7EV4Yg"
              alt="profile img"
              className=" rounded-full w-40 h-40"
            />
          </div>
        </div>
        <div className=" mt-10 pl-6 leading-8">
          <p className="truncate">Address: {address}</p>
          <p className="truncate">Balance : {balance} ETH</p>
        </div>
        <div className="">
          <div className="flex items-center m-4">
            <button
              className="flex pr-5 hover:text-pink-700 bg-slate-300 mx-4 rounded px-2 justify-center p-2 items-center active:bg-white"
              onClick={handleCreated}
            >
              Collected
            </button>
            <button
              className="flex pr-5 hover:text-pink-700 bg-slate-300 mx-4 rounded px-2 justify-center p-2 items-center active:bg-white"
              onClick={handleCollections}
            >
              Created
            </button>
          </div>

          {collected ? (
            <div>
              <CreateDashBoard />
            </div>
          ) : null}
          {created ? (
            <div>
              <NFTCollection />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Profile;
