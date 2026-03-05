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
		<Card className="w-full hover:ring ring-ring">
			<CardHeader>
				<CardTitle className="text-base sm:text-lg">
					{question.question_text}
				</CardTitle>
				<CardDescription>
					Total Answers: {question.total_answers} | Type:{" "}
					{question.question_type}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="overflow-x-auto">
					<div className="min-w-[280px]">
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={chartData}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ value }) => `${value}%`}
									outerRadius={80}
									dataKey="value"
								>
									{chartData.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip
									formatter={(value, name, props) => {
										if (name === "value") {
											return `${value}%`;
										}
										return value;
									}}
									content={({ active, payload }) => {
										if (
											active &&
											payload &&
											payload.length
										) {
											const data = payload[0].payload;
											return (
												<div className="bg-white p-2 border border-gray-300 rounded shadow">
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
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</div>{" "}
				</div>
			</CardContent>
		</Card>
	);
}
