import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from './ui/button';

export function Cart() {
  const { cart, isCartOpen, setCartOpen, updateQuantity, removeFromCart, cartTotal } = useStore();

  const handleCheckout = () => {
    setCartOpen(false);
    window.history.pushState({}, '', '/checkout');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white dark:bg-black z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6" />
                <h2 className="text-2xl">Shopping Cart</h2>
                <span className="text-gray-500 dark:text-gray-400">({cart.length})</span>
              </div>
              <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-black">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl mb-2">Your cart is empty</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Add some beautiful furniture to get started!</p>
                  <Button onClick={() => setCartOpen(false)}>Continue Shopping</Button>
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
                      className="flex gap-4 p-4 bg-gray-50 dark:bg-black rounded-xl border border-transparent dark:border-gray-800"
                    >
                      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h3 className="mb-1 line-clamp-1">{item.name}</h3>
                        <div className="text-lg mb-2">${item.price.toLocaleString()}</div>

                        {item.customization && (
                          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 mb-2">
                            {item.customization.color && (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600" style={{ backgroundColor: item.customization.color }} />
                                <span>Custom color</span>
                              </div>
                            )}
                            {item.customization.material && <div>{item.customization.material}</div>}
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button variant="outline" size="sm" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.productId)} className="ml-auto text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-800 p-6 space-y-4 bg-gray-50 dark:bg-black">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>${cartTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Delivery</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-xl pt-2 border-t border-gray-200 dark:border-gray-800">
                    <span>Total</span>
                    <span>${cartTotal().toLocaleString()} AUD</span>
                  </div>
                </div>

                <Button size="lg" className="w-full" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>

                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  Shipping calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
