// ----------------------------------------------------------------------
// Last-30-days mock for Taibah AI (product descriptions, Islamic captions,
// customer replies, general chat).

export const CHAT_AI_STATS = {
  periodLabel: 'Last 30 days',
  kpis: [
    {
      key: 'conversations',
      title: 'Total Conversations',
      value: 4286,
      percent: 12.8,
      color: 'warning',
      icon: 'solar:chat-round-dots-bold',
      sparkline: [48, 62, 55, 71, 64, 78, 69, 86, 74, 91, 88, 97],
    },
    {
      key: 'users',
      title: 'Unique Users',
      value: 1142,
      percent: 8.4,
      color: 'success',
      icon: 'solar:users-group-rounded-bold',
      sparkline: [22, 28, 25, 31, 29, 36, 33, 41, 38, 44, 42, 47],
    },
    {
      key: 'messages',
      title: 'Total Messages',
      value: 18940,
      percent: 15.2,
      color: 'secondary',
      icon: 'solar:letter-unread-bold',
      sparkline: [210, 268, 244, 312, 286, 340, 318, 372, 350, 401, 388, 426],
    },
    {
      key: 'cost',
      title: 'AI Usage Cost',
      value: 1847.5,
      percent: -3.1,
      icon: 'solar:wad-of-money-bold',
      color: 'info',
      format: 'sar',
      sparkline: [52, 61, 58, 70, 66, 74, 71, 80, 76, 84, 81, 79],
    },
  ],
  usageTrend: [
    {
      name: 'Last 7 days',
      categories: ['5 Oct', '6 Oct', '7 Oct', '8 Oct', '9 Oct', '10 Oct', '11 Oct'],
      data: [186, 204, 176, 228, 198, 246, 232],
    },
    {
      name: '1 month',
      categories: ['12 Sep', '15 Sep', '18 Sep', '21 Sep', '24 Sep', '27 Sep', '30 Sep', '3 Oct', '6 Oct', '9 Oct', '11 Oct'],
      data: [128, 110, 164, 138, 186, 152, 204, 176, 228, 214, 232],
    },
    {
      name: '3 months',
      categories: ['Aug W1', 'Aug W2', 'Aug W3', 'Aug W4', 'Sep W1', 'Sep W2', 'Sep W3', 'Sep W4', 'Oct W1', 'Oct W2'],
      data: [620, 688, 742, 710, 804, 768, 892, 846, 918, 874],
    },
  ],
  features: [
    {
      key: 'product-description',
      label: 'Write Product Description',
      shortLabel: 'Product descriptions',
      value: 1628,
      icon: 'solar:pen-bold',
    },
    {
      key: 'islamic-captions',
      label: 'Create Islamic Captions',
      shortLabel: 'Islamic captions',
      value: 1028,
      icon: 'solar:star-bold',
    },
    {
      key: 'customer-replies',
      label: 'Reply To Customers',
      shortLabel: 'Customer replies',
      value: 942,
      icon: 'solar:inbox-bold',
    },
    {
      key: 'general-chat',
      label: 'General Chat',
      shortLabel: 'General chat',
      value: 688,
      icon: 'solar:chat-round-dots-bold',
    },
  ],
  successRate: 96.4,
  avgResponseSeconds: 1.8,
};
