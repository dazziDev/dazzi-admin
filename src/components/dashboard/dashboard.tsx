import React from "react";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryPie,
  VictoryTheme,
} from "victory";

interface EarningsData {
  quarter: number;
  earnings: number;
}

interface SalesData {
  month: string;
  sales: number;
}

const Dashboard: React.FC = () => {
  // 더미 데이터
  const earningsData: EarningsData[] = [
    { quarter: 1, earnings: 13000 },
    { quarter: 2, earnings: 16500 },
    { quarter: 3, earnings: 14250 },
    { quarter: 4, earnings: 19000 },
  ];

  const salesData: SalesData[] = [
    { month: "Jan", sales: 2000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 1500 },
    { month: "Apr", sales: 2500 },
    { month: "May", sales: 3000 },
    { month: "Jun", sales: 4000 },
  ];

  const pieData = [
    { x: "Product A", y: 35 },
    { x: "Product B", y: 40 },
    { x: "Product C", y: 25 },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="mb-8">환영합니다! 통계 및 분석 정보를 확인하세요.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Quarterly Earnings</h2>
          <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
            <VictoryAxis
              tickValues={[1, 2, 3, 4]}
              tickFormat={["Q1", "Q2", "Q3", "Q4"]}
              label="분기"
              style={{
                axisLabel: { padding: 30, fontSize: 14 },
                tickLabels: { fontSize: 12 },
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(x) => `$${x / 1000}k`}
              label="수익"
              style={{
                axisLabel: { padding: 40, fontSize: 14 },
                tickLabels: { fontSize: 12 },
              }}
            />
            <VictoryBar
              data={earningsData}
              x="quarter"
              y="earnings"
              style={{ data: { fill: "#4CAF50" } }}
              labels={({ datum }) => `$${datum.earnings}`}
              labelComponent={<VictoryLabel dy={-10} />}
            />
          </VictoryChart>
        </div>

        {/* Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Monthly Sales</h2>
          <VictoryChart theme={VictoryTheme.material}>
            <VictoryAxis
              tickFormat={salesData.map((d) => d.month)}
              label="월"
              style={{
                axisLabel: { padding: 30, fontSize: 14 },
                tickLabels: { fontSize: 12 },
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(x) => `$${x / 1000}k`}
              label="판매"
              style={{
                axisLabel: { padding: 40, fontSize: 14 },
                tickLabels: { fontSize: 12 },
              }}
            />
            <VictoryLine
              data={salesData}
              x="month"
              y="sales"
              style={{
                data: { stroke: "#FF5733", strokeWidth: 2 },
              }}
            />
          </VictoryChart>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Product Distribution</h2>
          <VictoryPie
            data={pieData}
            colorScale={["#4CAF50", "#FF5733", "#FFBD33"]}
            labels={({ datum }) => `${datum.x}: ${datum.y}%`}
            style={{
              labels: { fontSize: 14, fill: "#333" },
            }}
          />
        </div>

        {/* Additional Chart - Add any other charts as needed */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Additional Metrics</h2>
          <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
            {/* Add any chart type */}
          </VictoryChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
