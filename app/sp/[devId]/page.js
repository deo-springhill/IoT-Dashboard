"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SumpPit() {
  const { devId } = useParams();
  const [id, setId] = useState(null);
  const [name, setName] = useState(null);
  const [status, setStatus] = useState(null);
  const [values, setValues] = useState([]);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = `${devId} | IoT Monitor`;

    let interval;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/iot/${devId}`);
        if (!res.ok) throw new Error("Bad response");

        const data = await res.json();

        // if id or data invalid
        if (!data || !data.id || !data.catCode?.includes("SP")) {
          setLoading(false);
          setId(null);
          clearInterval(interval);
          return;
        }

        setId(data.id);
        setName(data.name);
        setStatus(data.status);
        setValues(data.transactions || []);
        setLatest(data.transactions?.[0] || null);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch IoT data:", err);
        setLoading(false);
        setId(null);
        clearInterval(interval);
      }
    };

    fetchData();
    interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [devId]);

  // Water height visualization
  let fillPercent = 0;
  let invertFill = 0;

  if (latest && latest.value !== undefined) {
    const max = 200;
    const min = 0;
    const clamped = Math.min(Math.max(latest.value, min), max);
    fillPercent = (clamped / max) * 100;
    invertFill = 100 - fillPercent;
  }

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
            href="/nodes/sp"
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
        <div className="w-3/4 py-10">
          <div className="flex justify-center items-center">
            <div className="w-full max-w-6xl">
              {/* Header */}
              <div className="flex items-center my-4 pb-2 gap-4">
                <Link href={"/nodes/sp/"}>
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
                <div className="text-2xl sm:text-4xl font-bold ml-2">{name}</div>
              </div>

              {/* Dashboard */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Left Panel */}
                <div className="order-2 sm:order-1 space-y-6">
                  {/* Sensor Status */}
                  <div className="w-full border-2 border-gray-600 rounded-xl px-7 py-6 shadow-md">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold">Status Sensor</h3>

                      {status === "Non Critical" ? (
                        <span className="text-xl font-semibold bg-green-400 py-1 px-2 rounded-lg text-white">
                          Normal
                        </span>
                      ) : status === "Critical" ? (
                        <span className="text-xl font-semibold bg-red-400 py-1 px-2 rounded-lg text-white">
                          Critical
                        </span>
                      ) : (
                        <span className="text-xl font-semibold bg-yellow-400 py-1 px-2 rounded-lg text-white">
                          Warning
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold">Device ID</h3>
                      <span className="font-semibold rounded-lg">{id}</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold">Jarak</h3>
                        <span
                          className={
                            latest?.value <= 50
                              ? "font-semibold text-red-400"
                              : "font-semibold text-black"
                          }
                        >
                          {latest?.value !== undefined
                            ? `${latest.value} cm`
                            : "--"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Overview Table */}
                  <div className="w-full border-2 border-gray-600 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold mb-2 px-4 pt-4">
                      Overview
                    </h2>
                    <div className="rounded-b-xl overflow-hidden">
                      <div className="h-80 overflow-y-auto text-sm sm:text-md">
                        <table className="w-full table-auto text-left">
                          <thead className="bg-green-400 sticky top-0 z-10 text-white text-lg">
                            <tr>
                              <th className="px-4 py-2">Jarak</th>
                              <th className="px-4 py-2">Timestamp</th>
                            </tr>
                          </thead>
                          <tbody className="text-[1.0625rem]">
                            {values && values.length > 0 ? (
                              values.map((item, index) => (
                                <tr
                                  className={`${
                                    item.value <= 50
                                      ? "bg-red-200/20"
                                      : "bg-white"
                                  }`}
                                  key={index}
                                >
                                  <td
                                    className={`px-4 py-2 ${
                                      item.value <= 50
                                        ? "text-red-400 font-semibold"
                                        : "text-black"
                                    }`}
                                  >
                                    {item.value} cm
                                  </td>
                                  <td className="px-4 py-2">
                                    {new Date(
                                      item.timestamp
                                    ).toLocaleString()}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan="2"
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

                {/* Right Panel */}
                <div className="order-1 sm:order-2 flex justify-center md:justify-end w-full p-6 rounded-xl border-2 border-black">
                  <div className="flex flex-col items-center space-y-4 flex-1">
                    {latest ? (
                      <>
                        {/* Detail status */}
                        {latest.value === 0 ? (
                          <div className="font-semibold text-sm text-red-400">
                            Water is FULL!
                          </div>
                        ) : latest.value <= 50 ? (
                          <div className="font-semibold text-sm text-red-400">
                            High Level - Almost Full
                          </div>
                        ) : latest.value <= 150 ? (
                          <div className="font-semibold text-sm text-yellow-400">
                            Medium Level - Monitor
                          </div>
                        ) : (
                          <div className="font-semibold text-sm text-green-400">
                            Low Level - Safe
                          </div>
                        )}

                        <div className="flex items-center gap-4">
                          <div className="text-xl font-semibold">
                            Sump Pit Level
                          </div>

                          {latest.value <= 50 ? (
                            <div className="relative flex h-6 w-6">
                              <div className="absolute inline-flex h-6 w-6 rounded-full bg-red-300 opacity-75 animate-ping"></div>
                              <div className="relative inline-flex h-6 w-6 rounded-full bg-red-300"></div>
                            </div>
                          ) : latest.value <= 150 ? (
                            <div className="relative flex h-6 w-6">
                              <div className="absolute inline-flex h-6 w-6 rounded-full bg-yellow-300 opacity-75 animate-ping"></div>
                              <div className="relative inline-flex h-6 w-6 rounded-full bg-yellow-300"></div>
                            </div>
                          ) : (
                            <div className="relative flex h-6 w-6">
                              <div className="absolute inline-flex h-6 w-6 rounded-full bg-green-300 opacity-75 animate-ping"></div>
                              <div className="relative inline-flex h-6 w-6 rounded-full bg-green-300"></div>
                            </div>
                          )}
                        </div>

                        {/* Visualization */}
                        <div className="relative w-full h-80 sm:h-full">
                          <div className="relative w-full h-full border-4 border-gray-600 rounded-3xl overflow-hidden bg-gray-100 shadow-md">
                            <div className="flex justify-center h-full relative">
                              <div
                                className="relative border-l-4 border-dashed border-gray-600"
                                style={{ height: `${fillPercent}%` }}
                              >
                                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap">
                                  {latest.value} cm
                                </span>
                              </div>
                            </div>
                            <div
                              className="absolute bottom-0 w-full bg-blue-500 transition-all duration-500 rounded-b-2xl"
                              style={{ height: `${invertFill}%` }}
                            >
                              <div className="absolute -top-6 w-full h-fit">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 1440 320"
                                  className="w-full h-6"
                                  preserveAspectRatio="none"
                                >
                                  <path
                                    fill="#2b7fff"
                                    fillOpacity="1"
                                    d="M0,128L60,117.3C120,107,240,85,360,101.3C480,117,600,171,720,208C840,245,960,267,1080,234.7C1200,203,1320,117,1380,74.7L1440,32L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-500 text-center">
                        Data belum ada.
                      </div>
                    )}
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
