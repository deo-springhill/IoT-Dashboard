"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function Nodes() {
  const { cat } = useParams(); // category code from URL
  const [nodes, setNodes] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slctCat, setCat] = useState(null);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const res = await fetch("/api/iotCat");
        const data = await res.json();

        // Find the category that matches the URL param
        const selectedCategory = data.find(
          (c) => c.code.toLowerCase() === cat.toLowerCase()
        );
        setCat(selectedCategory);

        if (selectedCategory) {
          setCategory(selectedCategory);
          setNodes(selectedCategory.nodes || []);
        } else {
          setCategory(null);
          setNodes([]);
        }

        document.title = `${selectedCategory?.name || "Not Found"} | IoT Monitor`;
      } catch (err) {
        console.error("Failed to fetch nodes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNodes();

    // Optional: Conditional polling only if needed
    // const interval = setInterval(fetchNodes, 10000); // every 10s
    // return () => clearInterval(interval);
  }, [cat]);

  return (
    <div className="p-4 sm:p-6">
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-400 border-t-transparent mb-2"></div>
            <p className="text-gray-600 font-semibold">Loading data...</p>
          </div>
        </div>
      ) : nodes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-600 font-semibold text-lg">
            Tidak ada node yang terdaftar dalam kategori ini.
          </p>

          <Link href="/" className="mt-3">
            <button className="flex items-center gap-2 bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded-lg text-sm sm:text-lg border-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-8-8 8-8" />
              </svg>
              Back
            </button>
          </Link>
        </div>
      ) : (
        <div>
          <div className="flex items-center mb-6">
            <Link href={"/"}>
              <button className="flex items-center gap-2 bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded-lg text-sm sm:text-lg border-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-8-8 8-8" />
                </svg>
                Back
              </button>
            </Link>

            <h1 className="px-5 py-2 text-2xl sm:text-3xl font-bold">
              {category?.name}
            </h1>
          </div>

          <div className="overflow-x-auto rounded-lg border-2 border-black shadow-md">
            <table className="w-full border-collapse">
              <thead className="bg-green-400 text-white text-left">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Device ID</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm sm:text-base">
                {nodes.map((node, index) => (
                  <tr
                    key={node.deviceId}
                    className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{node.deviceId}</td>
                    <td className="px-4 py-2">{node.nodeName}</td>
                    <td className="px-4 py-2">
                      {node.criticalCategory === "Non Critical" ? (
                        <span className="text-sm sm:text-base font-semibold bg-green-400 py-1 px-2 rounded-lg text-white">
                          Normal
                        </span>
                      ) : node.criticalCategory === "Critical" ? (
                        <span className="text-sm sm:text-base font-semibold bg-red-400 py-1 px-2 rounded-lg text-white">
                          Critical
                        </span>
                      ) : (
                        <span className="text-sm sm:text-base font-semibold bg-yellow-400 py-1 px-2 rounded-lg text-white">
                          Warning
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <Link href={`/${cat}/${node.deviceId}`}>
                        <button className="bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded-md text-xs sm:text-sm border-2 border-green-500">
                          Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
