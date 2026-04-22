import type { CheckoutStatusResponse } from "./types";

export interface PollCheckoutStatusOptions {
  statusUrl: string;
  checkoutId: string;
  fetchImpl?: typeof fetch;
}

export async function getCheckoutStatus(
  options: PollCheckoutStatusOptions,
): Promise<CheckoutStatusResponse> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const response = await fetchImpl(
    `${options.statusUrl.replace(/\/$/, "")}/${encodeURIComponent(options.checkoutId)}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    const body = await safeReadText(response);
    throw new Error(
      `status request failed (${response.status}): ${body || response.statusText}`,
    );
  }

  return (await response.json()) as CheckoutStatusResponse;
}

async function safeReadText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return "";
  }
}
