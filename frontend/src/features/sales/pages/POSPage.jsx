import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { User, UserPlus, Search, Printer, History, ShoppingCart, ShieldCheck, CreditCard, QrCode } from 'lucide-react'
import productService from '../../../services/productService'
import customerService from '../../../services/customerService'
import salesService from '../../../services/salesService'
import CartPanel from '../components/CartPanel'
import ProductSelector from '../components/ProductSelector'
import Modal from '../../../components/ui/Modal'
import PaymentMethodSelector from '../components/PaymentMethodSelector'
import Button from '../../../components/ui/Button'
import InvoicePreview from '../components/InvoicePreview'
import toast from 'react-hot-toast'
import { QRCodeSVG } from 'qrcode.react'
import { formatCurrency } from '../../../utils/helpers'

const POSPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [cartItems, setCartItems] = useState([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [showInvoice, setShowInvoice] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customerSearch, setCustomerSearch] = useState('')
  const [invoice, setInvoice] = useState(null)
  const [isQRProcessing, setIsQRProcessing] = useState(false)
  const [isCardPayment, setIsCardPayment] = useState(false)
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [qrCountdown, setQrCountdown] = useState(5)
  const qrTimerRef = useRef(null)
  // Checkout modal customer state
  const [checkoutCustSearch, setCheckoutCustSearch] = useState('')
  const [showNewCustForm, setShowNewCustForm] = useState(false)
  const [newCustForm, setNewCustForm] = useState({ name: '', phone: '', email: '' })

  // Fetch products
  const { data: productsRes, isLoading: isProductsLoading } = useQuery({
    queryKey: ['products', 'pos'],
    queryFn: () => productService.getAllProducts({ limit: 100, status: 'active' }),
  })

  // Fetch customers
  const { data: customersRes } = useQuery({
    queryKey: ['customers', customerSearch],
    queryFn: () => customerService.getAll({ search: customerSearch, limit: 20 }),
    enabled: true
  })

  const products = productsRes?.data?.data || []
  const customers = customersRes?.data?.data || []

  // Customer search inside checkout modal
  const { data: checkoutCustRes } = useQuery({
    queryKey: ['customers-checkout', checkoutCustSearch],
    queryFn: () => customerService.getAll({ search: checkoutCustSearch, limit: 20 }),
    enabled: checkoutCustSearch.length > 0,
  })
  const checkoutCustomers = checkoutCustRes?.data?.data || []

  const handleQRCompleteRef = useRef(null)

  const createSaleMutation = useMutation({
    mutationFn: (data) => salesService.create(data),
    onSuccess: (response) => {
      setInvoice(response.data.data)
      setShowCheckout(false)
      setShowInvoice(true)
      setCartItems([])
      setSelectedCustomer(null)
      queryClient.invalidateQueries(['products'])
      queryClient.invalidateQueries(['dashboard'])
      queryClient.invalidateQueries(['transactions'])
      queryClient.invalidateQueries(['transaction-summary'])
      toast.success('Sale completed successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to complete sale')
    }
  })

  const createCustomerMutation = useMutation({
    mutationFn: (data) => customerService.create(data),
    onSuccess: (res) => {
      const created = res.data?.data || res.data
      setSelectedCustomer(created)
      setShowNewCustForm(false)
      setNewCustForm({ name: '', phone: '', email: '' })
      toast.success('Customer created!')
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create customer')
    },
  })

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id)
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1, unitPrice: product.sellingPrice || product.price }]
    })
  }

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item._id !== productId))
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        )
      )
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.sellingPrice || item.price) * item.quantity, 0)
  const tax = 0
  const total = subtotal + tax

  const buildSaleData = (method) => ({
    customer: selectedCustomer._id,
    items: cartItems.map((item) => ({
      product: item._id,
      productName: item.name,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: item.sellingPrice || item.unitPrice || item.price,
      discount: 0,
      tax: 0
    })),
    paidAmount: total,
    paymentMethod: method,
    status: 'COMPLETED'
  })

  const handleCompleteSale = () => {
    if (!selectedCustomer) {
      toast.error('Please select a customer to continue')
      return
    }
    if (cartItems.length === 0) {
      toast.error('Add items to the cart first')
      return
    }

    if (paymentMethod === 'qr' && !isQRProcessing) {
      setIsQRProcessing(true)
      return
    }
    if (paymentMethod === 'card' && !isCardPayment) {
      setIsCardPayment(true)
      return
    }
    createSaleMutation.mutate(buildSaleData(paymentMethod.toUpperCase()))
  }

  const handleQRComplete = () => {
    if (!selectedCustomer) return
    createSaleMutation.mutate(buildSaleData('QR'))
    setIsQRProcessing(false)
  }
  handleQRCompleteRef.current = handleQRComplete

  useEffect(() => {
    if (isQRProcessing && selectedCustomer) {
      setQrCountdown(5)
      qrTimerRef.current = setTimeout(() => handleQRCompleteRef.current?.(), 5000)
      const interval = setInterval(() => {
        setQrCountdown((c) => (c <= 1 ? 0 : c - 1))
      }, 1000)
      return () => {
        if (qrTimerRef.current) clearTimeout(qrTimerRef.current)
        clearInterval(interval)
      }
    }
  }, [isQRProcessing, selectedCustomer])

  const handleCardPay = () => {
    if (!selectedCustomer) {
      toast.error('Please select a customer to continue')
      return
    }
    createSaleMutation.mutate(buildSaleData('CARD'))
    setIsCardPayment(false)
    setCardForm({ number: '', expiry: '', cvv: '', name: '' })
  }

  const handleNewSale = () => {
    setShowInvoice(false)
    setInvoice(null)
    setCartItems([])
    setSelectedCustomer(null)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] items-start pb-8">
      {/* Product Area */}
      <div className="flex-1 min-w-0 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white">
              <ShoppingCart size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Point of Sale</h1>
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-green-500" /> Secure processing
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-gray-500">Ready</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-[calc(100vh-260px)] min-h-[600px]">
          <ProductSelector
            products={products}
            onSelectProduct={handleAddToCart}
            isLoading={isProductsLoading}
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full flex flex-col gap-5 h-full">
        {/* Customer */}
        <div className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm space-y-4">
          <h3 className="text-xs font-semibold text-gray-500 flex items-center gap-2">
            <User size={14} className="text-green-600" /> Customer
          </h3>

          {selectedCustomer ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-green-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <User size={15} />
                </div>
                <div>
                  <p className="font-semibold text-sm">{selectedCustomer.name}</p>
                  <p className="text-[11px] text-green-200">{selectedCustomer.phone}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
              >
                <Search size={13} />
              </button>
            </div>
          ) : (
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                autoComplete="off"
                className="w-full h-10 pl-9 pr-4 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-400"
                placeholder="Search customers..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
              />

              {customers.length > 0 && customerSearch.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 border border-gray-200 rounded-xl bg-white shadow-lg z-50 overflow-hidden divide-y divide-gray-50">
                  {customers.map((c) => (
                    <button
                      key={c._id}
                      type="button"
                      className="w-full text-left px-3 py-2.5 hover:bg-green-50 transition-colors cursor-pointer flex items-center gap-3"
                      onClick={() => {
                        setSelectedCustomer(c)
                        setCustomerSearch('')
                      }}
                    >
                      <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        <User size={13} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.phone || c.email || '—'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="flex-1 min-h-[400px]">
          <CartPanel
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onCheckout={() => {
              setShowCheckout(true)
              setIsCardPayment(false)
              setIsQRProcessing(false)
            }}
            subtotal={subtotal}
            tax={tax}
            total={total}
          />
        </div>
      </div>

      {/* Checkout Modal */}
      <Modal
        isOpen={showCheckout}
        onClose={() => {
          setShowCheckout(false)
          setIsCardPayment(false)
          setIsQRProcessing(false)
          setCardForm({ number: '', expiry: '', cvv: '', name: '' })
          setCheckoutCustSearch('')
          setShowNewCustForm(false)
          setNewCustForm({ name: '', phone: '', email: '' })
        }}
        title="Complete Sale"
      >
        <div className="space-y-4 p-1">

          {/* ── Customer selector (hidden during QR scan) ── */}
          {!isQRProcessing && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2.5">
              <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <User size={13} className="text-green-600" /> Customer
              </p>

              {selectedCustomer ? (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-green-100 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center text-green-700">
                      <User size={13} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{selectedCustomer.name}</p>
                      <p className="text-xs text-slate-400">{selectedCustomer.phone || selectedCustomer.email || '—'}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setSelectedCustomer(null); setShowNewCustForm(false) }}
                    className="text-xs text-slate-400 hover:text-slate-700 font-medium transition-colors"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <>
                  {/* Search existing */}
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      autoComplete="off"
                      className="w-full h-9 pl-8 pr-4 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-slate-400"
                      placeholder="Search existing customers..."
                      value={checkoutCustSearch}
                      onChange={(e) => { setCheckoutCustSearch(e.target.value); setShowNewCustForm(false) }}
                    />
                    {checkoutCustomers.length > 0 && checkoutCustSearch.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 border border-slate-200 rounded-xl bg-white shadow-lg z-50 overflow-auto divide-y divide-slate-50 max-h-40">
                        {checkoutCustomers.map((c) => (
                          <button
                            key={c._id}
                            type="button"
                            className="w-full text-left px-3 py-2 hover:bg-green-50 transition-colors flex items-center gap-2.5"
                            onClick={() => { setSelectedCustomer(c); setCheckoutCustSearch('') }}
                          >
                            <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                              <User size={11} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-800 truncate">{c.name}</p>
                              <p className="text-xs text-slate-400">{c.phone || c.email || '—'}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-[11px] text-slate-400 font-medium">or</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  {/* Create new toggle */}
                  <button
                    type="button"
                    onClick={() => { setShowNewCustForm((v) => !v); setCheckoutCustSearch('') }}
                    className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 font-semibold transition-colors"
                  >
                    <UserPlus size={13} />
                    {showNewCustForm ? 'Cancel' : 'Create new customer'}
                  </button>

                  {/* Inline create form */}
                  {showNewCustForm && (
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                      <input
                        type="text"
                        placeholder="Full name *"
                        autoFocus
                        className="w-full h-9 px-3 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                        value={newCustForm.name}
                        onChange={(e) => setNewCustForm((f) => ({ ...f, name: e.target.value }))}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Phone *"
                          className="h-9 px-3 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                          value={newCustForm.phone}
                          onChange={(e) => setNewCustForm((f) => ({ ...f, phone: e.target.value }))}
                        />
                        <input
                          type="email"
                          placeholder="Email (optional)"
                          className="h-9 px-3 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                          value={newCustForm.email}
                          onChange={(e) => setNewCustForm((f) => ({ ...f, email: e.target.value }))}
                        />
                      </div>
                      <button
                        type="button"
                        disabled={!newCustForm.name.trim() || !newCustForm.phone.trim() || createCustomerMutation.isPending}
                        onClick={() => createCustomerMutation.mutate({
                          name: newCustForm.name.trim(),
                          phone: newCustForm.phone.trim(),
                          ...(newCustForm.email.trim() && { email: newCustForm.email.trim() }),
                        })}
                        className="w-full h-9 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {createCustomerMutation.isPending ? 'Creating...' : 'Save & Select'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── Payment steps ── */}
          {isCardPayment ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-900 text-white">
                <p className="text-xs text-gray-400 mb-1">Total Amount</p>
                <div className="text-3xl font-bold">{formatCurrency(total)}</div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-600 flex items-center gap-2">
                  <CreditCard size={14} /> Card Details
                </h4>
                <div className="grid gap-3">
                  <input
                    type="text"
                    placeholder="Card number"
                    className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm transition-all"
                    value={cardForm.number}
                    onChange={(e) => setCardForm((f) => ({ ...f, number: e.target.value }))}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm transition-all"
                      value={cardForm.expiry}
                      onChange={(e) => setCardForm((f) => ({ ...f, expiry: e.target.value }))}
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm transition-all"
                      value={cardForm.cvv}
                      onChange={(e) => setCardForm((f) => ({ ...f, cvv: e.target.value }))}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Cardholder name"
                    className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm transition-all"
                    value={cardForm.name}
                    onChange={(e) => setCardForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsCardPayment(false)}>Back</Button>
                <Button type="button" variant="primary" className="flex-[2]" onClick={handleCardPay} loading={createSaleMutation.isPending} disabled={!selectedCustomer}>
                  Pay with Card
                </Button>
              </div>
            </div>
          ) : !isQRProcessing ? (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-500">Order Total</span>
                <span className="text-2xl font-bold text-gray-900">{formatCurrency(total)}</span>
              </div>
              {paymentMethod === 'cash' && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-100">
                  <p className="text-sm font-medium text-green-700">Cash Payment</p>
                  <p className="text-base font-bold text-green-700">{formatCurrency(total)}</p>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-500">Payment Method</h4>
                <PaymentMethodSelector selected={paymentMethod} onSelect={setPaymentMethod} />
              </div>

              {!selectedCustomer && (
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                  Please select or create a customer above to continue.
                </p>
              )}
              <div className="flex gap-3 pt-1 border-t border-gray-100">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowCheckout(false)}>Cancel</Button>
                <Button
                  type="button" variant="primary" className="flex-[2]"
                  onClick={handleCompleteSale}
                  loading={createSaleMutation.isPending}
                  disabled={cartItems.length === 0 || !selectedCustomer}
                >
                  {paymentMethod === 'cash' ? 'Complete Sale' : paymentMethod === 'qr' ? 'Pay with QR' : 'Pay with Card'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 space-y-6">
              <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                <QRCodeSVG value={`ims-payment-${total}-${Date.now()}`} size={220} level="H" includeMargin={false} className="rounded-lg" />
              </div>

              <div className="text-center space-y-2">
                <h4 className="text-xl font-bold text-gray-900">Scan to Pay</h4>
                <p className="text-gray-500 text-sm">
                  Authorize <span className="font-semibold text-green-600">{formatCurrency(total)}</span> via your payment app.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-xs font-medium text-amber-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                  Auto-confirm in {qrCountdown}s
                </div>
              </div>

              <div className="w-full flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsQRProcessing(false)}>Cancel</Button>
                <Button type="button" variant="primary" className="flex-[2]" onClick={handleQRComplete} loading={createSaleMutation.isPending}>
                  Confirm Payment
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Invoice Modal */}
      <Modal isOpen={showInvoice} onClose={handleNewSale} title="Sale Complete" size="lg">
        <div className="space-y-5">
          <div className="max-h-[60vh] overflow-y-auto pr-1 rounded-xl border border-gray-100 bg-gray-50/30 p-4">
            <InvoicePreview invoice={invoice} />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-1.5" /> Print Receipt
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={() => { setShowInvoice(false); setInvoice(null); navigate('/employee/history') }}>
              <History className="w-4 h-4 mr-1.5" /> All Sales
            </Button>
            {invoice?.customer?._id && (
              <Button type="button" variant="outline" className="flex-1" onClick={() => { setShowInvoice(false); setInvoice(null); navigate(`/customers/${invoice.customer._id}`) }}>
                <User className="w-4 h-4 mr-1.5" /> Customer Profile
              </Button>
            )}
            <Button type="button" variant="primary" className="flex-[1.5]" onClick={handleNewSale}>
              Next Sale
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default POSPage
