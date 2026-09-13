"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface RadarStatChartProps {
  stats: {
    lane: number;      // 라인전 (0-100)
    teamfight: number; // 한타 (0-100)
    vision: number;    // 시야 (0-100)
    objective: number; // 오브젝트 (0-100)
    damage: number;    // 딜량 (0-100)
  };
}

export default function RadarStatChart({ stats }: RadarStatChartProps) {
  const data = [
    { subject: "라인전", A: stats.lane, fullMark: 100 },
    { subject: "한타력", A: stats.teamfight, fullMark: 100 },
    { subject: "시야 점수", A: stats.vision, fullMark: 100 },
    { subject: "오브젝트", A: stats.objective, fullMark: 100 },
    { subject: "딜량 비중", A: stats.damage, fullMark: 100 },
  ];

  return (
    <div className="w-full h-56 flex flex-col items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="플레이 스타일"
            dataKey="A"
            stroke="#38bdf8"
            fill="#38bdf8"
            fillOpacity={0.35}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
