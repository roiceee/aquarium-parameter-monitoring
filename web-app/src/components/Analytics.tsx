import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  AlertCircle,
  Droplet,
  ThermometerSun,
  Beaker,
  Trash2,
} from "lucide-react";
import type { SensorLog } from "../types/index";
import { fetchSensorLogs, clearSensorLogs } from "../lib/firestoreUtils";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function Analytics() {
  const [logs, setLogs] = useState<SensorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await fetchSensorLogs(500); // Fetch last 500 logs
      setLogs(data.reverse()); // Reverse to show oldest first for chart
    } catch (error) {
      console.error("Failed to load logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    try {
      await clearSensorLogs();
      setLogs([]);
      setShowConfirmDialog(false);
    } catch (error) {
      console.error("Failed to clear logs:", error);
    }
  };

  // Prepare chart data
  const chartData = logs.map((log) => ({
    time: new Date(log.timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    ph: log.ph,
    temperature: log.temperature,
    tds: log.tds,
  }));

  // Calculate statistics
  const stats = {
    ph: {
      avg: logs.length
        ? (logs.reduce((sum, log) => sum + log.ph, 0) / logs.length).toFixed(2)
        : "0",
      min: logs.length ? Math.min(...logs.map((l) => l.ph)).toFixed(2) : "0",
      max: logs.length ? Math.max(...logs.map((l) => l.ph)).toFixed(2) : "0",
    },
    temperature: {
      avg: logs.length
        ? (
            logs.reduce((sum, log) => sum + log.temperature, 0) / logs.length
          ).toFixed(1)
        : "0",
      min: logs.length
        ? Math.min(...logs.map((l) => l.temperature)).toFixed(1)
        : "0",
      max: logs.length
        ? Math.max(...logs.map((l) => l.temperature)).toFixed(1)
        : "0",
    },
    tds: {
      avg: logs.length
        ? Math.round(logs.reduce((sum, log) => sum + log.tds, 0) / logs.length)
        : 0,
      min: logs.length ? Math.min(...logs.map((l) => l.tds)) : 0,
      max: logs.length ? Math.max(...logs.map((l) => l.tds)) : 0,
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with clear button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-sm text-gray-500">
            {logs.length} data points collected
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={() => setShowConfirmDialog(true)}
          disabled={logs.length === 0}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Data
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Droplet className="w-4 h-4 text-cyan-600" />
              pH Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Avg:</span>
                <span className="font-medium">{stats.ph.avg}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Min:</span>
                <span className="font-medium">{stats.ph.min}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Max:</span>
                <span className="font-medium">{stats.ph.max}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ThermometerSun className="w-4 h-4 text-blue-600" />
              Temp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Avg:</span>
                <span className="font-medium">{stats.temperature.avg}°C</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Min:</span>
                <span className="font-medium">{stats.temperature.min}°C</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Max:</span>
                <span className="font-medium">{stats.temperature.max}°C</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Beaker className="w-4 h-4 text-indigo-600" />
              TDS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Avg:</span>
                <span className="font-medium">{stats.tds.avg} ppm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Min:</span>
                <span className="font-medium">{stats.tds.min} ppm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Max:</span>
                <span className="font-medium">{stats.tds.max} ppm</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {logs.length > 0 ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-cyan-600" />
                pH Level Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis domain={[6, 9]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="ph"
                    stroke="#0891b2"
                    strokeWidth={2}
                    dot={false}
                    name="pH Level"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ThermometerSun className="w-5 h-5 text-blue-600" />
                Temperature Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis domain={[20, 30]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                    name="Temperature (°C)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="w-5 h-5 text-indigo-600" />
                TDS Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis domain={[0, 500]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="tds"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={false}
                    name="TDS (ppm)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Readings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Timestamp</th>
                      <th className="text-right p-2">pH</th>
                      <th className="text-right p-2">Temperature</th>
                      <th className="text-right p-2">TDS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs
                      .slice(-20)
                      .reverse()
                      .map((log) => (
                        <tr key={log.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="text-right p-2">
                            {log.ph.toFixed(2)}
                          </td>
                          <td className="text-right p-2">
                            {log.temperature.toFixed(1)}°C
                          </td>
                          <td className="text-right p-2">{log.tds} ppm</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No data available yet</p>
              <p className="text-sm mt-2">
                Data will appear here once the logging function starts
                collecting sensor readings
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                Clear All Data?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                This will permanently delete all {logs.length} sensor log
                entries from the database. This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleClearData}>
                  Delete All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
