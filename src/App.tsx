import { useEffect, useMemo, useState } from 'react'
import type { Product } from './types'
import { fetchProducts, createOrder } from './api'
import { useCartStore } from './cartStore'

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [productsError, setProductsError] = useState<string | null>(null)

  const cartItems = useCartStore((s) => s.items)
  const addToCart = useCartStore((s) => s.addToCart)
  const clearCart = useCartStore((s) => s.clear)

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  )

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setLoadingProducts(true)
        setProductsError(null)
        const data = await fetchProducts()
        if (!cancelled) {
          setProducts(data)
        }
      } catch (error) {
        if (!cancelled) {
          setProductsError(
            error instanceof Error
              ? error.message
              : 'Не удалось загрузить каталог',
          )
        }
      } finally {
        if (!cancelled) {
          setLoadingProducts(false)
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-stone-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-amber-300 shadow-inner" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wide uppercase text-stone-800">
                Живое масло
              </span>
              <span className="text-xs text-stone-500">
                сыродавленные масла холодного отжима
              </span>
            </div>
          </div>
          <nav className="hidden gap-6 text-sm font-medium text-stone-700 md:flex">
            <a href="#catalog" className="hover:text-amber-700">
              Каталог
            </a>
            <a href="#delivery" className="hover:text-amber-700">
              Доставка
            </a>
            <a href="#consult" className="hover:text-amber-700">
              Консультация
            </a>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-900 shadow-sm hover:bg-amber-400"
            >
              Корзина · {cartCount}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="border-b border-stone-200 bg-gradient-to-b from-amber-50/80 to-stone-50 py-10 md:py-16">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 lg:flex-row lg:items-center lg:px-6">
            <div className="flex-1 space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                холодный сыродавленный отжим
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
                Свежие масла, отжатые под заказ
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-stone-600 sm:text-base">
                Настоящие сыродавленные масла без нагрева и контакта с
                металлом. Отжимаем в деревянной бочке под прессом — сохраняем
                вкус, аромат и пользу семян и орехов.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#catalog"
                  className="inline-flex items-center justify-center rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-amber-50 shadow-sm hover:bg-stone-800"
                >
                  Выбрать масло
                </a>
                <a
                  href="#consult"
                  className="inline-flex items-center justify-center rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-800 hover:border-stone-400 hover:bg-white"
                >
                  Получить консультацию
                </a>
              </div>
              <dl className="grid max-w-lg grid-cols-2 gap-4 text-xs text-stone-600 sm:text-sm">
                <div>
                  <dt className="font-semibold text-stone-800">
                    Бесплатная консультация
                  </dt>
                  <dd>Помогаем подобрать масла и режим приёма.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-stone-800">
                    Свежесть по умолчанию
                  </dt>
                  <dd>Отжимаем партии под заказ, не храним месяцами.</dd>
                </div>
              </dl>
            </div>

            <div className="flex-1">
              <div className="relative mx-auto max-w-md rounded-3xl bg-white p-6 shadow-lg ring-1 ring-stone-100">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Преимущества
                  </span>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                    Холодный отжим
                  </span>
                </div>
                <ul className="space-y-3 text-sm text-stone-700">
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                    <span>Без нагрева — максимум омега‑кислот и витаминов.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                    <span>Без контакта с металлом и без консервантов.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                    <span>Отжимаем в дубовой бочке под прессом 50 тонн.</span>
                  </li>
                </ul>
                <p className="mt-5 rounded-2xl bg-stone-50 px-4 py-3 text-xs text-stone-600">
                  Каталог и корзина ниже на странице. Чтобы не потерять условия
                  доставки, сохраните сайт в закладки.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="catalog"
          className="border-b border-stone-200 bg-white py-10 md:py-14"
        >
          <div className="mx-auto max-w-6xl px-4 lg:px-6">
            <h2 className="text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl">
              Каталог масел
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-stone-600">
              Выберите масло и добавьте в корзину. Мы отжимаем масла под заказ
              и доставляем в термосумках.
            </p>
            <CatalogSection
              products={products}
              loading={loadingProducts}
              error={productsError}
              onAddToCart={addToCart}
            />
            <CartAndCheckoutSection
              items={cartItems}
              onClear={clearCart}
            />
          </div>
        </section>

        <section
          id="delivery"
          className="border-b border-stone-200 bg-stone-50 py-10 md:py-14"
        >
          <div className="mx-auto max-w-6xl px-4 lg:px-6">
            <h2 className="text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl">
              Доставка и оплата
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="space-y-3 text-sm text-stone-700">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                  По городу
                </h3>
                <ul className="space-y-2">
                  <li>Бесплатная доставка по городу при заказе от 1000 ₽.</li>
                  <li>
                    На «Радугу» — бесплатная доставка от 2000 ₽.
                  </li>
                  <li>
                    В Кировский р‑н, Новостройку, Ягуново, Журавлёво, Лесную
                    Поляну — бесплатная доставка от 3000 ₽.
                  </li>
                  <li>
                    Если сумма меньше порога — самовывоз с ФПК или платная
                    доставка курьером.
                  </li>
                </ul>
              </div>
              <div className="space-y-3 text-sm text-stone-700">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Другие города и страны
                </h3>
                <p>
                  Отправляем масла в другие города России, Казахстана,
                  Беларуси, Армении, Кыргызстана по льготным тарифам служб
                  доставки.
                </p>
                <p className="text-xs text-stone-500">
                  Подробные условия и стоимость доставки будут уточняться при
                  оформлении заказа.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="consult" className="bg-white py-10 md:py-14">
          <div className="mx-auto max-w-6xl px-4 lg:px-6">
            <div className="grid gap-6 md:grid-cols-[1.3fr,1fr] md:items-center">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl">
                  Бесплатная консультация по употреблению масел
                </h2>
                <p className="text-sm text-stone-600">
                  Расскажем, какие масла подойдут именно вам, как их сочетать и
                  сколько по времени принимать. Ответим на вопросы про курс
                  приёма, дозировки и особенности хранения.
                </p>
                <p className="text-sm text-stone-700">
                  Вы можете написать нам в мессенджер или позвонить —
                  контактные данные мы добавим после согласования с
                  заказчиком.
                </p>
              </div>
              <div className="space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-5 text-sm text-stone-700">
                <p className="font-semibold text-stone-900">
                  Как только утвердим контакты (телефон, Telegram, WhatsApp),
                  здесь появятся кнопки связи.
                </p>
                <p className="text-xs text-stone-500">
                  На следующих шагах заменим этот блок на реальные ссылки и
                  CTA под клиента.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-white py-5">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 text-xs text-stone-500 sm:flex-row sm:items-center lg:px-6">
          <span>© {new Date().getFullYear()} Живое масло</span>
          <span>Сыродавленные масла холодного отжима • Сделано с заботой</span>
        </div>
      </footer>
    </div>
  )
}

