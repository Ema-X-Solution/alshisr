'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface RevenueChartProps {
  data: { date: string; revenue: number; orders: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Revenue (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}`} />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                labelStyle={{ color: '#222' }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#951a1d"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#C8A46B' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
