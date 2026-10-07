// Orders & Purchases API Service

import { apiClient } from '../api/apiClient';

const FALLBACK_BOOK_IMAGE =
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80';

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80';

// =============================================================
// STATUS NORMALIZATION
// Backend -> Frontend
// =============================================================

function normalizeStatus(status) {

  if (!status) {
    return 'Pending';
  }

  const value =
    String(status).toUpperCase();

  switch (value) {

    case 'PENDING':
      return 'Pending';

    case 'CONFIRMED':
      return 'Confirmed';

    case 'SHIPPED':
      return 'Shipped';

    case 'OUT_FOR_DELIVERY':
      return 'Out for Delivery';

    case 'OUT FOR DELIVERY':
      return 'Out for Delivery';

    case 'DELIVERED':
    case 'COMPLETED':
      return 'Completed';

    case 'CANCELLED':
      return 'Cancelled';

    default:
      return status;
  }
}

// =============================================================
// DATE FORMAT
// =============================================================

function formatDate(date) {

  if (!date) {
    return 'Recently';
  }

  try {

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    );

  } catch {

    return 'Recently';
  }
}

// =============================================================
// BACKEND ORDER -> FRONTEND ORDER
// =============================================================

function normalizeOrder(
  order,
  type
) {

  if (!order) {
    return order;
  }

  const price =
    Number(order.amount ?? 0);

  return {

    // Keep ID as STRING because
    // OrdersPage uses order.id.toLowerCase()
    id:
      String(
        order.orderNumber ||
        order.id
      ),

    // Keep numeric backend ID separately
    backendId:
      order.id,

    type,

    status:
      normalizeStatus(
        order.status
      ),

    trackingNumber:
      order.trackingNumber ||
      `BL-${order.orderNumber || order.id}`,

    bookId:
      order.bookId,

    bookTitle:
      order.bookTitle ||
      'Book',

    bookAuthor:
      order.bookAuthor ||
      'Various',

    bookImage:
      order.bookImage ||
      FALLBACK_BOOK_IMAGE,

    condition:
      order.condition ||
      'Used - Good',

    category:
      order.category ||
      'Academic',

    // Buying:
    // seller name
    //
    // Selling:
    // buyer name
    partyName:
      type === 'buying'
        ? (
            order.sellerName ||
            'Seller'
          )
        : (
            order.buyerName ||
            'Buyer'
          ),

    partyRole:
      type === 'buying'
        ? 'Seller'
        : 'Buyer',

    partyAvatar:
      type === 'buying'
        ? (
            order.sellerAvatar ||
            FALLBACK_AVATAR
          )
        : (
            order.buyerAvatar ||
            FALLBACK_AVATAR
          ),

    partyPhone:
      order.partyPhone ||
      null,

    partyRating:
      order.partyRating ||
      4.9,

    partyVerified:
      order.partyVerified ??
      true,

    // Accepted offer amount
    price,

    // We don't currently have an
    // explicit MRP field in Order entity.
    //
    // For now originalPrice falls back
    // to the same amount.
    originalPrice:
      Number(
        order.originalPrice ??
        price
      ),

    deliveryMethod:
      order.deliveryMethod ||
      'BookLoop Marketplace',

    carrier:
      order.carrier ||
      'BookLoop Direct',

    date:
      order.date ||
      formatDate(
        order.createdAt
      ),

    estimatedDelivery:
      order.estimatedDelivery ||
      'Awaiting seller confirmation',

    deliveryOtp:
      order.deliveryOtp ||
      null,

    urgentBanner:
      order.urgentBanner ||
      null,

    deliveryLocation:
      order.deliveryLocation ||
      (
        order.deliveryAddress
          ? {
              type: 'doorstep',
              title:
                'Delivery Address',
              address:
                order.deliveryAddress,
              instructions:
                'Please inspect the book before completing the handover.',
            }
          : null
      ),

    payment:
      order.payment ||
      {
        method:
          'BookLoop Marketplace',

        status:
          'Pending',

        transactionId:
          null,

        subtotal:
          price,

        deliveryFee:
          0,

        protectionFee:
          0,

        discount:
          0,

        total:
          price,
      },

    timeline:
      Array.isArray(order.timeline)
        ? order.timeline
        : createDefaultTimeline(
            order
          ),

    createdAt:
      order.createdAt,

    updatedAt:
      order.updatedAt,

    deliveryAddress:
      order.deliveryAddress,

    orderNumber:
      order.orderNumber,
  };
}

