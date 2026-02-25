"use client";

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
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

interface ResponseBarChartProps {
	question: AggregatedQuestion;
}

export function ResponseBarChart({ question }: ResponseBarChartProps) {
	const chartData = question.options.map((option) => ({
		name: option.option_text,
		Count: option.count,
		Percentage: parseFloat(option.percentage.toFixed(2)),
	}));

	return (
		<Card className="w-full hover:ring ring-ring">
			<CardHeader>
				<CardTitle className="text-lg">
					{question.question_text}
				</CardTitle>
				<CardDescription>
					Total Answers: {question.total_answers} | Type:{" "}
					{question.question_type}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={300}>
					<BarChart data={chartData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="name"
							angle={-45}
							textAnchor="end"
							height={100}
						/>
						<YAxis />
						<Tooltip
							formatter={(value) => {
								if (typeof value === "number")
									return value.toFixed(2);
								return value;
							}}
						/>
						<Legend />
						<Bar dataKey="Count" fill="#3b82f6" />
						<Bar dataKey="Percentage" fill="#10b981" />
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
