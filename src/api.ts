import type { Product, CartItem } from './types'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })

  if (!res.ok) {
    // eslint-disable-next-line no-console
    console.error('API error', res.status, await res.text())
    throw new Error('Произошла ошибка при запросе к серверу')
  }

  return (await res.json()) as T
}

export async function fetchProducts(): Promise<Product[]> {
  return request<Product[]>('/products')
}

type CreateOrderPayload = {
  customerName: string
  phone: string
  email?: string
  address?: string
  deliveryZone: string
  deliveryType: string
  comment?: string
  items: {
    productId: number
    quantity: number
    priceRub: number
  }[]
}

export type CreateOrderInput = Omit<
  CreateOrderPayload,
  'items'
> & {
  items: CartItem[]
}

export type CreateOrderResponse = {
  orderId: number
  totalPrice: number
  paymentUrl: string | null
}

export async function createOrder(
  payload: CreateOrderInput,
): Promise<CreateOrderResponse> {
  const body: CreateOrderPayload = {
    customerName: payload.customerName,
    phone: payload.phone,
    email: payload.email,
    address: payload.address,
    deliveryZone: payload.deliveryZone,
    deliveryType: payload.deliveryType,
    comment: payload.comment,
    items: payload.items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      priceRub: item.product.priceRub,
    })),
  }

  return request<CreateOrderResponse>('/orders', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

