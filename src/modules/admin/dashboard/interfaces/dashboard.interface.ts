
export interface DashboardStats {
  cards: {
    totalEarnings: number;
    totalReservations: number;
    totalOrders: number;
    totalCustomers: number;
  };
  charts: {
    salesMonthly: number[];
    reservationsStatus: {
      pending: number;
      approved: number;
    };
  };
}