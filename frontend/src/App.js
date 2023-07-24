import "./App.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Mint from "./components/Mint";
import Stake from "./components/Stake";
import TokenBal from "./components/TokenBal";
import StakedNft from "./components/StakedNft";
import UnstakedNft from "./components/UnstakedNft";

function App() {
  return (
    <div className="App">
      <ConnectButton />
      <Mint />
      <TokenBal />
      <StakedNft />
      <UnstakedNft />{" "}
    </div>
  );
}

export default App;