// =============================================================
// DEFAULT TIMELINE
// =============================================================

function createDefaultTimeline(
  order
) {

  const status =
    normalizeStatus(
      order.status
    );

  const completedStatuses = [
    'Pending',
    'Confirmed',
    'Shipped',
    'Out for Delivery',
    'Completed',
  ];

  const currentIndex =
    completedStatuses.indexOf(
      status
    );

  const steps = [
    {
      title:
        'Order Placed',
      description:
        `Order ${order.orderNumber || order.id} created.`,
      time:
        formatDate(order.createdAt),
      completed:
        currentIndex >= 0,
      current:
        currentIndex === 0,
      location:
        null,
    },

    {
      title:
        'Confirmed by Seller',
      description:
        'Seller has accepted the order.',
      time:
        currentIndex >= 1
          ? formatDate(order.updatedAt)
          : 'Pending',
      completed:
        currentIndex >= 1,
      current:
        currentIndex === 1,
      location:
        null,
    },

    {
      title:
        'Dispatched',
      description:
        'Book has been dispatched.',
      time:
        currentIndex >= 2
          ? formatDate(order.updatedAt)
          : 'Pending',
      completed:
        currentIndex >= 2,
      current:
        currentIndex === 2,
      location:
        null,
    },

    {
      title:
        'Out for Delivery',
      description:
        'Book is on the way to the buyer.',
      time:
        currentIndex >= 3
          ? formatDate(order.updatedAt)
          : 'Pending',
      completed:
        currentIndex >= 3,
      current:
        currentIndex === 3,
      location:
        null,
    },

    {
      title:
        'Delivered & Completed',
      description:
        'Book successfully handed over.',
      time:
        currentIndex >= 4
          ? formatDate(order.updatedAt)
          : 'Pending',
      completed:
        currentIndex >= 4,
      current:
        currentIndex === 4,
      location:
        null,
    },
  ];

  return steps;
}

// =============================================================
// ORDER API
// =============================================================

