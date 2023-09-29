const { expect } = require("chai");

describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    const Market = await ethers.getContractFactory("NFTMarket");

    const market = await Market.deploy();
    await market.deployed();
    const marketContractAddress = market.address;

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketContractAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;
    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("100", "ether");
    await nft.createToken(
      "https://gateway.pinata.cloud/ipfs/QmXAUmu1XxBYgJ1yT3Xagr5GgEBNGahPCm1LwzkLmf2aY1/back.jpg"
    );
    await nft.createToken(
      "https://gateway.pinata.cloud/ipfs/QmXAUmu1XxBYgJ1yT3Xagr5GgEBNGahPCm1LwzkLmf2aY1/back.jpg"
    );

    await market.createMarketItems(nftContractAddress, 1, auctionPrice, {
      value: listingPrice,
    });
    await market.createMarketItems(nftContractAddress, 2, auctionPrice, {
      value: listingPrice,
    });

    const [_, buyerAddress] = await ethers.getSigners();
    // const buyerAddress = Market.signer;
    console.log("buyerAddress: ", buyerAddress);

    await market
      .connect(buyerAddress)
      .createMarketSale(nftContractAddress, 1, { value: auctionPrice });

    const items = await market.fetchMarketItems();
    const myNFTs = await market.fetchMyNFTs();
    const createdItems = await market.fetchItemsCreated();

    console.log("items: ", items);
    console.log("myNFTs: ", myNFTs);
    console.log("createdItems: ", createdItems);
  });
});
