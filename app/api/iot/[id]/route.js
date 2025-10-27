export async function GET(req, context) {
  const { id } = await context.params;

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/iotNodes/${id}`);

    if (!res.ok) {
      return new Response(`Upstream API error: ${res.status}`, {
        status: res.status,
      });
    }

    const data = await res.json();

    const nodeId = data.deviceId || null;
    const name = data.iotNodeName || null;
    const catCode = data.iotCategory?.iotCategoryCode || null;
    const status = data.criticalCategory || null;
    const transactions = (data.iotTransactions || [])
      .slice()
      .reverse()
      .map((t) => ({
        value: t.value,
        iotCategoryValueCode: t.iotCategoryValueCode,
        timestamp: t.timestamp,
      }))
      .slice(0, 100);

    const latestTimestamp = transactions[0]?.timestamp ?? "";
    const newEtag = `"${nodeId}-${latestTimestamp}"`;

    const clientEtag = req.headers.get("if-none-match");
    if (clientEtag && clientEtag === newEtag) {
      // No changes since last fetch
      return new Response(null, {
        status: 304,
        headers: { ETag: newEtag },
      });
    }

    // Otherwise, return new data
    return Response.json(
      { id: nodeId, catCode, name, status, transactions },
      { headers: { ETag: newEtag } }
    );
  } catch (err) {
    return new Response("Server error: " + err.message, { status: 500 });
  }
}
