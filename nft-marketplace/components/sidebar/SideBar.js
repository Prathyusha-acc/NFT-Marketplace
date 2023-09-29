import React from "react";
import Link from "next/link";

const SideBar = () => {
  const displaySidebar = () => {
    document.getElementById("sidebar").classList.toggle("active");
  };
  const reload = () => {
    window.location.reload(false);
  };
  return (
    <div
      id="sidebar"
      className="flex absolute bg-pink-400 right-0  z-50 w-52 mt-2 rounded "
    >
      <div className="flex flex-col items-start p-4 text-white text-lg font-serif ">
        <Link
          href="/"
          className="pb-5 hover:text-black "
          onClick={displaySidebar}
        >
          Home
        </Link>
        <Link
          href="/account"
          className="pb-5 hover:text-black"
          onClick={displaySidebar}
        >
          Profile
        </Link>
        <Link
          href="/createNFT"
          className="pb-5 hover:text-black "
          onClick={displaySidebar}
        >
          Create
        </Link>
        <Link
          href="/learn"
          target="blank"
          className="pb-5 hover:text-black "
          onClick={displaySidebar}
        >
          Learn
        </Link>
        <Link href="/" className="pb-5 hover:text-black " onClick={reload}>
          Log out
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
