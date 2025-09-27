import React from "react";

type CircleChartProps = {
  percent: number; // 퍼센트 (0~100)
  size?: number;   // SVG 크기 (기본 120px)
  stroke?: number; // 선 굵기 (기본 10px)
};

const CircleChart: React.FC<CircleChartProps> = ({ 
  percent, 
  size = 120, 
  stroke = 7 
}) => {
  const radius = (size - stroke) / 2; // 반지름
  const circumference = 2 * Math.PI * radius; // 원 둘레
  const offset = (percent / 100) * circumference; // 반시계

  return (
    <svg width={size} height={size}>
      {/* 파란 진행 원 */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#3b82f6"
        strokeWidth={stroke}
        fill="none"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} // 시작점 12시
      />
      {/* 회색 배경 원 */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e5e7eb"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }} // 애니메이션
        transform={`rotate(-90 ${size / 2} ${size / 2})`} // 시작점 12시
      />
      {/* 중앙 텍스트 */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="15"
        fontWeight="bold"
        fill="#3b82f6"
      >
        {percent}%
      </text>
    </svg>
  );
};

export default CircleChart;