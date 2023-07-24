import React, { useEffect, useState } from "react";
import BuidlNFT from "../ABIs/BuidlNFT.json";
import StakingAbi from "../ABIs/Staking.json";
import { getContract } from "@wagmi/core";
import { useWalletClient } from "wagmi";
import { useAccount } from "wagmi";
import Stake from "./Stake";
import { ethers } from "ethers";

const StakedNft = () => {
  const { address } = useAccount();
  const [rewardBal, setRewardBal] = useState();
  const [tokenId, setTokenId] = useState();
  const [tokenURI, setTokenURI] = useState("");
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
  useEffect(() => {
    if (address) {
      const getStakedNFTs = async () => {
        try {
          const tx = await stakingContract.read.stakeTokenId([address]);
          setTokenId(tx);
          const tx2 = await nftContract.read.tokenURI([tokenId]);
          setTokenURI(tx2);
        } catch (err) {
          console.log(err);
        }
      };
      getStakedNFTs();
    }
    if (address) {
      const getReward = async () => {
        try {
          const reward = await stakingContract.read.calculateReward([address]);
          console.log(reward);
          setRewardBal(ethers.utils.formatUnits(reward, 18));
        } catch (err) {
          console.log(err);
        }
      };
      getReward();
    }
  }, [tokenId, address, stakingContract, nftContract]);
  return (
    <div className="flex flex-col mx-auto text-center">
      <h2 className="text-2xl">Your Staked NFTs</h2>
      <div className="mx-auto my-7">
        {tokenURI && rewardBal ? (
          <Stake url={tokenURI} stake={false} tokenId={tokenId} />
        ) : (
          <section className="border p-5 rounded-lg shadow-lg">
            <h1 className="my-5 text-lg">No NFTs Staked !</h1>
          </section>
        )}
      </div>
    </div>
  );
};
export default StakedNft;
