export async function GET(req) {
  try {
    const res = await fetch(`${process.env.API_BASE_URL}/iotCategories/`, {
      headers: {
        Authorization: `Bearer ${process.env.ACC_TKN}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch categories");
    const data = await res.json();

    const categories = data.data || [];

    const summary = categories.map((cat) => {
      const nodes = (cat.iotNodes || []).map((node) => ({
        nodeName: node.iotNodeName,
        deviceId: node.deviceId,
        criticalCategory: node.criticalCategory || "Unknown",
      }));

      const criticalCount = nodes.filter(
        (node) => node.criticalCategory?.toLowerCase() === "critical"
      ).length;

      const warningCount = nodes.filter(
        (node) => node.criticalCategory?.toLowerCase() === "warning"
      ).length;

      // totalIssues counts both critical and warning
      const totalIssues = criticalCount + warningCount;

      return {
        code: cat.iotCategoryCode,
        name: cat.iotCategoryName,
        totalIssues,
        criticalCount,
        warningCount,
        nodes,
      };
    });

    return Response.json(summary);
  } catch (error) {
    console.error("Error in /api/iotCat route:", error);
    return Response.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}