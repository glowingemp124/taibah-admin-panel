import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { CONFIG } from 'src/config-global';
import { paths } from 'src/routes/paths';

import { Chart, ChartLegends, useChart } from 'src/components/chart';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';
import { stylesMode, varAlpha } from 'src/theme/styles';
import { fNumber, fPercent } from 'src/utils/format-number';

import { CHAT_AI_STATS } from './mock/stats';

// ----------------------------------------------------------------------

const formatKpiValue = (item) => {
  if (item.format === 'sar') {
    return `SAR ${fNumber(item.value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  return fNumber(item.value);
};

function KpiCard({ item }) {
  const theme = useTheme();
  const color = item.color || 'primary';
  const down = item.percent < 0;
  const palette = theme.vars.palette[color];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: [palette.main],
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.64,
        opacityTo: 0.08,
        stops: [0, 100],
      },
    },
    stroke: { width: 2.5, curve: 'smooth' },
    tooltip: {
      y: { formatter: (value) => fNumber(value), title: { formatter: () => '' } },
    },
  });

  return (
    <Card
      sx={{
        p: 3,
        pb: 1,
        overflow: 'hidden',
        position: 'relative',
        bgcolor: varAlpha(palette.mainChannel, 0.08),
        boxShadow: 'none',
        border: `1px solid ${varAlpha(palette.mainChannel, 0.16)}`,
      }}
    >
      <SvgColor
        src={`${CONFIG.site.basePath}/assets/background/shape-square.svg`}
        sx={{
          top: -28,
          right: -20,
          width: 180,
          height: 180,
          opacity: 0.16,
          position: 'absolute',
          color: `${color}.main`,
        }}
      />

      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2.5 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: `${color}.dark`,
            bgcolor: varAlpha(palette.mainChannel, 0.16),
            [stylesMode.dark]: { color: `${color}.light` },
          }}
        >
          <Iconify icon={item.icon} width={26} />
        </Box>

        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          sx={{
            px: 1,
            py: 0.5,
            borderRadius: 1,
            typography: 'subtitle2',
            color: down ? 'error.main' : 'success.main',
            bgcolor: varAlpha(theme.vars.palette[down ? 'error' : 'success'].mainChannel, 0.16),
          }}
        >
          <Iconify width={16} icon={down ? 'eva:trending-down-fill' : 'eva:trending-up-fill'} />
          {item.percent > 0 ? '+' : ''}
          {fPercent(item.percent)}
        </Stack>
      </Stack>

      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        {item.title}
      </Typography>

      <Typography variant="h3" sx={{ mt: 0.5 }}>
        {formatKpiValue(item)}
      </Typography>

      <Chart type="area" series={[{ data: item.sparkline }]} options={chartOptions} height={64} sx={{ mx: -1 }} />
    </Card>
  );
}

function UsageTrendCard({ trend }) {
  const theme = useTheme();

  const chartOptions = useChart({
    colors: [theme.palette.primary.main],
    stroke: { width: 0 },
    xaxis: { categories: trend.categories },
    tooltip: {
      y: {
        formatter: (value) => `${fNumber(value)} conversations`,
        title: { formatter: () => '' },
      },
    },
    plotOptions: { bar: { columnWidth: '42%', borderRadius: 4 } },
  });

  return (
    <Card>
      <CardHeader title="AI Usage Trend" subheader="Daily conversation volume" />
      <Chart type="bar" series={[{ name: 'Conversations', data: trend.series }]} options={chartOptions} height={320} sx={{ px: 1, pb: 2 }} />
    </Card>
  );
}

function FeatureUsageCard({ features }) {
  const theme = useTheme();
  const series = features.map((item) => item.value);
  const labels = features.map((item) => item.shortLabel);
  const total = series.reduce((sum, value) => sum + value, 0);

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: [theme.palette.primary.main, theme.palette.info.main, theme.palette.warning.main, theme.palette.success.main],
    labels,
    stroke: { width: 0 },
    tooltip: {
      y: {
        formatter: (value) => fNumber(value),
        title: { formatter: (name) => `${name}` },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            value: { formatter: (value) => fNumber(value) },
            total: {
              formatter: (w) => fNumber(w.globals.seriesTotals.reduce((a, b) => a + b, 0)),
            },
          },
        },
      },
    },
  });

  return (
    <Card>
      <CardHeader title="Feature Usage" subheader="Product descriptions · Islamic captions · Customer replies · General chat" />

      <Box
        sx={{
          display: 'grid',
          alignItems: 'center',
          gridTemplateColumns: { xs: '1fr', md: 'auto 1fr' },
          gap: 3,
          px: 3,
          pb: 3,
        }}
      >
        <Chart type="donut" series={series} options={chartOptions} width={240} height={240} sx={{ mx: 'auto' }} />

        <Stack spacing={2.5}>
          {features.map((item, index) => (
            <Box key={item.key}>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                <Typography variant="subtitle2">{item.label}</Typography>
                <Typography variant="subtitle2">{fPercent((item.value / total) * 100)}</Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={(item.value / total) * 100}
                color="primary"
                sx={{
                  height: 8,
                  borderRadius: 1,
                  bgcolor: 'background.neutral',
                  '& .MuiLinearProgress-bar': { bgcolor: chartOptions.colors[index] },
                }}
              />
            </Box>
          ))}
        </Stack>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />
      <ChartLegends labels={labels} colors={chartOptions.colors} sx={{ p: 3, justifyContent: 'center' }} />
    </Card>
  );
}

function QualityCard({ title, value, helper, progress, color = 'primary' }) {
  return (
    <Card sx={{ p: 3, height: 1 }}>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        {title}
      </Typography>

      <Typography variant="h3" sx={{ mt: 1, mb: 2 }}>
        {value}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={progress}
        color={color}
        sx={{ height: 10, borderRadius: 1, bgcolor: 'background.neutral' }}
      />

      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        {helper}
      </Typography>
    </Card>
  );
}

export function ChatAiStatsView() {
  const stats = CHAT_AI_STATS;
  const responseProgress = Math.min(100, Math.round((1.2 / stats.avgResponseSeconds) * 100));

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, pt: 3, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Chat AI Stats"
        links={[{ name: 'Dashboard', href: paths.adminDashboard.root }, { name: 'Chat AI Stats' }]}
        action={<Label variant="soft">{stats.periodLabel}</Label>}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          mb: 3,
        }}
      >
        {stats.kpis.map((item) => (
          <KpiCard key={item.key} item={item} />
        ))}
      </Box>

      <Box sx={{ mb: 3 }}>
        <UsageTrendCard trend={stats.usageTrend} />
      </Box>

      <Box sx={{ mb: 3 }}>
        <FeatureUsageCard features={stats.features} />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
        }}
      >
        <QualityCard
          title="Success Rate"
          value={fPercent(stats.successRate)}
          progress={stats.successRate}
          color="success"
          helper="Share of AI replies that completed without retry or fallback."
        />
        <QualityCard
          title="Avg. Response Time"
          value={`${stats.avgResponseSeconds}s`}
          progress={responseProgress}
          helper="Average time for Taibah AI to return a product description, caption, or customer reply."
        />
      </Box>
    </Box>
  );
}
