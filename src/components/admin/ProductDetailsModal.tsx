import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ProductDetailsModalProps {
  product: any;
  onClose: () => void;
}

export default function ProductDetailsModal({ product, onClose }: ProductDetailsModalProps) {
  // Parse colors if it's a string
  const parseColors = (colors: any) => {
    if (!colors) return [];
    if (Array.isArray(colors)) return colors;
    if (typeof colors === 'string') {
      return colors.split(',').map((c: string) => c.trim());
    }
    return [];
  };

  // Parse dimensions to handle both string and object formats
  const parseDimensions = (dimensions: any) => {
    if (!dimensions) return '';
    if (typeof dimensions === 'string') return dimensions;
    if (typeof dimensions === 'object') {
      // Handle object format {unit, depth, width, height}
      const parts = [];
      if (dimensions.width) parts.push(dimensions.width);
      if (dimensions.height) parts.push(dimensions.height);
      if (dimensions.depth) parts.push(dimensions.depth);
      return parts.join(' x ');
    }
    return '';
  };

  const colors = parseColors(product.colors);
  const images = product.images || (product.image ? [product.image] : []);
  const dimensionsText = parseDimensions(product.dimensions);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-zinc-900 rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900">
          <div>
            <h2 className="text-2xl text-gray-900 dark:text-white mb-1">Product Details</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Complete product information</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div className="space-y-4">
              <div className="bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                <img
                  src={images[0] || 'https://via.placeholder.com/600x400'}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400';
                  }}
                />
              </div>
              
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(1, 5).map((img: string, idx: number) => (
                    <div key={idx} className="bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                      <img
                        src={img}
                        alt={`${product.name} ${idx + 2}`}
                        className="w-full h-24 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {images.length > 5 && (
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  +{images.length - 5} more images
                </p>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-2xl text-gray-900 dark:text-white">{product.name}</h3>
                  {product.featured && (
                    <Badge className="bg-yellow-500 text-white">Featured</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">SKU: {product.slug}</p>
                <p className="text-3xl text-gray-900 dark:text-white mb-4">
                  ${product.price?.toFixed(2)}
                </p>
              </div>

              {/* Description */}
              {product.description && (
                <div className="border-t border-gray-200 dark:border-zinc-800 pt-4">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Description</h4>
                  <p className="text-gray-900 dark:text-white">{product.description}</p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 border-t border-gray-200 dark:border-zinc-800 pt-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Category</h4>
                  <p className="text-gray-900 dark:text-white capitalize">{product.category}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Stock</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={product.stock > 10 ? 'default' : product.stock > 0 ? 'secondary' : 'destructive'}>
                      {product.stock || 0} units
                    </Badge>
                  </div>
                </div>

                {product.material && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Material</h4>
                    <p className="text-gray-900 dark:text-white">{product.material}</p>
                  </div>
                )}

                {dimensionsText && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Dimensions</h4>
                    <p className="text-gray-900 dark:text-white">{dimensionsText} cm</p>
                  </div>
                )}
              </div>

              {/* Colors */}
              {colors.length > 0 && (
                <div className="border-t border-gray-200 dark:border-zinc-800 pt-4">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Available Colors</h4>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* All Images List */}
              {images.length > 0 && (
                <div className="border-t border-gray-200 dark:border-zinc-800 pt-4">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">All Images ({images.length})</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {images.map((img: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-zinc-800 rounded border border-gray-200 dark:border-zinc-700">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-zinc-700 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={img}
                            alt={`Image ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{img}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="border-t border-gray-200 dark:border-zinc-800 pt-4 text-xs text-gray-500 dark:text-gray-400">
                <p>Product ID: {product.id}</p>
                {product.createdAt && (
                  <p className="mt-1">Created: {new Date(product.createdAt).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-800"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}