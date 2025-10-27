"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/iotCat");
        if (res.status === 304) {
          console.log("No changes detected");
          return;
        }
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    // const interval = setInterval(fetchCategories, 5000);

    // return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 sm:p-6 h-auto min-h-screen">
      {/* Left */}
      <div className="w-full">
        <div className="bg-white shadow-md my-2 rounded-xl p-2 flex items-center justify-between">
          <h1 className="px-5 py-2 text-2xl sm:text-3xl font-bold">
            Command Center
          </h1>

          <Link
            className="flex flex-col sm:flex-row px-5 gap-2 sm:gap-6"
            href="/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="h-12 w-12 rounded-md bg-green-300 duration-300 hover:bg-green-400 shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="w-full h-full text-white p-1"
              >
                <path
                  fillRule="evenodd"
                  d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0z"
                />
              </svg>
            </div>
          </Link>
        </div>

        {/* Category details */}
        <div className="flex flex-wrap p-5 mb-4 items-center justify-start gap-4 sm:gap-6">
          <div className="flex items-center gap-2 text-sm">
            <div className="h-8 w-12 bg-green-300"></div>
            Normal
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-8 w-12 bg-yellow-300"></div>
            Warning
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-8 w-12 bg-red-300"></div>
            Critical
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="rounded-full bg-gray-600 text-white px-3.5 py-2">
              0
            </span>
            Tidak ada masalah
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="rounded-full bg-gray-600 text-white px-3.5 py-2">
              9
            </span>
            Jumlah masalah
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="rounded-full bg-gray-600 text-white px-3.5 py-2">
              &gt;
            </span>
            Jumlah masalah lebih dari 99
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48 w-full">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-400 border-t-transparent mb-2"></div>
              <p className="text-gray-600 font-semibold">Loading data...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {categories.map((cat) => {
              let color = "green";
              let hasPing = false;

              if (cat.criticalCount > 0) {
                color = "red";
                hasPing = true; // critical = red + ping
              } else if (cat.warningCount > 0) {
                color = "yellow"; // warning = yellow, no ping
              }

              return (
                <div
                  key={cat.code}
                  className="relative flex items-center justify-center"
                >
                  {hasPing && (
                    <span
                      className={`absolute h-[70%] w-[55%] rounded-lg bg-${color}-400 opacity-85 animate-ping z-0`}
                    ></span>
                  )}

                  <Link
                    href={`/nodes/${cat.code.toLowerCase()}`}
                    className={`bg-${color}-300 hover:bg-${color}-400 border-4 border-${color}-400 h-full w-full transition-colors duration-300 uppercase font-bold shadow-md p-4 rounded-xl text-white block z-10`}
                  >
                    <div className="flex flex-col justify-between h-full">
                      <p className="text-xl md:text-2xl text-center break-words drop-shadow-md my-auto">
                        {cat.name}
                      </p>
                      <span className="absolute -bottom-2 -right-2 group-hover:z-20">
                        <span className="relative flex h-8 w-8 items-center justify-center">
                          <span className="rounded-full text-sm bg-gray-600 text-white px-3.5 py-2">
                            {cat.totalIssues}
                          </span>
                        </span>
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