type CatalogSectionProps = {
  products: Product[]
  loading: boolean
  error: string | null
  onAddToCart: (product: Product) => void
}

function CatalogSection({
  products,
  loading,
  error,
  onAddToCart,
}: CatalogSectionProps) {
  if (loading) {
    return (
      <div className="mt-6 text-sm text-stone-500">
        Загружаем каталог масел…
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {error}
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-stone-200 bg-stone-50/80 px-4 py-3 text-sm text-stone-500">
        Каталог пока пуст. После заполнения админкой здесь появятся масла.
      </div>
    )
  }

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <article
          key={product.id}
          className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
        >
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-stone-900">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-xs text-stone-600 line-clamp-3">
                {product.description}
              </p>
            )}
            <p className="text-xs text-stone-500">
              Объём: {product.volumeMl} мл
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-stone-900">
              {product.priceRub.toLocaleString('ru-RU')} ₽
            </span>
            <button
              type="button"
              className="rounded-full bg-stone-900 px-3 py-1.5 text-xs font-semibold text-amber-50 hover:bg-stone-800"
              onClick={() => onAddToCart(product)}
            >
              В корзину
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

type CartAndCheckoutSectionProps = {
  items: { product: Product; quantity: number }[]
  onClear: () => void
}

function CartAndCheckoutSection({
  items,
  onClear,
}: CartAndCheckoutSectionProps) {
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [deliveryZone, setDeliveryZone] = useState('city')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const total = items.reduce((sum, item) => {
    return sum + item.product.priceRub * item.quantity
  }, 0)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (!items.length) {
      setSubmitError('Корзина пуста')
      return
    }
    if (!customerName.trim() || !phone.trim()) {
      setSubmitError('Пожалуйста, заполните имя и телефон')
      return
    }
    try {
      setSubmitting(true)
      setSubmitError(null)
      setSuccessMessage(null)

      const response = await createOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        address: address.trim() || undefined,
        deliveryZone,
        deliveryType: 'delivery',
        comment: comment.trim() || undefined,
        items,
      })

      if (response.paymentUrl) {
        window.location.href = response.paymentUrl
        return
      }

      setSuccessMessage(
        'Заказ принят. Мы свяжемся с вами для подтверждения и оплаты.',
      )
      onClear()
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Не удалось отправить заказ. Попробуйте ещё раз.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-10 grid gap-8 border-t border-stone-100 pt-8 md:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)]">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
          Корзина
        </h3>
        {items.length === 0 ? (
          <p className="mt-3 text-sm text-stone-500">
            В корзине пока пусто. Добавьте масла из каталога.
          </p>
        ) : (
          <ul className="mt-4 space-y-3 text-sm text-stone-700">
            {items.map((item) => (
              <li
                key={item.product.id}
                className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-3 py-2"
              >
                <div>
                  <p className="font-semibold text-stone-900">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-stone-500">
                    {item.product.volumeMl} мл ·{' '}
                    {item.product.priceRub.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
                <span className="text-sm font-semibold text-stone-900">
                  × {item.quantity}
                </span>
              </li>
            ))}
            <li className="flex items-center justify-between border-t border-dashed border-stone-300 pt-3 text-sm font-semibold text-stone-900">
              <span>Итого</span>
              <span>{total.toLocaleString('ru-RU')} ₽</span>
            </li>
          </ul>
        )}
      </div>

      <form
        className="space-y-4 rounded-2xl border border-stone-200 bg-stone-50/80 p-4 text-sm"
        onSubmit={handleSubmit}
      >
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
          Оформление заказа
        </h3>
        <div className="grid gap-3">
          <label className="space-y-1">
            <span className="block text-xs font-medium text-stone-700">
              Имя*
            </span>
            <input
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none ring-amber-500/0 placeholder:text-stone-400 focus:ring-2"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </label>
          <label className="space-y-1">
            <span className="block text-xs font-medium text-stone-700">
              Телефон*
            </span>
            <input
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none ring-amber-500/0 placeholder:text-stone-400 focus:ring-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </label>
          <label className="space-y-1">
            <span className="block text-xs font-medium text-stone-700">
              E-mail
            </span>
            <input
              type="email"
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none ring-amber-500/0 placeholder:text-stone-400 focus:ring-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className="block text-xs font-medium text-stone-700">
              Адрес или район доставки
            </span>
            <input
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none ring-amber-500/0 placeholder:text-stone-400 focus:ring-2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className="block text-xs font-medium text-stone-700">
              Зона доставки
            </span>
            <select
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none ring-amber-500/0 focus:ring-2"
              value={deliveryZone}
              onChange={(e) => setDeliveryZone(e.target.value)}
            >
              <option value="city">По городу</option>
              <option value="raduga">Радуга</option>
              <option value="remote">
                Кировский р-н / Новостройка / Ягуново / Журавлёво / Лесная
                Поляна
              </option>
              <option value="other">Другие города / страны</option>
            </select>
          </label>
          <label className="space-y-1">
            <span className="block text-xs font-medium text-stone-700">
              Комментарий к заказу
            </span>
            <textarea
              className="min-h-[72px] w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none ring-amber-500/0 placeholder:text-stone-400 focus:ring-2"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </label>
        </div>

        {submitError && (
          <p className="text-xs text-rose-600">{submitError}</p>
        )}
        {successMessage && (
          <p className="text-xs text-emerald-600">{successMessage}</p>
        )}

        <button
          type="submit"
          className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-stone-900 px-4 py-2.5 text-sm font-semibold text-amber-50 shadow-sm hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
          disabled={submitting || !items.length}
        >
          {submitting ? 'Отправляем…' : 'Оформить заказ'}
        </button>

        <p className="mt-2 text-[11px] leading-snug text-stone-500">
          Нажимая «Оформить заказ», вы отправляете заявку на заказ масел. На
          следующих шагах мы подключим онлайн‑оплату через ЮKassa.
        </p>
      </form>
    </section>
  )
}

export default App
