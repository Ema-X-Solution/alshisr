'use client';

import { useLocale, useTranslations } from 'next-intl';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrdersChartProps {
  data: { date: string; revenue: number; orders: number }[];
}

export function OrdersChart({ data }: OrdersChartProps) {
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
        <CardTitle className="text-base">{t('ordersChart')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip labelStyle={{ color: '#222' }} />
              <Bar dataKey="orders" fill="#C8A24A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
