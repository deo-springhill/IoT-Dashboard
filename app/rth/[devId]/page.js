"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Temperature() {
  const { devId } = useParams();
  const [id, setId] = useState(null);
  const [name, setName] = useState(null);
  const [status, setStatus] = useState(null);
  const [values, setValues] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [etag, setEtag] = useState(null);

  useEffect(() => {
    document.title = `${devId} | IoT Monitor`;
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/iot/${devId}`, {
          headers: etag ? { "If-None-Match": etag } : {},
        });

        if (res.status === 304) {
          console.log("No changes detected");
          return;
        }

        if (!res.ok) throw new Error("Bad response");
        const data = await res.json();
        const newEtag = res.headers.get("ETag");

        if (!data || !data.id || !data.catCode?.includes("RTH")) {
          setId(null);
          clearInterval(interval);
          return;
        }

        setId(data.id);
        setName(data.name);
        setStatus(data.status);
        setEtag(newEtag);

        // Group by timestamp
        const grouped = {};
        data.transactions.forEach((t) => {
          if (!grouped[t.timestamp]) {
            grouped[t.timestamp] = { timestamp: t.timestamp };
          }
          if (t.iotCategoryValueCode?.includes("TEMP")) {
            grouped[t.timestamp].temperature = t.value;
          } else if (t.iotCategoryValueCode?.includes("HUMD")) {
            grouped[t.timestamp].humidity = t.value;
          }
        });

        const rows = Object.values(grouped).sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        setValues(rows); // for overview table
        setLatest(rows[0] || {}); // latest snapshot
      } catch (err) {
        console.error("Failed to fetch IoT data:", err);
        setId(null);
        clearInterval(interval); // stop refreshing
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [devId, etag]);

  const tempPercent = latest?.temperature
    ? `${Math.min((latest.temperature / 40) * 100, 100)}%`
    : "0%";

  const humdPercent = latest?.humidity ? `${latest.humidity}%` : "0%";

  return (
    <div className="flex items-center justify-center px-3">
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-400 border-t-transparent mb-2"></div>
            <p className="text-gray-600 font-semibold">Loading data...</p>
          </div>
        </div>
      ) : !id ? (
        <div className="flex flex-col items-center justify-center h-64 w-full border-2 border-dashed border-gray-300 rounded-lg mt-3">
          <p className="text-gray-600 font-semibold text-2xl">
            ID tidak ditemukan atau belum terdaftar.
          </p>
          <Link
            href="/nodes/rth"
            className="mt-3 text-green-600 hover:underline"
          >
            <button className="flex items-center gap-2 bg-green-400 hover:bg-green-500 text-white px-3 py-2 rounded-lg text-sm sm:text-lg border-2">
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
        <div className="w-5/6 sm:w-3/4 overflow-y-auto py-10">
          <div className="p-0 sm:p-4">
            <div className="px-0 py-2 sm:px-8">
              <div className="flex flex-col md:flex-row items-center mb-4 gap-6">
                <Link href={"/nodes/rth/"}>
                  <button className="flex items-center gap-2 bg-green-400 hover:bg-green-500 text-white px-3 py-2 rounded-lg text-sm sm:text-lg border-2">
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
                <div>
                  <div className="flex items-center gap-6">
                    <div className="text-2xl sm:text-3xl font-bold">{name}</div>
                    {status == "Non Critical" ? (
                      <span className="text-xl sm:text-2xl font-semibold bg-green-400 py-1 px-2 rounded-lg text-white">
                        Normal
                      </span>
                    ) : status == "Critical" ? (
                      <span className="text-xl sm:text-2xl font-semibold bg-red-400 py-1 px-2 rounded-lg text-white">
                        Critical
                      </span>
                    ) : (
                      <span className="text-xl sm:text-2xl font-semibold bg-yellow-400 py-1 px-2 rounded-lg text-white">
                        Warning
                      </span>
                    )}
                  </div>
                  <div className="text-lg sm:text-md">Device ID: {id}</div>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <div className="w-full max-w-6xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    {/* Temperature Progress Bar */}
                    <div className="rounded-xl p-4 bg-gray-50 shadow-md border-2 border-black">
                      <div className="flex">
                        <h3 className="text-2xl font-semibold mb-2">
                          Suhu
                        </h3>
                        {latest.temperature > 27 || latest.temperature < 18 ? (
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75 animate-ping"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400"></span>
                          </span>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="text-sm sm:text-base mb-3">
                        Current: {latest?.temperature ?? "-"}°C / Min: 20°C -
                        Max: 30°C
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                        <div
                          className={`h-6 rounded-full transition-all duration-300 ${
                            latest.temperature < 17 || latest.temperature > 30
                              ? "bg-red-500"
                              : latest.temperature < 18 ||
                                latest.temperature > 27
                              ? "bg-yellow-400"
                              : "bg-green-400"
                          }`}
                          style={{ width: tempPercent }}
                        ></div>

                        {/* Tick marks container (unchanged) */}
                        <div className="flex justify-between absolute inset-x-0 top-0 h-6 pointer-events-none">
                          <span className="w-2.5 h-6 bg-gray-700"></span>
                          <span className="w-2 h-6 bg-gray-700"></span>
                          <span className="w-2.5 h-6 bg-gray-700"></span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base mt-1">
                        <span>0°C</span>
                        <span>20°C</span>
                        <span>40°C</span>
                      </div>
                    </div>

                    {/* Humidity */}
                    <div className="rounded-xl p-4 bg-gray-50 shadow-md border-2 border-black">
                      <div className="flex">
                        <h3 className="text-2xl font-semibold mb-2">
                          Kelembapan
                        </h3>
                        {latest.humidity > 60 || latest.humidity < 30 ? (
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75 animate-ping"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400"></span>
                          </span>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="text-sm sm:text-base mb-3">
                        Current: {latest?.humidity ?? "-"}% / Min: 30% - Max:
                        60%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                        <div
                          className={`h-6 rounded-full transition-all duration-300
                          ${
                            latest.humidity < 20 || latest.humidity > 70
                              ? "bg-red-500"
                              : latest.humidity < 30 || latest.humidity > 60
                              ? "bg-yellow-400"
                              : "bg-green-400"
                          }
                        `}
                          style={{ width: humdPercent }}
                        ></div>

                        {/* Tick marks container (unchanged) */}
                        <div className="flex justify-between absolute inset-x-0 top-0 h-6 pointer-events-none">
                          <span className="w-2.5 h-6 bg-gray-700"></span>
                          <span className="w-2 h-6 bg-gray-700"></span>
                          <span className="w-2.5 h-6 bg-gray-700"></span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base mt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>

                  {/* <!-- Overview Table --> */}
                  <div className="w-full rounded-xl bg-gray-50 shadow-md border-2 border-black">
                    <h2 className="text-2xl font-semibold mb-2 px-4 pt-4">
                      Overview
                    </h2>
                    <div className="overflow-x-auto overflow-y-auto h-64 text-sm sm:text-md rounded-b-xl">
                      <table className="w-full table-auto text-left rounded-lg">
                        <thead className="bg-green-400 text-white sticky -top-0.5 z-10 shadow-md text-lg">
                          <tr>
                            <th className="px-4 py-2">Suhu</th>
                            <th className="px-4 py-2">Kelembapan</th>
                            <th className="px-4 py-2">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="text-[1.0625rem]">
                          {values.length > 0 ? (
                            values.map((row, idx) => (
                              <tr key={idx}>
                                <td
                                  className={`px-4 py-2 ${
                                    row.temperature < 17 || row.temperature > 30
                                      ? "bg-red-200/20 text-red-400 font-semibold"
                                      : "text-black"
                                  }`}
                                >
                                  {row.temperature ?? "-"}°C
                                </td>
                                <td
                                  className={`px-4 py-2 ${
                                    row.humidity < 20 || row.humidity > 70
                                      ? "bg-red-200/20 text-red-400 font-semibold"
                                      : "text-black"
                                  }`}
                                >
                                  {row.humidity ?? "-"}%
                                </td>
                                <td className="px-4 py-2">
                                  {new Date(row.timestamp).toLocaleString()}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="3"
                                className="text-center text-gray-500 py-4"
                              >
                                Data belum ada.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
