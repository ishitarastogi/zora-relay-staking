import React, { useEffect, useState } from "react";
import BuidlNFT from "../ABIs/BuidlNFT.json";
import { getContract } from "@wagmi/core";
import { useWalletClient } from "wagmi";
import { useAccount } from "wagmi";
import Stake from "./Stake";

const UnstakedNft = () => {
  const { address } = useAccount();
  const [nfts, setNfts] = React.useState([]);

  const { data: walletClient } = useWalletClient();

  const nftContract = getContract({
    address: BuidlNFT.address,
    abi: BuidlNFT.abi,
    walletClient,
  });

  useEffect(() => {
    const fetchNfts = async () => {
      const balance = await nftContract.read.balanceOf([address]);
      const newNfts = [];
      for (let i = 0; i < balance; i++) {
        const tokenId = await nftContract.read.tokenOfOwnerByIndex([
          address,
          i,
        ]);
        const uri = await nftContract.read.tokenURI([tokenId]);
        newNfts.push({ tokenId, uri });
      }
      setNfts(newNfts);
    };
    if (address) fetchNfts();
  }, [address, nftContract]);

  return (
    <div className="flex flex-col mx-auto text-center">
      <h2 className="text-2xl">Your NFTs</h2>

      <div className="flex flex-wrap mx-auto my-7">
        {nfts.map((nft, id) => (
          <Stake key={id} url={nft.uri} stake={true} tokenId={nft.tokenId} />
        ))}
      </div>
    </div>
  );
};
export default UnstakedNft;
