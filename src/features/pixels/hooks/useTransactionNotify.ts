import { useEffect, useState } from "react";

import { type WriteContractErrorType } from "wagmi/actions";

type NotifyType = "uploading" | "processing";

const NotifyMessage = {
  uploading: "Uploading file...",
  processing: "Processing transaction...",
} as const;

interface Props {
  isPending: boolean;
  error: WriteContractErrorType | null;
}

export const useTransactionNotify = ({ isPending, error }: Props) => {
  const [notifyType, setNotifyType] = useState<NotifyType | null>(null);

  const notifyMessage = notifyType ? NotifyMessage[notifyType] : "";

  useEffect(() => {
    if (isPending) {
      setNotifyType("processing");
    }
  }, [isPending]);

  useEffect(() => {
    if (error && error.message.includes("User rejected the request")) {
      setNotifyType(null);
    }
  }, [error]);

  return {
    isProcessingPurchase: !!notifyMessage,
    notifyMessage,
    setNotifyType,
  };
};
