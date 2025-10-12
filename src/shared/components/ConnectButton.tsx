import { useAccount, useConnect, useDisconnect } from "wagmi";

import { Button } from "./Button";

export const ConnectButton = () => {
  const { address } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div>
      {address ? (
        <Button onClick={() => disconnect()}>Disconnect</Button>
      ) : (
        connectors.map((connector) => (
          <Button key={connector.uid} onClick={() => connect({ connector })}>
            {connector.name}
          </Button>
        ))
      )}
    </div>
  );
};
