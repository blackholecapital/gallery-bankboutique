import type { CheckoutRequest, CheckoutResponse } from "./types";

export interface InitiateCheckoutOptions {
  handoffUrl: string;
  payload: CheckoutRequest;
  fetchImpl?: typeof fetch;
  redirect?: boolean;
}

export async function initiateCheckout(
  options: InitiateCheckoutOptions,
): Promise<CheckoutResponse> {
  const fetchImpl = options.fetchImpl ?? fetch;

  const response = await fetchImpl(options.handoffUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(options.payload),
  });

  if (!response.ok) {
    const body = await safeReadText(response);
    throw new Error(
      `checkout handoff failed (${response.status}): ${body || response.statusText}`,
    );
  }

  const data = (await response.json()) as CheckoutResponse;

  if (!data.redirect_url) {
    throw new Error("handoff response missing redirect_url");
  }

  if (options.redirect !== false && typeof window !== "undefined") {
    window.location.assign(data.redirect_url);
  }

  return data;
}

async function safeReadText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return "";
  }
}
