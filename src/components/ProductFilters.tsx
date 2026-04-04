import { motion } from 'motion/react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

interface ProductFiltersProps {
  onFilterChange: (filters: any) => void;
}

export function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState('featured');
  const [inStock, setInStock] = useState(false);

  const handleApplyFilters = () => {
    onFilterChange({
      priceRange,
      sortBy,
      inStock
    });
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    setPriceRange([0, 5000]);
    setSortBy('featured');
    setInStock(false);
    onFilterChange({
      priceRange: [0, 5000],
      sortBy: 'featured',
      inStock: false
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
      >
        <SlidersHorizontal className="w-5 h-5" />
        <span>Filters</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Filter panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed left-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Filter options */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Sort by */}
              <div>
                <label className="block text-sm mb-3">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* Price range */}
              <div>
                <label className="block text-sm mb-3">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

              {/* Quick filters */}
              <div>
                <label className="block text-sm mb-3">Quick Filters</label>
                <div className="space-y-2">
                  <button className="w-full text-left px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    Free Delivery
                  </button>
                  <button className="w-full text-left px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    Australian Made
                  </button>
                  <button className="w-full text-left px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    Sustainable Materials
                  </button>
                  <button className="w-full text-left px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    10+ Year Warranty
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-6 space-y-3">
              <button
                onClick={handleApplyFilters}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
              >
                Apply Filters
              </button>
              <button
                onClick={handleResetFilters}
                className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
              >
                Reset All
              </button>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}