export const orderApi = {

  // ===========================================================
  // GET ORDERS
  // ===========================================================

  async getOrders(
    type = 'all'
  ) {

    // BUYING
    if (type === 'buying') {

      const data =
        await apiClient(
          '/orders/my'
        );

      return Array.isArray(data)
        ? data.map(
            order =>
              normalizeOrder(
                order,
                'buying'
              )
          )
        : [];
    }

    // SELLING
    if (type === 'selling') {

      const data =
        await apiClient(
          '/orders/seller'
        );

      return Array.isArray(data)
        ? data.map(
            order =>
              normalizeOrder(
                order,
                'selling'
              )
          )
        : [];
    }

    // ALL
    const [
      buyingOrders,
      sellingOrders
    ] = await Promise.all([
      apiClient('/orders/my'),
      apiClient('/orders/seller'),
    ]);

    const buying =
      Array.isArray(buyingOrders)
        ? buyingOrders.map(
            order =>
              normalizeOrder(
                order,
                'buying'
              )
          )
        : [];

    const selling =
      Array.isArray(sellingOrders)
        ? sellingOrders.map(
            order =>
              normalizeOrder(
                order,
                'selling'
              )
          )
        : [];

    return [
      ...buying,
      ...selling,
    ];
  },

  // ===========================================================
  // GET SINGLE ORDER
  // ===========================================================

  async getOrderById(
    orderId
  ) {

    const numericId =
      extractBackendId(
        orderId
      );

    const data =
      await apiClient(
        `/orders/${numericId}`
      );

    // We need to know whether current
    // user is buyer/seller.
    //
    // Default to buying here.
    return normalizeOrder(
      data,
      'buying'
    );
  },

  // ===========================================================
  // CREATE DIRECT ORDER
  // ===========================================================

  async createOrder(
    book,
    deliveryMethod = 'BookLoop Marketplace',
    customDetails = {}
  ) {

    const payload = {

      bookId:
        book.id,

      deliveryAddress:
        customDetails.deliveryAddress ||
        null,
    };

    const data =
      await apiClient(
        '/orders',
        {
          method: 'POST',
          body:
            JSON.stringify(
              payload
            ),
        }
      );

    return normalizeOrder(
      data,
      'buying'
    );
  },

  // ===========================================================
  // UPDATE ORDER STATUS
  // ===========================================================

  async updateOrderStatus(
    orderId,
    status
  ) {

    const numericId =
      extractBackendId(
        orderId
      );

    const backendStatus =
      convertStatusToBackend(
        status
      );

    const data =
      await apiClient(
        `/orders/${numericId}/status`,
        {
          method: 'PATCH',
          body:
            JSON.stringify({
              status:
                backendStatus,
            }),
        }
      );

    return normalizeOrder(
      data,
      'buying'
    );
  },

  // ===========================================================
  // ADVANCE ORDER STATUS
  // ===========================================================

  async advanceOrderStatus(
    orderId
  ) {

    const numericId =
      extractBackendId(
        orderId
      );

    const current =
      await apiClient(
        `/orders/${numericId}`
      );

    const currentStatus =
      normalizeStatus(
        current.status
      );

    const statusFlow = [
      'Pending',
      'Confirmed',
      'Shipped',
      'Out for Delivery',
      'Completed',
    ];

    const currentIndex =
      statusFlow.indexOf(
        currentStatus
      );

    if (
      currentIndex === -1 ||
      currentIndex >=
        statusFlow.length - 1
    ) {
      return normalizeOrder(
        current,
        'buying'
      );
    }

    const nextStatus =
      statusFlow[
        currentIndex + 1
      ];

    return this.updateOrderStatus(
      orderId,
      nextStatus
    );
  },

  // ===========================================================
  // CANCEL ORDER
  // ===========================================================

  async cancelOrder(
    orderId,
    reason = 'Buyer requested cancellation'
  ) {

    const numericId =
      extractBackendId(
        orderId
      );

    const data =
      await apiClient(
        `/orders/${numericId}/cancel`,
        {
          method: 'PATCH',
        }
      );

    const normalized =
      normalizeOrder(
        data,
        'buying'
      );

    return {
      ...normalized,
      cancelReason:
        reason,
    };
  },
};

// =============================================================
// HELPERS
// =============================================================

function extractBackendId(
  orderId
) {

  // If backend numeric ID is passed
  if (
    typeof orderId === 'number'
  ) {
    return orderId;
  }

  // Example:
  // order.id = "BL-A1B2C3D4"
  //
  // We cannot derive DB id from order number.
  //
  // If orderId itself is numeric string,
  // use it directly.
  if (
    /^\d+$/.test(
      String(orderId)
    )
  ) {
    return Number(orderId);
  }

  throw new Error(
    `Invalid backend order id: ${orderId}`
  );
}

function convertStatusToBackend(
  status
) {

  switch (status) {

    case 'Pending':
      return 'PENDING';

    case 'Confirmed':
      return 'CONFIRMED';

    case 'Shipped':
      return 'SHIPPED';

    case 'Out for Delivery':
      return 'OUT_FOR_DELIVERY';

    case 'Completed':
      return 'COMPLETED';

    case 'Cancelled':
      return 'CANCELLED';

    default:
      return String(
        status
      ).toUpperCase();
  }
}

export default orderApi;