export type BridgeTab = { id: number; url: string; title: string };
export type BridgePage = { title: string; url: string; text: string; links: { title: string; url: string }[] };

type BridgeResponse = { ok: boolean; error?: string; tab?: BridgeTab; page?: BridgePage; tabId?: number };

export function browserExtensionAvailable(): boolean {
  return typeof window !== 'undefined' && Boolean((window as Window & { chrome?: { runtime?: { sendMessage?: unknown } } }).chrome?.runtime?.sendMessage);
}

async function send(message: unknown): Promise<BridgeResponse> {
  const runtime = (window as Window & { chrome?: { runtime?: { sendMessage?: (m: unknown, cb: (r: BridgeResponse) => void) => void } } }).chrome?.runtime;
  if (!runtime?.sendMessage) return { ok: false, error: 'StreamEarn Browser Bridge is not installed.' };
  return new Promise(resolve => runtime.sendMessage!(message, resolve));
}

export const browserBridge = {
  getActiveTab: () => send({ type: 'STREAM_EARN_GET_ACTIVE_TAB' }),
  navigate: (tabId: number, url: string) => send({ type: 'STREAM_EARN_NAVIGATE', tabId, url }),
  readPage: (tabId: number) => send({ type: 'STREAM_EARN_READ_PAGE', tabId }),
};
