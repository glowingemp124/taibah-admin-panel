import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const _carouselsMembers = [...Array(6)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  role: _mock.role(index),
  avatarUrl: _mock.image.portrait(index),
}));

// ----------------------------------------------------------------------

export const _faqs = [
  {
    id: 'faq-001',
    value: 'panel1',
    heading: 'How do I track my Taibah order?',
    detail:
      'Open your account, go to Orders, and select the order number (for example NB-102401). You will see the current status, from placed through packed, shipped, and delivered. If the estimated window has passed, contact Support with the order ID.',
  },
  {
    id: 'faq-002',
    value: 'panel2',
    heading: 'Which payment methods does Taibah accept?',
    detail:
      'You can pay by card at checkout or choose cash on delivery where it is offered. Card payments usually confirm immediately. If a card charge shows pending, wait a few minutes and refresh Transactions. Failed payments are not captured and you can retry checkout.',
  },
  {
    id: 'faq-003',
    value: 'panel3',
    heading: 'How long does delivery take in Saudi Arabia?',
    detail:
      'Most orders in major cities arrive within 2–5 business days after the seller ships. Prayer items, modest fashion, and gift boxes are packed by the vendor, so timing can vary during Ramadan and Eid. You will receive updates as the order moves.',
  },
  {
    id: 'faq-004',
    value: 'panel4',
    heading: 'Can I return an abaya, hijab, or janamaz?',
    detail:
      'Unused items in original packaging can be returned within 7 days of delivery. Damaged items, such as a torn abaya or a stained prayer mat, should be reported through Support with photos. Refunds go back to the original payment method, usually within 3–5 days after approval.',
  },
  {
    id: 'faq-005',
    value: 'panel5',
    heading: 'How do I become a seller on Taibah?',
    detail:
      'Sign in, complete your profile, and enable seller access. You can then add products, photos, prices, and stock. Sellers such as modest fashion and Islamic gift stores manage listings from Products. Inactive accounts cannot publish until an admin reactivates them.',
  },
  {
    id: 'faq-006',
    value: 'panel6',
    heading: 'Why was my product photo rejected?',
    detail:
      'Upload clear JPG or PNG images of the actual item. Dark, cropped, or watermarked files are often rejected. Use a plain background for hijabs, attar bottles, and home pieces so buyers can see fabric and color. After a valid upload, the listing can go live.',
  },
  {
    id: 'faq-007',
    value: 'panel7',
    heading: 'Where can I find Eid and seasonal collections?',
    detail:
      'Home campaigns and Events highlight current collections, such as Eid modest fashion, attar gift boxes, and prayer sets. Open Events or the featured banners on the storefront. Stock is limited, so popular sizes and gift boxes may sell out before the campaign end date.',
  },
  {
    id: 'faq-008',
    value: 'panel8',
    heading: 'I cannot sign in after resetting my password. What should I do?',
    detail:
      'Use only the newest reset link from email, then sign out on other devices. If the password still fails, wait a few minutes and try again. Do not reuse an old link. If it continues, open a Support ticket with the email on the account and we will help restore access.',
  },
  {
    id: 'faq-009',
    value: 'panel9',
    heading: 'How do I contact Taibah Support?',
    detail:
      'Go to Support from Settings or send a ticket with your name, phone, subject, and message. Open tickets are answered by the admin team. Include your order number for delivery, payment, or refund questions so we can reply faster.',
  },
  {
    id: 'faq-010',
    value: 'panel10',
    heading: 'Can one account be both a buyer and a seller?',
    detail:
      'Yes. A single Taibah account can shop as a buyer and list products as a seller. Buyer orders and seller products stay on the same profile, with separate tabs on the user details page. You can keep one role only if you do not need the other.',
  },
];

// ----------------------------------------------------------------------

export const _addressBooks = [...Array(24)].map((_, index) => ({
  id: _mock.id(index),
  primary: index === 0,
  name: _mock.fullName(index),
  email: _mock.email(index + 1),
  fullAddress: _mock.fullAddress(index),
  phoneNumber: _mock.phoneNumber(index),
  company: _mock.companyNames(index + 1),
  addressType: index === 0 ? 'Home' : 'Office',
}));

// ----------------------------------------------------------------------

export const _contacts = [...Array(20)].map((_, index) => {
  const status =
    (index % 2 && 'online') || (index % 3 && 'offline') || (index % 4 && 'alway') || 'busy';

  return {
    id: _mock.id(index),
    status,
    role: _mock.role(index),
    email: _mock.email(index),
    name: _mock.fullName(index),
    phoneNumber: _mock.phoneNumber(index),
    lastActivity: _mock.time(index),
    avatarUrl: _mock.image.avatar(index),
    address: _mock.fullAddress(index),
  };
});

// ----------------------------------------------------------------------

