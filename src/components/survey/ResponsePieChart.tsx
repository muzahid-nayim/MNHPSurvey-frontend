"use client";

import {
	PieChart,
	Pie,
	Cell,
	Legend,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { AggregatedQuestion } from "@/types";

interface ResponsePieChartProps {
	question: AggregatedQuestion;
}

const COLORS = [
	"#3b82f6",
	"#10b981",
	"#f59e0b",
	"#ef4444",
	"#8b5cf6",
	"#ec4899",
	"#14b8a6",
	"#f97316",
];

export function ResponsePieChart({ question }: ResponsePieChartProps) {
	const chartData = question.options.map((option) => ({
		name: option.option_text,
		value: parseFloat(option.percentage.toFixed(2)),
		count: option.count,
	}));

	return (
		<Card className="h-full w-full max-w-full overflow-hidden hover:ring ring-ring">
			<CardHeader className="space-y-1 p-3 sm:p-6">
				<CardTitle className="line-clamp-2 text-sm sm:text-base lg:text-lg">
					{question.question_text}
				</CardTitle>
				<CardDescription className="text-xs sm:text-sm">
					Total Answers: {question.total_answers} | Type:{" "}
					{question.question_type}
				</CardDescription>
			</CardHeader>
			<CardContent className="p-2 pt-0 sm:p-6 sm:pt-0">
				<div className="h-[200px] w-full min-w-0 sm:h-[260px] lg:h-[280px]">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={chartData}
								cx="50%"
								cy="42%"
								labelLine={false}
								label={({ value }) => `${value}%`}
								outerRadius="55%"
								dataKey="value"
							>
								{chartData.map((_, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
							<Tooltip
								content={({ active, payload }) => {
									if (active && payload?.length) {
										const data = payload[0].payload;
										return (
											<div className="rounded border border-gray-300 bg-white p-2 shadow">
												<p className="font-semibold">
													{data.name}
												</p>
												<p className="text-sm">
													{data.value}%
												</p>
												<p className="text-sm text-gray-600">
													Count: {data.count}
												</p>
											</div>
										);
									}
									return null;
								}}
							/>
							<Legend
								wrapperStyle={{ fontSize: 10 }}
								formatter={(value: string) =>
									value.length > 14
										? `${value.slice(0, 13)}…`
										: value
								}
							/>
						</PieChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
