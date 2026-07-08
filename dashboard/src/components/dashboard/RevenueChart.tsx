'use client';

import { useLocale, useTranslations } from 'next-intl';
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
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const dateLocale = locale === 'ar' ? 'ar-OM' : 'en-OM';

  const chartData = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric' }),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('revenueChart')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}`} />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), t('revenue')]}
                labelStyle={{ color: '#222' }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#5B2C83"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#C8A24A' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
