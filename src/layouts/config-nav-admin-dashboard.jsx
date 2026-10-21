import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard-2'),
  parameter: icon('ic-parameter'),
  terms: icon('ic-file'),
  privacy: icon('ic-lock'),
  faqs: icon('ic-faqs'),
  about: icon('ic-tour'),
  contact: icon('ic-contact'),
  support: icon('ic-chat'),
  helpCenter: icon('ic-help-center'),
};

// ----------------------------------------------------------------------

export const navDataAdmin = [
  {
    subheader: '',
    items: [{ title: 'Dashboard', path: paths.adminDashboard.root, icon: ICONS.dashboard }],
  },
  {
    items: [
      { title: 'Customers', path: paths.adminDashboard.customers.root, icon: ICONS.user, deepMatch: true },
      { title: 'Sellers', path: paths.adminDashboard.sellers.root, icon: ICONS.job, deepMatch: true },
      { title: 'Pending Sellers', path: paths.adminDashboard.pendingSellers, icon: ICONS.lock },
      { title: 'Products', path: paths.adminDashboard.products.root, icon: ICONS.product, deepMatch: true },
      { title: 'Categories', path: paths.adminDashboard.categories, icon: ICONS.label },
      { title: 'Events', path: paths.adminDashboard.events, icon: ICONS.calendar },
      { title: 'Orders', path: paths.adminDashboard.orders.root, icon: ICONS.order, deepMatch: true },
      { title: 'Transactions', path: paths.adminDashboard.transactions, icon: ICONS.invoice },
      { title: 'Chat AI Stats', path: paths.adminDashboard.chatAiStats, icon: ICONS.analytics },
      // { title: 'Reviews', path: paths.adminDashboard.reviews, icon: ICONS.blog },
      { title: 'Notifications', path: paths.adminDashboard.notifications, icon: ICONS.mail },
      {
        title: 'Settings',
        path: paths.adminDashboard.settings.root,
        icon: ICONS.parameter,
        children: [
          { title: 'Support', path: paths.adminDashboard.settings.support },
          { title: 'FAQs', path: paths.adminDashboard.settings.faqs },
          { title: 'Help Center', path: paths.adminDashboard.settings.helpCenter, deepMatch: true },
          { title: 'Privacy Policy', path: paths.adminDashboard.settings.privacy },
          { title: 'Terms of Service', path: paths.adminDashboard.settings.terms },
          { title: 'About Us', path: paths.adminDashboard.settings.about },
        ],
      },
    ],
  },
];
