import NavBar from "@/components/navbar/NavBar";
import SideBar from "@/components/sidebar/SideBar";
import { NFTMarketPlaceProvider } from "@/components/context/NFTMarketPlaceContext";
import "@/styles/globals.css";

import Link from "next/link";

const App = ({ Component, pageProps }) => {
  return (
    <div className="">
      <NFTMarketPlaceProvider>
        <NavBar />
        <SideBar />
        <Component {...pageProps} />
      </NFTMarketPlaceProvider>
    </div>
  );
};

export default App;
