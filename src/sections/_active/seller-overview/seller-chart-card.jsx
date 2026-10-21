import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';

import { Chart, ChartLegends, useChart } from 'src/components/chart';
import { fNumber } from 'src/utils/format-number';

export function SellerChartCard({ title, subheader, action, type = 'line', chart, sx, ...other }) {
  const theme = useTheme();
  const isPie = type === 'pie';
  const isBar = type === 'bar';
  const isHorizontal = isBar && Boolean(chart.horizontal);

  const chartColors = chart.colors ?? [theme.palette.primary.main];

  const multiSeries = !isPie && Array.isArray(chart.series) && chart.series.length > 1;

  const chartOptions = useChart({
    colors: chartColors,
    ...(isPie ? { labels: chart.labels } : {}),
    legend: { show: false },
    stroke: isPie
      ? { width: 2, colors: [theme.vars.palette.background.paper] }
      : isBar
        ? { width: 2, colors: ['transparent'] }
        : { width: 3, curve: 'smooth' },
    markers: type === 'line' ? { size: 4 } : { size: 0 },
    xaxis: chart.categories ? { categories: chart.categories } : undefined,
    tooltip: {
      y: {
        formatter: (value) => fNumber(value),
        title: { formatter: (seriesName) => seriesName || '' },
      },
    },
    dataLabels: isPie
      ? {
          enabled: true,
          dropShadow: { enabled: false },
          formatter: (value) => `${Number(value).toFixed(1)}%`,
        }
      : { enabled: false },
    ...(isBar
      ? {
          chart: { type: 'bar' },
          plotOptions: {
            bar: isHorizontal
              ? { horizontal: true, borderRadius: 2, barHeight: '48%' }
              : { horizontal: false, borderRadius: 4, columnWidth: multiSeries ? '55%' : '42%' },
          },
        }
      : {}),
    ...(isPie ? { chart: { sparkline: { enabled: true } }, plotOptions: { pie: { donut: { labels: { show: false } } } } } : {}),
  });

  return (
    <Card sx={{ height: 1, width: 1, display: 'flex', flexDirection: 'column', ...sx }} {...other}>
      <CardHeader title={title} subheader={subheader} action={action} sx={{ pb: 0 }} />

      {isPie ? (
        <>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 1 }}>
            <Chart type="pie" series={chart.series} options={chartOptions} width={220} height={220} />
          </Box>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <ChartLegends labels={chartOptions?.labels} colors={chartOptions?.colors} sx={{ p: 2, justifyContent: 'center' }} />
        </>
      ) : (
        <>
          <Chart
            key={`${type}-${(chart.categories || []).join('|')}`}
            type={isBar ? 'bar' : 'line'}
            series={chart.series}
            options={chartOptions}
            height={360}
            sx={{ py: 2.5, pl: 1, pr: 2.5 }}
          />
          {multiSeries ? (
            <>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <ChartLegends
                labels={(chart.series || []).map((item) => item.name)}
                colors={chartOptions?.colors}
                sx={{ p: 2, justifyContent: 'center' }}
              />
            </>
          ) : null}
        </>
      )}
    </Card>
  );
}

SellerChartCard.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  action: PropTypes.node,
  type: PropTypes.oneOf(['line', 'bar', 'pie']),
  chart: PropTypes.object,
  sx: PropTypes.object,
};
