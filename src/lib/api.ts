import type { ApiResponse } from "@/src/types";

export async function apiGet<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url);
    return res.json();
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function apiPost<T>(
  url: string,
  body: unknown
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  } catch {
    return { success: false, error: "Network error" };
  }
}
