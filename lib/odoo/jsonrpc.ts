type JsonRpcResponse<T> = { jsonrpc: "2.0"; id: number; result?: T; error?: any };

export async function odooJsonRpc<T>(url: string, payload: any): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`ODOO_HTTP_${res.status}`);
  }
  const data = (await res.json()) as JsonRpcResponse<T>;
  if (data.error) {
    throw new Error(`ODOO_RPC_ERROR: ${JSON.stringify(data.error)}`);
  }
  return data.result as T;
}
