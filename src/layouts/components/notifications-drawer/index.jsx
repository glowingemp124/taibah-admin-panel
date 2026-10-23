import { m } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useAppRole } from 'src/hooks/use-app-role';
import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomTabs } from 'src/components/custom-tabs';
import { EmptyContent } from 'src/components/empty-content';

import { getMockNotifications, markAllMockNotificationsRead, markMockNotificationRead } from 'src/sections/_active/header-notifications/mock';

import { NotificationItem } from './notification-item';

// ----------------------------------------------------------------------

const PAGE_SIZE = 20;

// Where a notification opens. link: { type: 'order' | 'product' | 'seller' | 'store' | 'page', id, href }.
function hrefFor({ type: notificationType, link }, isSeller) {
  if (!link) return null;
  if (link.type === 'page') return link.href || null;
  if (!link.id) return null;

  const appPaths = isSeller ? paths.dashboard : paths.adminDashboard;

  switch (link.type) {
    case 'order':
      return `${appPaths.orders.root}?view=${link.id}`;
    case 'product':
      return appPaths.products.details(link.id);
    case 'seller':
      // An applicant isn't a seller yet: open their review in Pending Sellers.
      if (!isSeller && notificationType === 'seller_application') return `${paths.adminDashboard.pendingSellers}?review=${link.id}`;
      return isSeller ? paths.dashboard.profile : paths.adminDashboard.sellers.details(link.id);
    case 'store':
      // A store is identified by its seller: seller details for admins, store settings for the seller.
      return isSeller ? paths.dashboard.storeSettings : paths.adminDashboard.sellers.details(link.id);
    default:
      return null;
  }
}

// In-app paths go through the router; full URLs open in a new tab.
const isExternal = (href) => /^https?:\/\//.test(href);

// ----------------------------------------------------------------------

export function NotificationsDrawer({ sx, ...other }) {
  const drawer = useBoolean();
  const router = useRouter();
  const { isSeller } = useAppRole();
  const role = isSeller ? 'seller' : 'admin';

  const [currentTab, setCurrentTab] = useState('all');
  const [revision, setRevision] = useState(0);

  // Badge: no /unread-count endpoint, so ask for one row and read meta.unreadCount.
  const fetchUnreadCount = useCallback(() => getMockNotifications(role, { limit: 1 }).meta.unreadCount, [role]);
  const [unreadCount, setUnreadCount] = useState(fetchUnreadCount);

  useEffect(() => {
    setUnreadCount(fetchUnreadCount());
  }, [fetchUnreadCount]);

  // The list: GET …/notifications?status=all|unread&page=0&limit=20. meta.counts doesn't change with the tab.
  const { data: notifications, meta } = useMemo(
    () => (drawer.value ? getMockNotifications(role, { status: currentTab, page: 0, limit: PAGE_SIZE }) : { data: [], meta: { counts: {} } }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [drawer.value, role, currentTab, revision]
  );
  const counts = meta.counts || {};

  const handleOpenDrawer = () => {
    setUnreadCount(fetchUnreadCount());
    drawer.onTrue();
  };

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  // PUT …/notifications/read-all → { unreadCount }
  const handleMarkAllAsRead = () => {
    setUnreadCount(markAllMockNotificationsRead(role).unreadCount);
    setRevision((value) => value + 1);
  };

  // PUT …/notifications/:id/read → { unreadCount }, then open its link.
  const handleOpen = (notification) => {
    if (!notification.isRead) {
      setUnreadCount(markMockNotificationRead(role, notification._id).unreadCount);
      setRevision((value) => value + 1);
    }

    const href = hrefFor(notification, isSeller);
    if (!href) return;

    drawer.onFalse();
    if (isExternal(href)) {
      window.open(href, '_blank', 'noopener');
    } else {
      router.push(href);
    }
  };

  const tabs = [
    { value: 'all', label: 'All', count: counts.all ?? 0 },
    { value: 'unread', label: 'Unread', count: counts.unread ?? unreadCount },
  ];

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Notifications
      </Typography>

      {!!unreadCount && (
        <Tooltip title="Mark all as read">
          <IconButton color="primary" onClick={handleMarkAllAsRead}>
            <Iconify icon="eva:done-all-fill" />
          </IconButton>
        </Tooltip>
      )}

      <IconButton onClick={drawer.onFalse} sx={{ display: { xs: 'inline-flex', sm: 'none' } }}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Stack>
  );

  const renderTabs = (
    <CustomTabs variant="fullWidth" value={currentTab} onChange={handleChangeTab}>
      {tabs.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            <Label variant={tab.value === currentTab ? 'filled' : 'soft'} color={tab.value === 'unread' ? 'info' : 'default'}>
              {tab.count}
            </Label>
          }
        />
      ))}
    </CustomTabs>
  );

  const renderList = notifications.length ? (
    <Scrollbar>
      <Box component="ul">
        {notifications.map((notification) => (
          <Box component="li" key={notification._id} sx={{ display: 'flex' }}>
            <NotificationItem notification={notification} onClick={() => handleOpen(notification)} />
          </Box>
        ))}
      </Box>
    </Scrollbar>
  ) : (
    <EmptyContent title={currentTab === 'unread' ? "You're all caught up" : 'No notifications yet'} sx={{ py: 10 }} />
  );

  return (
    <>
      <IconButton component={m.button} whileTap="tap" whileHover="hover" variants={varHover(1.05)} onClick={handleOpenDrawer} sx={sx} {...other}>
        <Badge badgeContent={unreadCount} color="error">
          <SvgIcon>
            {/* https://icon-sets.iconify.design/solar/bell-bing-bold-duotone/ */}
            <path
              fill="currentColor"
              d="M18.75 9v.704c0 .845.24 1.671.692 2.374l1.108 1.723c1.011 1.574.239 3.713-1.52 4.21a25.794 25.794 0 0 1-14.06 0c-1.759-.497-2.531-2.636-1.52-4.21l1.108-1.723a4.393 4.393 0 0 0 .693-2.374V9c0-3.866 3.022-7 6.749-7s6.75 3.134 6.75 7"
              opacity="0.5"
            />
            <path
              fill="currentColor"
              d="M12.75 6a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0zM7.243 18.545a5.002 5.002 0 0 0 9.513 0c-3.145.59-6.367.59-9.513 0"
            />
          </SvgIcon>
        </Badge>
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 1, maxWidth: 420 } }}
      >
        {renderHead}

        {renderTabs}

        {renderList}
      </Drawer>
    </>
  );
}
