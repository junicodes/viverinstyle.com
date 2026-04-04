import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Check, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useStore } from '../store/useStore';

interface ProductDetailProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetail({ product, isOpen, onClose }: ProductDetailProps) {
  const { addToCart } = useStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
  const [selectedMaterial, setSelectedMaterial] = useState(product?.materials?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);

  if (!product) return null;

  // Update image when color/material selection changes
  const currentImage = selectedColor?.image || selectedMaterial?.image || product.images[selectedImage];

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: currentImage || product.images[0],
      quantity,
      customization: product.customizable ? {
        color: selectedColor?.name,
        material: selectedMaterial?.name,
        size: selectedSize,
      } : undefined,
    });
    onClose();
  };

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
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-3xl z-50 overflow-hidden shadow-2xl"
          >
            <div className="h-full overflow-y-auto">
              <div className="relative">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="grid md:grid-cols-2 gap-8 p-6 md:p-12">
                  {/* Left: Images */}
                  <div className="space-y-4">
                    <motion.div
                      key={`${selectedImage}-${selectedColor?.name}-${selectedMaterial?.name}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100"
                    >
                      <motion.img
                        src={currentImage}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        animate={{
                          rotateY: [0, 5, 0, -5, 0],
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.div>

                    {/* Thumbnails */}
                    <div className="flex gap-3">
                      {product.images.map((image: string, index: number) => (
                        <motion.button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`relative w-20 h-20 rounded-lg overflow-hidden ${
                            selectedImage === index ? 'ring-2 ring-gray-900' : ''
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Right: Details */}
                  <div className="space-y-6">
                    <div>
                      <Badge className="mb-2 capitalize">{product.category}</Badge>
                      <h2 className="text-4xl mb-3">{product.name}</h2>
                      {product.rating !== undefined && product.reviews !== undefined && (
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center">
                            <span className="text-yellow-500 text-xl">★</span>
                            <span className="ml-1 text-lg">{product.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-gray-500">({product.reviews} reviews)</span>
                        </div>
                      )}

                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-4xl">${product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="text-xl text-gray-400 line-through">
                            ${product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 leading-relaxed">{product.description}</p>
                    </div>

                    {/* Customization */}
                    {product.customizable && (
                      <Tabs defaultValue="color" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="color">Color</TabsTrigger>
                          <TabsTrigger value="material">Material</TabsTrigger>
                          <TabsTrigger value="size">Size</TabsTrigger>
                        </TabsList>

                        <TabsContent value="color" className="space-y-3">
                          <div className="text-sm">Choose your color</div>
                          <div className="flex flex-wrap gap-3">
                            {product.colors?.map((color: any) => (
                              <motion.button
                                key={color.name}
                                onClick={() => setSelectedColor(color)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`w-12 h-12 rounded-full border-2 ${
                                  selectedColor?.name === color.name ? 'border-gray-900' : 'border-gray-200'
                                } relative`}
                                style={{ backgroundColor: color.hex }}
                              >
                                {selectedColor?.name === color.name && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Check className="w-5 h-5 text-white drop-shadow-lg" />
                                  </div>
                                )}
                              </motion.button>
                            ))}
                          </div>
                          {selectedColor && (
                            <div className="text-sm text-gray-600">Selected: {selectedColor.name}</div>
                          )}
                        </TabsContent>

                        <TabsContent value="material" className="space-y-3">
                          <div className="text-sm">Choose your material</div>
                          <div className="grid grid-cols-2 gap-3">
                            {product.materials?.map((material: any) => (
                              <motion.button
                                key={material.name}
                                onClick={() => setSelectedMaterial(material)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-4 border-2 rounded-lg ${
                                  selectedMaterial?.name === material.name
                                    ? 'border-gray-900 bg-gray-50'
                                    : 'border-gray-200'
                                }`}
                              >
                                {material.name}
                              </motion.button>
                            ))}
                          </div>
                        </TabsContent>

                        <TabsContent value="size" className="space-y-4">
                          <div className="text-sm">Choose your size</div>
                          <div className="grid grid-cols-2 gap-3">
                            {product.sizes?.map((size: string, index: number) => (
                              <motion.button
                                key={`${size}-${index}`}
                                onClick={() => setSelectedSize(size)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-4 border-2 rounded-lg ${
                                  selectedSize === size
                                    ? 'border-gray-900 bg-gray-50'
                                    : 'border-gray-200'
                                }`}
                              >
                                {size}
                              </motion.button>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    )}

                    {/* Quantity Selector */}
                    <div className="space-y-3">
                      <div className="text-sm">Quantity</div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-xl w-12 text-center">{quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={handleAddToCart}
                      disabled={!product.inStock}
                    >
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>

                    {/* Features */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                      <div className="text-center">
                        <Truck className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                        <div className="text-xs text-gray-600">Free Delivery</div>
                      </div>
                      <div className="text-center">
                        <Shield className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                        <div className="text-xs text-gray-600">10 Year Warranty</div>
                      </div>
                      <div className="text-center">
                        <RotateCcw className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                        <div className="text-xs text-gray-600">120 Day Returns</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
