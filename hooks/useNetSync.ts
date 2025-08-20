import { runQueueOnce } from "@/lib/uploadQueue";
import * as Network from "expo-network";
import { useEffect } from "react";

export function useNetSync() {
  useEffect(() => {
    let t: any;
    const tick = async () => {
      await runQueueOnce();
      t = setTimeout(tick, 4000);
    };
    Network.addNetworkStateListener(async (s) => {
      if (s.isConnected) await runQueueOnce();
    });
    tick();
    return () => clearTimeout(t);
  }, []);
}
