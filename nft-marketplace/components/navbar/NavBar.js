import { ethers } from "ethers";
import { useState, useContext } from "react";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { NFTMarketPlaceContext } from "../context/NFTMarketPlaceContext";

function NavBar() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState();
  const context = useContext(NFTMarketPlaceContext);
  const connect = async () => {
    try {
      context.connectWallet();
      const details = await context.checkWallet();
      const address = await details.accounts;
      setAddress(address[0]);
      setConnected(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  const displaySidebar = () => {
    document.getElementById("sidebar").classList.toggle("active");
  };
  return (
    <div className="bg-pink-400">
      <div className=" flex justify-between items-center pt-2 pb-3">
        <div className="invisible sm:visible text-white text-3xl font-bold font-sans pl-2">
          <Link href="/" className="">
            Open Sea
          </Link>
        </div>
        <div className="flex items-center bg-color rounded w-4/6 p-2 max-[1100px]:hidden">
          <FaSearch />
          <input
            type="search"
            placeholder="Search NFTs"
            className="pl-2 w-full outline-none"
          />
        </div>
        <div
          onClick={connect}
          className="flex justify-center items-center bg-white text-sans text-pink-400 font-medium text-lg w-52 mr-2 rounded cursor-pointer"
        >
          {connected ? (
            <>
              <button className="truncate p-2">{address}</button>
              <img
                src="https://gateway.pinata.cloud/ipfs/QmQwCRrDPzMPRugQzfHGN13o9s4avryBLf9s9EuM7EV4Yg"
                className="rounded-full w-8 h-8 cursor-pointer"
                onClick={displaySidebar}
              />
            </>
          ) : (
            <button className="p-2">Connect Wallet</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
