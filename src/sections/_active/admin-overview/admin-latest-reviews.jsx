import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fDateTime } from 'src/utils/format-time';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

const MAX_VISIBLE_REVIEWS = 3;

export function AdminLatestReviews({ title, subheader, list, sx, ...other }) {
  const visibleReviews = list.slice(0, MAX_VISIBLE_REVIEWS);

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', ...sx }} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar sx={{ flex: 1, minHeight: 0 }}>
        <Box sx={{ p: 3, gap: 2.5, display: 'flex', flexDirection: 'column' }}>
          {visibleReviews.map((item, index) => (
            <Box key={item.id}>
              <ReviewItem item={item} />
              {index < visibleReviews.length - 1 && <Divider sx={{ borderStyle: 'dashed', mt: 2.5 }} />}
            </Box>
          ))}
        </Box>
      </Scrollbar>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 1, textAlign: 'right' }}>
        <Button
          size="small"
          color="inherit"
          component={RouterLink}
          href={paths.adminDashboard.reviews}
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={16} sx={{ ml: -0.5 }} />}
        >
          View all
        </Button>
      </Box>
    </Card>
  );
}

function ReviewItem({ item }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar alt={item.name} src={item.avatarUrl} sx={{ width: 40, height: 40 }} />

        <ListItemText
          primary={item.name}
          secondary={fDateTime(item.postedAt)}
          primaryTypographyProps={{ typography: 'subtitle2', noWrap: true }}
          secondaryTypographyProps={{
            component: 'span',
            typography: 'caption',
            color: 'text.disabled',
          }}
        />
      </Box>

      <Rating value={item.rating} size="small" readOnly precision={0.5} />

      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
        }}
      >
        {item.description}
      </Typography>
    </Box>
  );
}
