import { paramCase } from 'src/utils/change-case';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
  ADMIN_DASHBOARD: '/admin-dashboard',
  SUPER_ADMIN_DASHBOARD: '/super-admin-dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneStore: 'https://mui.com/store/items/zone-landing-page/',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figma: 'https://www.figma.com/design/cAPz4pYPtQEXivqe11EcDE/%5BPreview%5D-Minimal-Web.v6.0.0',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id) => `/product/${id}`,
    demo: { details: `/product/${MOCK_ID}` },
  },
  post: {
    root: `/post`,
    details: (title) => `/post/${paramCase(title)}`,
    demo: { details: `/post/${paramCase(MOCK_TITLE)}` },
  },
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/sign-in`,
      signUp: `${ROOTS.AUTH}/sign-up`,
      forgetPassword: `${ROOTS.AUTH}/forget-password`,
      verifyPassword: `${ROOTS.AUTH}/verify-password`,
      resetPassword: `${ROOTS.AUTH}/reset-password`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  authDemo: {
    split: {
      signIn: `${ROOTS.AUTH_DEMO}/split/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/split/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/split/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/split/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/split/verify`,
    },
    centered: {
      signIn: `${ROOTS.AUTH_DEMO}/centered/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/centered/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/centered/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/centered/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/centered/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    sample: `${ROOTS.DASHBOARD}/sample`,
    wallets: `${ROOTS.DASHBOARD}/wallets`,
    transactions: `${ROOTS.DASHBOARD}/transactions`,
    income: `${ROOTS.DASHBOARD}/category/income`,
    expense: `${ROOTS.DASHBOARD}/category/expense`,
    profile: `${ROOTS.DASHBOARD}/profile`,
    // category: {
    //   app: `${ROOTS.DASHBOARD}/app`,
    //   income: `${ROOTS.DASHBOARD}/income`,
    //   expense: `${ROOTS.DASHBOARD}/expense`,
    // },

    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
      course: `${ROOTS.DASHBOARD}/course`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      pending: `${ROOTS.DASHBOARD}/user/pending-users`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      },
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      details: (id) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
      },
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}`,
      edit: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}/edit`,
      },
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
      },
    },
    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      },
    },
    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
      },
    },
  },
  // ADMIN DASHBOARD
  adminDashboard: {
    root: ROOTS.ADMIN_DASHBOARD,
    categories: `${ROOTS.ADMIN_DASHBOARD}/categories`,
    events: `${ROOTS.ADMIN_DASHBOARD}/events`,
    products: {
      root: `${ROOTS.ADMIN_DASHBOARD}/products`,
      new: `${ROOTS.ADMIN_DASHBOARD}/products/new`,
      details: (id) => `${ROOTS.ADMIN_DASHBOARD}/products/${id}`,
      edit: (id) => `${ROOTS.ADMIN_DASHBOARD}/products/${id}/edit`,
    },
    orders: {
      root: `${ROOTS.ADMIN_DASHBOARD}/orders`,
      details: (id) => `${ROOTS.ADMIN_DASHBOARD}/orders/${id}`,
    },
    transactions: `${ROOTS.ADMIN_DASHBOARD}/transactions`,
    chatAiStats: `${ROOTS.ADMIN_DASHBOARD}/chat-ai-stats`,
    users: {
      root: `${ROOTS.ADMIN_DASHBOARD}/users`,
      details: (id) => `${ROOTS.ADMIN_DASHBOARD}/users/${id}`,
    },
    reviews: `${ROOTS.ADMIN_DASHBOARD}/reviews`,
    notifications: `${ROOTS.ADMIN_DASHBOARD}/notifications`,
    profile: `${ROOTS.ADMIN_DASHBOARD}/profile`,
    settings: {
      root: `${ROOTS.ADMIN_DASHBOARD}/settings`,
      support: `${ROOTS.ADMIN_DASHBOARD}/settings/support`,
      faqs: `${ROOTS.ADMIN_DASHBOARD}/settings/faqs`,
      helpCenter: `${ROOTS.ADMIN_DASHBOARD}/settings/help-center`,
      helpCenterDetails: (id) => `${ROOTS.ADMIN_DASHBOARD}/settings/help-center/${id}`,
      privacy: `${ROOTS.ADMIN_DASHBOARD}/settings/privacy`,
      terms: `${ROOTS.ADMIN_DASHBOARD}/settings/terms`,
      about: `${ROOTS.ADMIN_DASHBOARD}/settings/about`,
    },
    support: `${ROOTS.ADMIN_DASHBOARD}/settings/support`,
    faqs: `${ROOTS.ADMIN_DASHBOARD}/settings/faqs`,
    privacy: `${ROOTS.ADMIN_DASHBOARD}/settings/privacy`,
    terms: `${ROOTS.ADMIN_DASHBOARD}/settings/terms`,
    about: `${ROOTS.ADMIN_DASHBOARD}/settings/about`,
    content: {
      terms: `${ROOTS.ADMIN_DASHBOARD}/settings/terms`,
      privacy: `${ROOTS.ADMIN_DASHBOARD}/settings/privacy`,
      faqs: `${ROOTS.ADMIN_DASHBOARD}/settings/faqs`,
      about: `${ROOTS.ADMIN_DASHBOARD}/settings/about`,
      support: `${ROOTS.ADMIN_DASHBOARD}/settings/support`,
      helpCenter: `${ROOTS.ADMIN_DASHBOARD}/settings/help-center`,
      helpCenterDetails: (id) => `${ROOTS.ADMIN_DASHBOARD}/settings/help-center/${id}`,
    },
  },
};
