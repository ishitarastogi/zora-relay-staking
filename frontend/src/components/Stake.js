import React, { useEffect, useState } from "react";
import BuidlNFT from "../ABIs/BuidlNFT.json";
import StakingAbi from "../ABIs/Staking.json";
import { getContract } from "@wagmi/core";
import { useWalletClient } from "wagmi";
import { useAccount } from "wagmi";

import {
  GelatoRelay,
  SponsoredCallERC2771Request,
} from "@gelatonetwork/relay-sdk";
import { ethers } from "ethers";

function StakeNFT({ url, stake, tokenId }) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();

  const { address } = useAccount();
  const relay = new GelatoRelay();

  const { data: walletClient } = useWalletClient();

  const nftContract = getContract({
    address: BuidlNFT.address,
    abi: BuidlNFT.abi,
    walletClient,
  });

  const stakingContract = getContract({
    address: StakingAbi.address,
    abi: StakingAbi.abi,
    walletClient,
  });
  const [nft, setNft] = useState({
    name: "",
    image: "",
    desc: "",
    tokenID: tokenId,
  });

  //----------------------------------------------------------------------------------//
  // NFT Stake function without Gelato Relay

  // const stakeNft = async () => {
  //
  //   try {
  //
  //     const approve = await nftContract.read.isApprovedForAll([
  //       address,
  //       StakingAbi.address,
  //     ]);
  //
  //     console.log(approve);
  //
  //     if (!approve) {
  //       const tx1 = await nftContract.write.setApprovalForAll([
  //         StakingAbi.address,
  //         true,
  //       ]);
  //
  //     }
  //     console.log(nft.tokenID);
  //     setTimeout(async () => {
  //
  //       const tx = await stakingContract.write.stakeNFT([nft.tokenID]);
  //       console.log(tx);
  //       window.alert("NFT Stake Successful");
  //     }, 2000);
  //   } catch (err) {
  //     console.log(err);
  //   }
  //};
  //----------------------------------------------------------------------------------//

  //----------------------------------------------------------------------------------//
  // NFT Stake function with Gelato Relay (not working)
  const stakeNft = async () => {
    const { chainId } = await provider.getNetwork();
    console.log(chainId.toString());
    try {
      const approve = await nftContract.read.isApprovedForAll([
        address,
        StakingAbi.address,
      ]);
      console.log(approve);
      if (!approve) {
        const contract = new ethers.Contract(
          BuidlNFT.address,
          BuidlNFT.abi,
          signer
        );
        // Generate the target payload
        const { data } = await contract.populateTransaction.setApprovalForAll(
          StakingAbi.address,
          true
        );
        console.log("6check");
        // Populate a relay request
        const requestApproval = {
          chainId: chainId,
          target: nftContract.address,
          data: data,
          user: address,
        };
        // Send a relay request using Gelato Relay!

        const relayResponseApproval = await relay.sponsoredCallERC2771(
          requestApproval,
          provider,
          "SP9YUv7vYfJfwAc_lBHwVjxO9Odo4s3u9quPQ0NgvHY_"
        );
      }
      // console.log(nft.tokenID);
      // setTimeout(async () => {
      //   const { data } = await stakingContract.populateTransaction.stakeNFT(
      //     nft.tokenID
      //   );
      //   // Populate a relay request
      //   const requestStake = {
      //     chainId: 80001,
      //     target: StakingAbi.address,
      //     data: data,
      //     user: address,
      //   };
      //   // Send a relay request using Gelato Relay!
      //   const relayResponseStake = await relay.sponsoredCallERC2771(
      //     requestStake,
      //     publicClient,
      //     "cUffAJu73MJxzgc5n0aODRlf4GNMqyiZ6xDAJevzBfY_"
      //   );
      //   console.log(relayResponseStake);
      //   window.alert("NFT Stake Successful");
      // }, 2000);
    } catch (err) {
      console.log(err);
    }
  };

  const unStakeNft = async () => {
    try {
      const tx = await stakingContract.write.unStakeNFT(nft.tokenID);
      console.log(tx);
      const approve = await nftContract.write.setApprovalForAll(
        StakingAbi.address,
        false
      );
      console.log(tx);
      window.alert("NFT Unstake Successful");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (url) {
      const getData = async () => {
        try {
          const res = await fetch(url);
          const data = await res.json();

          setNft({
            name: data.name,
            image: data.image,
            desc: data.description,
            tokenID: tokenId,
          });
        } catch (err) {
          console.log(err);
        }
      };
      getData();
    }
  }, [tokenId, url]);
  return (
    <div>
      {stake ? (
        <div>
          <section className="text-center max-w-fit border px-3  rounded-md border-[#ffffff82] shadow-lg mx-2 hover:scale-105">
            <h2 className="text-2xl my-2">{nft.name}</h2>
            <img src={nft.image} alt={nft.name} width={200} height={400} />
            <h2 className="text-md text-[#ffffffbe] mt-2">{nft.desc}</h2>
            <button
              className="bg-[#524ffffb] px-3 py-1 my-3 rounded-md font-medium mb-3 w-[60%] text-lg hover:scale-105"
              onClick={stakeNft}
            >
              Stake
            </button>
          </section>
        </div>
      ) : (
        <div>
          <section className="text-center max-w-fit border px-3  rounded-md border-[#ffffff82] shadow-lg hover:scale-105">
            <h2 className="text-2xl my-2">{nft.name}</h2>
            <img src={nft.image} alt={nft.name} width={200} height={400} />
            <h2 className="text-md text-[#ffffffbe] mt-2">{nft.desc}</h2>
            <button
              className="bg-[#ff0909] px-3 py-1 my-3 rounded-md font-medium mb-3 w-[60%] text-lg hover:scale-105"
              onClick={unStakeNft}
            >
              Withdraw
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
export default StakeNFT;
