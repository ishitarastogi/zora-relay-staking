import React, { useState, useEffect } from "react";
import ContractInfo from "../ABIs/BuidlNFT.json";
import { useAccount } from "wagmi";
import { getContract } from "@wagmi/core";
import { useWalletClient } from "wagmi";

function Mint() {
  const { address } = useAccount();
  // New state variable for storing the list of NFTs
  //   const [imageURLs, setImageURLs] = useState([]);

  const { data: walletClient } = useWalletClient();
  const nftContract = getContract({
    address: ContractInfo.address,
    abi: ContractInfo.abi,
    walletClient,
  });
  const mintNFT = async () => {
    const tx = await nftContract.read?.balanceOf([address]);
    console.log(tx);

    const tx1 = await nftContract.write.safeMint([
      address,
      "https://bafkreih73g4bdfee55w7izme3ryt6imjuh2nykdnxxpwe6eepdqrrkjcjm.ipfs.nftstorage.link/",
    ]);
    console.log(tx1);
    // try {
    //   const tx = await nftContract?.safeMint(
    //     address,
    //     "https://bafkreih73g4bdfee55w7izme3ryt6imjuh2nykdnxxpwe6eepdqrrkjcjm.ipfs.nftstorage.link/"
    //   );
    //   console.log(tx);
    //   window.alert("NFT Minted");
    // } catch (err) {
    //   console.log(err);
    // }
  };
  // New effect for retrieving the NFTs
  //   useEffect(() => {
  //     const fetchImages = async () => {
  //       const balance = await nftContract.read.balanceOf([address]);
  //       const _imageURLs = [];

  //       for (let i = 0; i < balance; i++) {
  //         const tokenId = await nftContract.read.tokenOfOwnerByIndex([
  //           address,
  //           i,
  //         ]);
  //         const uri = await nftContract.read.tokenURI([tokenId]);
  //         const metadataResponse = await fetch(uri);
  //         const metadata = await metadataResponse.json();
  //         _imageURLs.push(metadata.image);
  //       }

  //       setImageURLs(_imageURLs);
  //     };

  //     if (address) fetchImages();
  //   }, [address, nftContract]);

  return (
    <div>
      {address && (
        <button
          className="p-3 bg-[#ff1] text-black text-lg rounded-xl mx-auto my-5 hover:scale-105 font-medium"
          onClick={mintNFT}
        >
          Mint NFT
        </button>
      )}
      {/* {imageURLs.map((url, index) => (
        <div key={index} className="my-4">
          <img src={url} alt="NFT" className="h-48 w-48 object-cover mx-auto" />
          <button
            className="p-3 bg-[#ff1] text-black rounded-xl my-4 "
             onClick={() => stakeNft(tokenIds[index])}
          >
            Stake NFT
          </button>
        </div>
      ))} */}
    </div>
  );
}

export default Mint;
