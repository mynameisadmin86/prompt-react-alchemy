
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    PROFILE: "/auth/profile",
  },
  // Trip management
  TRIPS: {
    LIST: "/triplog/hubsearch",
    CREATE: "/trips",
    BULK_CANCEL: '/triplog/bulkcancel',
    GET_TRIP: "/transportexecution/gettrip",
    SAVE_TRIP: "/transportexecution/savetrip",
    CONFIRM_TRIP: "/transportexecution/confirmtrip",
    CANCEL_TRIP: "/transportexecution/canceltrip",
    AMEND_TRIP: "/transportexecution/amendtrip",
    UPDATE: (id: string) => `/trips/${id}`,
    DELETE: (id: string) => `/trips/${id}`,
    APPROVE: (id: string) => `/trips/${id}/approve`,
    GET_VAS: "/transportexecution/getvasfromtrip",
    GET_INCIDENT: "/transportexecution/common",
    SAVE_VAS: "/transportexecution/savevas",
    SAVE_INCIDENT: "/transportexecution/common",
    CREATE_TRIP_CO:"/tripplanexecution/createtripplan",
    ROUTE_UPDATE: "manageexecution/planhubsearch",
    CO_SELECTION: "manageexecution/planhubselection",
    UPDATE_SELECTION: "manageexecution/planhubupdate",
    TRIP_LEG_LEVEL_UPDATE: "manageexecution/plantriplevelupdate"
  },
  // Quick Order management
  QUICK_ORDERS: {
    LIST: "/quickorderhub/search",
    CREATE: "/quick-orders",
    UPDATE: (id: string) => `/quick-orders/${id}`,
    DELETE: (id: string) => `/quick-orders/${id}`,
    APPROVE: (id: string) => `/quick-orders/${id}/approve`,
    COMMON: "/common",
    COMBO: "/common/combo",
    SCREEN_FETCH: '/quickorderhub/screenfetch',
    ORDERFORM: "/quickorderhub/update",
    QUICKORDER_GET:"/quickorder/getdata",
    LINKEDORDERS_GET:"/quickorder/showlinked",
    UPLOADFILES: "/fileupload/update",
  },
  // Invoice management
  INVOICES: {
    LIST: "/invoices",
    CREATE: "/invoices",
    UPDATE: (id: string) => `/invoices/${id}`,
    DELETE: (id: string) => `/invoices/${id}`,
  },
  // Filter presets
  FILTERS: {
    LIST: (userId: string, gridId: string) =>
      `/users/${userId}/filters/${gridId}`,
    SAVE: (userId: string) => `/users/${userId}/filters`,
    UPDATE: (filterId: string) => `/filters/${filterId}`,
    DELETE: (filterId: string) => `/filters/${filterId}`,
  },
  // Grid preferences
  PREFERENCES: {
    GET: (userId: string, gridId: string) =>
      `/users/${userId}/preferences/${gridId}`,
    SAVE: (userId: string, gridId: string) =>
      `/users/${userId}/preferences/${gridId}`,
  },
  // Order management
  ORDERS: {
    LIST: "/orders",
    CREATE: "/orders",
    UPDATE: (id: string) => `/orders/${id}`,
    DELETE: (id: string) => `/orders/${id}`,
    PROCESS: (id: string) => `/orders/${id}/process`,
  },
} as const;

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  TRIP_EXECUTION: "/trip-execution",
  SIGNIN: "/signin",
  SIGNOUT: "/signout",
  OAUTH_CALLBACK: "/callback",
} as const;

