import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useStore } from '../store/useStore';

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function CartPanel({ isOpen, onClose, onCheckout }: CartPanelProps) {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Cart panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-6 h-6" />
                <h2 className="text-2xl">Shopping Cart</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-xl mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Start adding some furniture!</p>
                  <button
                    onClick={onClose}
                    className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={`${item.productId}-${JSON.stringify(item.customization)}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 bg-gray-50 p-4 rounded-xl"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <h3 className="mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {item.customization?.color && item.customization?.material && 
                            `${item.customization.color} • ${item.customization.material}`
                          }
                        </p>
                        <p className="text-lg mb-3">${item.price.toLocaleString()}</p>

                        {/* Quantity controls */}
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2 bg-white rounded-lg border">
                            <button
                              onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1), item.customization)}
                              className="p-2 hover:bg-gray-100 rounded-l-lg transition"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-3">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1, item.customization)}
                              className="p-2 hover:bg-gray-100 rounded-r-lg transition"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.productId, item.customization)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${cartTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-xl pt-2 border-t">
                    <span>Total</span>
                    <span>${cartTotal().toLocaleString()}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCheckout}
                  className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 transition"
                >
                  Proceed to Checkout
                </motion.button>

                <p className="text-xs text-center text-gray-500">
                  Express delivery • 120-day returns
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}