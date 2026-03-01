export type Product = {
  id: number
  name: string
  slug: string
  description?: string | null
  volumeMl: number
  priceRub: number
}

export type CartItem = {
  product: Product
  quantity: number
}

