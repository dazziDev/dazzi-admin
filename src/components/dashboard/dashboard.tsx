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

interface ArticleViewsData {
  month: string;
  views: number;
}

interface ArticlesWrittenData {
  quarter: number;
  articles: number;
}

interface UserEngagementData {
  x: string;
  y: number;
}

const Dashboard: React.FC = () => {
  // 더미 데이터
  const articleViewsData: ArticleViewsData[] = [
    { month: "1월", views: 8000 },
    { month: "2월", views: 15000 },
    { month: "3월", views: 12000 },
    { month: "4월", views: 14000 },
    { month: "5월", views: 18000 },
    { month: "6월", views: 22000 },
  ];

  const articlesWrittenData: ArticlesWrittenData[] = [
    { quarter: 1, articles: 15 },
    { quarter: 2, articles: 22 },
    { quarter: 3, articles: 18 },
    { quarter: 4, articles: 25 },
  ];

  const userEngagementData: UserEngagementData[] = [
    { x: "좋아요", y: 35 },
    { x: "댓글", y: 20 },
    { x: "공유", y: 45 },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">대시보드</h1>
      <p className="mb-6 text-sm">
        환영합니다! 통계 및 분석 정보를 확인하세요.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">분기별 작성된 기사 수</h2>
          <VictoryChart
            theme={VictoryTheme.material}
            domainPadding={20}
            width={350}
            height={250}
          >
            <VictoryAxis
              tickValues={[1, 2, 3, 4]}
              tickFormat={["Q1", "Q2", "Q3", "Q4"]}
              label="분기"
              style={{
                axisLabel: { padding: 0, fontSize: 10, textAnchor: "middle" },
                tickLabels: { fontSize: 8 },
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(x) => `${x} 기사`}
              label="작성된 기사 수"
              style={{
                axisLabel: { padding: 0, fontSize: 10, textAnchor: "middle" },
                tickLabels: { fontSize: 8 },
              }}
            />
            <VictoryBar
              data={articlesWrittenData}
              x="quarter"
              y="articles"
              style={{ data: { fill: "#4CAF50" } }}
              labels={({ datum }) => `${datum.articles}`}
              labelComponent={<VictoryLabel dy={-10} style={{ fontSize: 8 }} />}
            />
          </VictoryChart>
        </div>

        {/* Line Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">월별 기사 조회수</h2>
          <VictoryChart theme={VictoryTheme.material} width={350} height={250}>
            <VictoryAxis
              tickFormat={articleViewsData.map((d) => d.month)}
              label="월"
              style={{
                axisLabel: { padding: 0, fontSize: 10, textAnchor: "middle" },
                tickLabels: { fontSize: 8 },
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(x) => `${x / 1000}천`}
              label="조회수"
              style={{
                axisLabel: { padding: 0, fontSize: 10, textAnchor: "middle" },
                tickLabels: { fontSize: 8 },
              }}
            />
            <VictoryLine
              data={articleViewsData}
              x="month"
              y="views"
              style={{
                data: { stroke: "#FF5733", strokeWidth: 2 },
              }}
            />
          </VictoryChart>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">유저 참여도</h2>
          <VictoryPie
            data={userEngagementData}
            colorScale={["#4CAF50", "#FF5733", "#FFBD33"]}
            labels={({ datum }) => `${datum.x}: ${datum.y}%`}
            style={{
              labels: { fontSize: 8, fill: "#333" },
            }}
            width={250}
            height={250}
          />
        </div>

        {/* Additional Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">추가 메트릭</h2>
          <VictoryChart
            theme={VictoryTheme.material}
            domainPadding={20}
            width={350}
            height={250}
          >
            <VictoryAxis
              tickValues={[1, 2, 3, 4, 5, 6]}
              tickFormat={["1월", "2월", "3월", "4월", "5월", "6월"]}
              label="월"
              style={{
                axisLabel: { padding: 0, fontSize: 10, textAnchor: "middle" },
                tickLabels: { fontSize: 8 },
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(x) => `${x}%`}
              label="저자 기여도"
              style={{
                axisLabel: { padding: 0, fontSize: 10, textAnchor: "middle" },
                tickLabels: { fontSize: 8 },
              }}
            />
            <VictoryLine
              data={[
                { month: "1월", contribution: 20 },
                { month: "2월", contribution: 25 },
                { month: "3월", contribution: 30 },
                { month: "4월", contribution: 35 },
                { month: "5월", contribution: 40 },
                { month: "6월", contribution: 50 },
              ]}
              x="month"
              y="contribution"
              style={{
                data: { stroke: "#007BFF", strokeWidth: 2 },
              }}
            />
          </VictoryChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
