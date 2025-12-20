import type { SensorLog } from "../types/index";

/**
 * Export sensor logs to CSV format
 * @param logs - Array of sensor logs to export
 * @param filename - Optional filename (default: aquarium-data-{timestamp}.csv)
 */
export function exportToCSV(logs: SensorLog[], filename?: string) {
  if (logs.length === 0) {
    console.warn("No data to export");
    return;
  }

  // CSV headers
  const headers = ["Timestamp", "pH", "Temperature (°C)", "TDS (ppm)"];

  // CSV rows
  const rows = logs.map((log) => [
    new Date(log.timestamp).toLocaleString(),
    log.ph.toFixed(2),
    log.temperature.toFixed(1),
    log.tds.toString(),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  const defaultFilename = `aquarium-data-${
    new Date().toISOString().split("T")[0]
  }.csv`;
  link.setAttribute("href", url);
  link.setAttribute("download", filename || defaultFilename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log(`Exported ${logs.length} records to CSV`);
}

/**
 * Export sensor logs to XLSX format (using a simple XML-based approach)
 * @param logs - Array of sensor logs to export
 * @param filename - Optional filename (default: aquarium-data-{timestamp}.xlsx)
 */
export function exportToXLSX(logs: SensorLog[], filename?: string) {
  if (logs.length === 0) {
    console.warn("No data to export");
    return;
  }

  // Create Excel-compatible XML
  const xmlHeader = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Sensor Data">
  <Table>
   <Row>
    <Cell><Data ss:Type="String">Timestamp</Data></Cell>
    <Cell><Data ss:Type="String">pH</Data></Cell>
    <Cell><Data ss:Type="String">Temperature (°C)</Data></Cell>
    <Cell><Data ss:Type="String">TDS (ppm)</Data></Cell>
   </Row>`;

  const xmlRows = logs
    .map(
      (log) => `
   <Row>
    <Cell><Data ss:Type="String">${new Date(
      log.timestamp
    ).toLocaleString()}</Data></Cell>
    <Cell><Data ss:Type="Number">${log.ph.toFixed(2)}</Data></Cell>
    <Cell><Data ss:Type="Number">${log.temperature.toFixed(1)}</Data></Cell>
    <Cell><Data ss:Type="Number">${log.tds}</Data></Cell>
   </Row>`
    )
    .join("");

  const xmlFooter = `
  </Table>
 </Worksheet>
</Workbook>`;

  const xmlContent = xmlHeader + xmlRows + xmlFooter;

  // Create blob and download
  const blob = new Blob([xmlContent], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  const defaultFilename = `aquarium-data-${
    new Date().toISOString().split("T")[0]
  }.xlsx`;
  link.setAttribute("href", url);
  link.setAttribute("download", filename || defaultFilename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log(`Exported ${logs.length} records to XLSX`);
}
