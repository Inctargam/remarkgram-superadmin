type MockPaymentMethod = 'STRIPE' | 'PAYPAL'
type MockSubscriptionType = 'DAY' | 'WEEKLY'

type MockPayment = {
  id: number
  userId: number
  userName: string
  avatars: Array<{ url: string; width: number; height: number }>
  createdAt: string
  amount: number
  currency: 'USD'
  type: MockSubscriptionType
  paymentMethod: MockPaymentMethod
}

// Temporary local GraphQL fixtures. Replace these when the payments backend is available.
const FIGMA_PAYMENTS: MockPayment[] = [
  {
    id: 1,
    userId: 1,
    userName: 'Ivan.sr.yakimenko',
    avatars: [{ url: '/payments/avatar-1.png', width: 36, height: 36 }],
    createdAt: '2022-12-12T23:59:00Z',
    amount: 50,
    currency: 'USD',
    type: 'DAY',
    paymentMethod: 'STRIPE',
  },
  {
    id: 2,
    userId: 2,
    userName: 'Kirill_Mikulich',
    avatars: [{ url: '/payments/avatar-2.png', width: 36, height: 36 }],
    createdAt: '2022-12-12T22:30:00Z',
    amount: 50,
    currency: 'USD',
    type: 'WEEKLY',
    paymentMethod: 'PAYPAL',
  },
  {
    id: 3,
    userId: 3,
    userName: 'Anton.Antonov',
    avatars: [{ url: '/payments/avatar-3.png', width: 36, height: 36 }],
    createdAt: '2022-12-12T21:00:00Z',
    amount: 50,
    currency: 'USD',
    type: 'WEEKLY',
    paymentMethod: 'STRIPE',
  },
  {
    id: 4,
    userId: 4,
    userName: 'OlegOlegovich',
    avatars: [{ url: '/payments/avatar-4.png', width: 36, height: 36 }],
    createdAt: '2022-12-12T10:00:00Z',
    amount: 50,
    currency: 'USD',
    type: 'WEEKLY',
    paymentMethod: 'STRIPE',
  },
  {
    id: 5,
    userId: 5,
    userName: 'Anna_Votakaya',
    avatars: [{ url: '/payments/avatar-5.png', width: 36, height: 36 }],
    createdAt: '2022-12-12T09:00:00Z',
    amount: 50,
    currency: 'USD',
    type: 'WEEKLY',
    paymentMethod: 'PAYPAL',
  },
  {
    id: 6,
    userId: 6,
    userName: 'Nikilay89Kolya',
    avatars: [{ url: '/payments/avatar-6.png', width: 36, height: 36 }],
    createdAt: '2022-12-12T08:00:00Z',
    amount: 50,
    currency: 'USD',
    type: 'WEEKLY',
    paymentMethod: 'STRIPE',
  },
]

const makeAdditionalPayments = (day: string, idOffset: number): MockPayment[] =>
  FIGMA_PAYMENTS.map((payment) => ({
    ...payment,
    id: payment.id + idOffset,
    createdAt: payment.createdAt.replace('2022-12-12', day),
    amount: payment.id % 2 === 0 ? 10 : 50,
    type: payment.id % 2 === 0 ? 'DAY' : 'WEEKLY',
  }))

export const MOCK_PAYMENTS: MockPayment[] = [
  ...FIGMA_PAYMENTS,
  ...makeAdditionalPayments('2022-12-11', 6),
  ...makeAdditionalPayments('2022-12-10', 12),
]
