import { ethers } from "ethers";
export const checkWallet = async () => {
  try {
    if (!window.ethereum) return alert("Install metamask");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const balanceInBIg = await provider.getBalance(accounts[0]);
    const balance = ethers.utils.formatEther(balanceInBIg);
    if (accounts.length) return { provider, accounts, signer, balance };
    else {
      console.log("No account found");
    }
  } catch (error) {
    console.log("Error while connecting MetaMsk: ", error);
  }
};
export const connectWallet = async () => {
  try {
    if (!window.ethereum) return alert("Install metamask");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    if (accounts.length) console.log(accounts[0]);
    else {
      console.log("No account found");
    }
  } catch (error) {
    console.log("Error while connecting MetaMsk: ", error);
  }
};
