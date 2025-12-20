import { AlertCircle, Droplet, ThermometerSun, Beaker } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function Analytics() {
  // Static placeholder data
  const mockStats = {
    ph: {
      avg: "7.20",
      min: "6.80",
      max: "7.50",
    },
    temperature: {
      avg: "25.5",
      min: "24.0",
      max: "27.0",
    },
    tds: {
      avg: 320,
      min: 280,
      max: 350,
    },
  };

  const hasData = false; // Always false for prototype

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-sm text-gray-600">
            [Placeholder] data points collected
          </p>
        </div>
        <div className="flex gap-2">
          <button className="border-2 border-black px-3 py-1.5 text-sm font-bold hover:bg-gray-100">
            CSV
          </button>
          <button className="border-2 border-black px-3 py-1.5 text-sm font-bold hover:bg-gray-100">
            XLSX
          </button>
          <button className="border-2 border-black px-3 py-1.5 text-sm font-bold hover:bg-gray-100">
            Clear Data
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Droplet className="w-4 h-4" />
              pH Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg:</span>
                <span className="font-bold">{mockStats.ph.avg}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Min:</span>
                <span className="font-bold">{mockStats.ph.min}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Max:</span>
                <span className="font-bold">{mockStats.ph.max}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ThermometerSun className="w-4 h-4" />
              Temp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg:</span>
                <span className="font-bold">{mockStats.temperature.avg}°C</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Min:</span>
                <span className="font-bold">{mockStats.temperature.min}°C</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Max:</span>
                <span className="font-bold">{mockStats.temperature.max}°C</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Beaker className="w-4 h-4" />
              TDS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg:</span>
                <span className="font-bold">{mockStats.tds.avg} ppm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Min:</span>
                <span className="font-bold">{mockStats.tds.min} ppm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Max:</span>
                <span className="font-bold">{mockStats.tds.max} ppm</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Placeholders */}
      {!hasData && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="w-5 h-5" />
                pH Level Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] border-2 border-dashed border-gray-400 flex items-center justify-center">
                <p className="text-gray-600 font-bold">[CHART PLACEHOLDER]</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ThermometerSun className="w-5 h-5" />
                Temperature Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] border-2 border-dashed border-gray-400 flex items-center justify-center">
                <p className="text-gray-600 font-bold">[CHART PLACEHOLDER]</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="w-5 h-5" />
                TDS Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] border-2 border-dashed border-gray-400 flex items-center justify-center">
                <p className="text-gray-600 font-bold">[CHART PLACEHOLDER]</p>
              </div>
            </CardContent>
          </Card>

          {/* Data Table Placeholder */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Readings</CardTitle>
                <div className="flex gap-2">
                  <button className="border-2 border-black px-2 py-1 text-xs font-bold">
                    CSV
                  </button>
                  <button className="border-2 border-black px-2 py-1 text-xs font-bold">
                    XLSX
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-black">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-black bg-gray-100">
                      <th className="text-left p-2 font-bold">Timestamp</th>
                      <th className="text-right p-2 font-bold">pH</th>
                      <th className="text-right p-2 font-bold">Temp</th>
                      <th className="text-right p-2 font-bold">TDS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="p-2">[Timestamp]</td>
                      <td className="text-right p-2">7.20</td>
                      <td className="text-right p-2">25.5°C</td>
                      <td className="text-right p-2">320 ppm</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2">[Timestamp]</td>
                      <td className="text-right p-2">7.15</td>
                      <td className="text-right p-2">25.3°C</td>
                      <td className="text-right p-2">315 ppm</td>
                    </tr>
                    <tr>
                      <td className="p-2">[Timestamp]</td>
                      <td className="text-right p-2">7.25</td>
                      <td className="text-right p-2">25.7°C</td>
                      <td className="text-right p-2">325 ppm</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* No Data Message - Alternative view */}
      {hasData && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-600">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-bold">No data available yet</p>
              <p className="text-sm mt-2">
                Data will appear here once the logging function starts
                collecting sensor readings
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
