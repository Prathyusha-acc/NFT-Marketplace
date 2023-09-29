import React from "react";

function Hero() {
  return (
    <div className="">
      <div className="truncate flex justify-between shrink-0 px-5 py-6 w-3/5 text-lg font-semibold">
        <button className="mr-6 hover:text-pink-500">All</button>
        <button className="mr-6 hover:text-pink-500">Art</button>
        <button className="mr-6 hover:text-pink-500">Gaming</button>
        <button className="mr-6 hover:text-pink-500">Membership</button>
        <button className="mr-6 hover:text-pink-500">Photography</button>
        <button className="mr-6 hover:text-pink-500">Music</button>
      </div>
      <div className="opacity-50">
        <img
          src="https://gateway.pinata.cloud/ipfs/QmQwCRrDPzMPRugQzfHGN13o9s4avryBLf9s9EuM7EV4Yg"
          alt="profile img"
          className="h-80 w-full rounded"
        />
      </div>
    </div>
  );
}

export default Hero;
