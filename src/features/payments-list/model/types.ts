export type PaymentListItem = {
  id: number
  userName: string
  avatar: string | null
  createdAt: string
  amount: number | null
  currency: 'USD' | 'EUR' | null
  subscription: string
  paymentMethod: string
}

export type PaymentListSortField = 'userName' | 'createdAt' | 'amount' | 'paymentMethod'
export type PaymentListSortDirection = 'asc' | 'desc'
