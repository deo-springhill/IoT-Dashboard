import Link from "next/link";

export default function Smoke() {
  return (
    <div className="flex items-center justify-center px-3">
      <div className="w-5/6 sm:w-3/4 overflow-y-auto py-10">
        <div className="p-0 sm:p-4">
          {/* Contents */}
          <div className="px-0 py-2 sm:px-8">
            <div className="flex flex-col md:flex-row items-center mb-4 gap-6">
              <Link href={"/nodes/temperature/"}>
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
                  <div className="text-2xl sm:text-3xl font-bold">Smoke Sensor 1</div>
                    <span className="text-xl sm:text-2xl font-semibold bg-red-400 py-1 px-2 rounded-lg text-white">
                      Critical
                    </span>
                </div>
                <div className="text-lg sm:text-md">Device ID</div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              {/* Dashboard Wrapper */}
              <div className="w-full max-w-6xl">
                <div className="bg-gray-50 shadow-md rounded-xl px-8 pb-10 mb-8 border-2 border-black">
                  <div className="mb-2 flex flex-col justify-center">
                    <div className="flex justify-center pt-8">
                      <span className="font-bold text-2xl text-center">
                        Air Quality is 167
                      </span>
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75 animate-ping"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400"></span>
                      </span>
                    </div>
                    <span className="text-md text-center text-red-400">
                      Air quality is bad!
                    </span>
                  </div>

                  {/* Smoke indicator bar */}
                  <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                    <div
                      className="bg-red-500 h-4 rounded-full transition-all duration-300"
                      style={{ width: "83.5%" }}
                    ></div>

                    {/* Tick marks container */}
                    <div className="flex justify-between absolute inset-x-0 top-0 h-4 pointer-events-none">
                      <span className="w-1.5 h-4 bg-gray-700"></span>
                      <span className="w-1 h-4 bg-gray-700"></span>
                      <span className="w-1 h-4 bg-gray-700"></span>
                      <span className="w-1 h-4 bg-gray-700"></span>
                      <span className="w-1.5 h-4 bg-gray-700"></span>
                    </div>
                  </div>

                  {/* Value indicator */}
                  <div className="flex justify-between text-sm sm:text-md mt-1">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                    <span>150</span>
                    <span>200</span>
                    {/* Above 150 should be alarm  */}
                  </div>
                </div>

                {/* <!-- Overview Table --> */}
                <div className="w-full rounded-xl bg-gray-50 shadow-md border-2 border-black">
                  <h2 className="text-xl font-semibold mb-2 px-4 pt-4">
                    Overview
                  </h2>
                  <div className="overflow-x-auto overflow-y-auto h-60 text-sm sm:text-md rounded-b-xl">
                    <table className="w-full table-auto text-left rounded-lg">
                      <thead className="bg-green-400 sticky top-0 z-10 text-white text-lg">
                        <tr>
                          <th className="px-4 py-2">Air Quality</th>
                          <th className="px-4 py-2">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="text-[1.0625rem]">
                        <tr className="bg-red-200/20">
                          <td className="px-4 py-2 text-red-400 font-semibold">
                            167
                          </td>
                          <td className="px-4 py-2">2025-05-20 12:45</td>
                        </tr>
                        <tr className="bg-red-200/20">
                          <td className="px-4 py-2 text-red-400 font-semibold">
                            150
                          </td>
                          <td className="px-4 py-2">2025-05-20 12:45</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
