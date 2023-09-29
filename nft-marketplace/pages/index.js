import Hero from "@/components/hero/Hero";
import NFTCollection from "@/components/nftcollection/NFTCollection";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <div className="">
      <div className="">
        <Hero />
        <div>
          <h2 className="text-2xl m-6 text-23xl font-semibold">
            Available NFTs
          </h2>
          <NFTCollection />
        </div>
        <Footer />
      </div>
    </div>
  );
}