export const _notifications = [...Array(9)].map((_, index) => ({
  id: _mock.id(index),
  avatarUrl: [
    _mock.image.avatar(1),
    _mock.image.avatar(2),
    _mock.image.avatar(3),
    _mock.image.avatar(4),
    _mock.image.avatar(5),
    null,
    null,
    null,
    null,
    null,
  ][index],
  type: ['friend', 'project', 'file', 'tags', 'payment', 'order', 'chat', 'mail', 'delivery'][
    index
  ],
  category: [
    'Communication',
    'Project UI',
    'File manager',
    'File manager',
    'File manager',
    'Order',
    'Order',
    'Communication',
    'Communication',
  ][index],
  isRead: !_mock.boolean(index),
  createdAt: _mock.time(index),
  title:
    (index === 0 && `<p><strong>Deja Brady</strong> sent you a friend request</p>`) ||
    (index === 1 &&
      `<p><strong>Jayvon Hull</strong> mentioned you in <strong><a href='#'>Minimal UI</a></strong></p>`) ||
    (index === 2 &&
      `<p><strong>Lainey Davidson</strong> added file to <strong><a href='#'>File manager</a></strong></p>`) ||
    (index === 3 &&
      `<p><strong>Angelique Morse</strong> added new tags to <strong><a href='#'>File manager<a/></strong></p>`) ||
    (index === 4 &&
      `<p><strong>Giana Brandt</strong> request a payment of <strong>$200</strong></p>`) ||
    (index === 5 && `<p>Your order is placed waiting for shipping</p>`) ||
    (index === 6 && `<p>Delivery processing your order is being shipped</p>`) ||
    (index === 7 && `<p>You have new message 5 unread messages</p>`) ||
    (index === 8 && `<p>You have new mail`) ||
    '',
}));

// ----------------------------------------------------------------------

export const _mapContact = [
  {
    latlng: [33, 65],
    address: _mock.fullAddress(1),
    phoneNumber: _mock.phoneNumber(1),
  },
  {
    latlng: [-12.5, 18.5],
    address: _mock.fullAddress(2),
    phoneNumber: _mock.phoneNumber(2),
  },
];

// ----------------------------------------------------------------------

export const _socials = [
  {
    value: 'facebook',
    name: 'Facebook',
    path: 'https://www.facebook.com/caitlyn.kerluke',
  },
  {
    value: 'instagram',
    name: 'Instagram',
    path: 'https://www.instagram.com/caitlyn.kerluke',
  },
  {
    value: 'linkedin',
    name: 'Linkedin',
    path: 'https://www.linkedin.com/caitlyn.kerluke',
  },
  {
    value: 'twitter',
    name: 'Twitter',
    path: 'https://www.twitter.com/caitlyn.kerluke',
  },
];

// ----------------------------------------------------------------------

export const _pricingPlans = [
  {
    subscription: 'basic',
    price: 0,
    caption: 'Forever',
    lists: ['3 prototypes', '3 boards', 'Up to 5 team members'],
    labelAction: 'Current plan',
  },
  {
    subscription: 'starter',
    price: 4.99,
    caption: 'Saving $24 a year',
    lists: [
      '3 prototypes',
      '3 boards',
      'Up to 5 team members',
      'Advanced security',
      'Issue escalation',
    ],
    labelAction: 'Choose starter',
  },
  {
    subscription: 'premium',
    price: 9.99,
    caption: 'Saving $124 a year',
    lists: [
      '3 prototypes',
      '3 boards',
      'Up to 5 team members',
      'Advanced security',
      'Issue escalation',
      'Issue development license',
      'Permissions & workflows',
    ],
    labelAction: 'Choose premium',
  },
];

// ----------------------------------------------------------------------

export const _testimonials = [
  {
    name: _mock.fullName(1),
    postedDate: _mock.time(1),
    ratingNumber: _mock.number.rating(1),
    avatarUrl: _mock.image.avatar(1),
    content: `Excellent Work! Thanks a lot!`,
  },
  {
    name: _mock.fullName(2),
    postedDate: _mock.time(2),
    ratingNumber: _mock.number.rating(2),
    avatarUrl: _mock.image.avatar(2),
    content: `It's a very good dashboard and we are really liking the product . We've done some things, like migrate to TS and implementing a react useContext api, to fit our job methodology but the product is one of the best in terms of design and application architecture. The team did a really good job.`,
  },
  {
    name: _mock.fullName(3),
    postedDate: _mock.time(3),
    ratingNumber: _mock.number.rating(3),
    avatarUrl: _mock.image.avatar(3),
    content: `Customer support is realy fast and helpful the desgin of this theme is looks amazing also the code is very clean and readble realy good job !`,
  },
  {
    name: _mock.fullName(4),
    postedDate: _mock.time(4),
    ratingNumber: _mock.number.rating(4),
    avatarUrl: _mock.image.avatar(4),
    content: `Amazing, really good code quality and gives you a lot of examples for implementations.`,
  },
  {
    name: _mock.fullName(5),
    postedDate: _mock.time(5),
    ratingNumber: _mock.number.rating(5),
    avatarUrl: _mock.image.avatar(5),
    content: `Got a few questions after purchasing the product. The owner responded very fast and very helpfull. Overall the code is excellent and works very good. 5/5 stars!`,
  },
  {
    name: _mock.fullName(6),
    postedDate: _mock.time(6),
    ratingNumber: _mock.number.rating(6),
    avatarUrl: _mock.image.avatar(6),
    content: `CEO of Codealy.io here. We’ve built a developer assessment platform that makes sense - tasks are based on git repositories and run in virtual machines. We automate the pain points - storing candidates code, running it and sharing test results with the whole team, remotely. Bought this template as we need to provide an awesome dashboard for our early customers. I am super happy with purchase. The code is just as good as the design. Thanks!`,
  },
];
