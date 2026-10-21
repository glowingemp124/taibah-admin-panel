import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

const icon = (name) => <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  user: icon('ic-user'),
  order: icon('ic-order'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  dashboard: icon('ic-dashboard-2'),
  parameter: icon('ic-parameter'),
  faqs: icon('ic-faqs'),
  support: icon('ic-chat'),
  helpCenter: icon('ic-help-center'),
};

export const navData = [
  {
    subheader: '',
    items: [{ title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard }],
  },
  {
    items: [
      { title: 'Products', path: paths.dashboard.products.root, icon: ICONS.product, deepMatch: true },
      { title: 'Orders', path: paths.dashboard.orders.root, icon: ICONS.order, deepMatch: true },
      // { title: 'Events', path: paths.dashboard.events, icon: ICONS.calendar },
      { title: 'Transactions', path: paths.dashboard.transactions, icon: ICONS.invoice },
      { title: 'Customers', path: paths.dashboard.customers, icon: ICONS.user },
      { title: 'Reviews', path: paths.dashboard.reviews, icon: ICONS.file },
      { title: 'Store Settings', path: paths.dashboard.storeSettings, icon: ICONS.parameter },
      {
        title: 'Settings',
        path: paths.dashboard.settings.root,
        icon: ICONS.parameter,
        children: [
          { title: 'Support', path: paths.dashboard.settings.support },
          { title: 'FAQs', path: paths.dashboard.settings.faqs },
          { title: 'Help Center', path: paths.dashboard.settings.helpCenter, deepMatch: true },
          { title: 'Privacy Policy', path: paths.dashboard.settings.privacy },
          { title: 'Terms of Service', path: paths.dashboard.settings.terms },
          { title: 'About Us', path: paths.dashboard.settings.about },
        ],
      },
    ],
  },
];
