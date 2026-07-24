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

function shortLabel(text: string, max = 12) {
	if (text.length <= max) return text;
	return `${text.slice(0, max - 1)}…`;
}

export function ResponseBarChart({ question }: ResponseBarChartProps) {
	const chartData = question.options.map((option) => ({
		name: option.option_text,
		label: shortLabel(option.option_text),
		Count: option.count,
		Percentage: parseFloat(option.percentage.toFixed(2)),
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
						<BarChart
							data={chartData}
							margin={{ top: 4, right: 4, left: -18, bottom: 4 }}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis
								dataKey="label"
								angle={-30}
								textAnchor="end"
								height={54}
								tick={{ fontSize: 9 }}
								interval={0}
							/>
							<YAxis tick={{ fontSize: 9 }} width={28} />
							<Tooltip
								labelFormatter={(_, payload) => {
									const item = payload?.[0]?.payload;
									return item?.name ?? "";
								}}
							/>
							<Legend wrapperStyle={{ fontSize: 11 }} />
							<Bar dataKey="Count" fill="#3b82f6" />
							<Bar dataKey="Percentage" fill="#10b981" />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
