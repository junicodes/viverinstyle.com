import { useState, useEffect } from 'react';
import { X, Plus, Palette, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner@2.0.3';
import { projectId } from '../../utils/supabase/info';
import { LoadingOverlay } from '../ui/LoadingOverlay';
import { getSupabaseClient } from '../../utils/supabase/client';

interface AddProductFormProps {
  categories: any[];
  product?: any; // For editing existing product
  onSuccess: () => void;
  onCancel: () => void;
}

const PRESET_COLORS = [
  { name: 'Charcoal', hex: '#36454F' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#000000' },
  { name: 'Grey', hex: '#808080' },
  { name: 'Brown', hex: '#A52A2A' },
  { name: 'Cream', hex: '#FFFDD0' },
  { name: 'Tan', hex: '#D2B48C' },
  { name: 'Olive', hex: '#808000' },
  { name: 'Sage', hex: '#9DC183' },
  { name: 'Terracotta', hex: '#E2725B' },
  { name: 'Rust', hex: '#B7410E' },
  { name: 'Burgundy', hex: '#800020' },
  { name: 'Forest Green', hex: '#228B22' },
  { name: 'Mustard', hex: '#FFDB58' },
];

export default function AddProductForm({ categories, product, onSuccess, onCancel }: AddProductFormProps) {
  const isEditMode = !!product;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  
  // Helper to get fresh access token
  const getAccessToken = async () => {
    const supabase = getSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };
  const [imageUrls, setImageUrls] = useState(['']);
  const [selectedColors, setSelectedColors] = useState<Array<{ name: string; hex?: string }>>([]);
  const [customColor, setCustomColor] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    category: '',
    stock: '1',
    featured: false,
    shippingCost: '',
    width: '',
    height: '',
    depth: '',
    material: '',
    videoUrl: '',
    materialVariants: '',
  });

  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      // Parse dimensions - handle both string and object formats
      const dimsString = typeof product.dimensions === 'string' ? product.dimensions : '';
      const dims = dimsString ? dimsString.split(' x ') : [];
      
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category: product.category || '',
        stock: product.stock?.toString() || '',
        featured: product.featured || false,
        shippingCost: product.shippingCost?.toString() ?? '',
        width: dims[0] || '',
        height: dims[1] || '',
        depth: dims[2] || '',
        material: product.material || '',
        videoUrl: product.videoUrl || '',
        materialVariants: Array.isArray(product.materialVariants) ? product.materialVariants.join(', ') : (product.materialVariants || ''),
      });

      // Set images
      const images = product.images || (product.image ? [product.image] : []);
      setImageUrls(images.length > 0 ? images : ['']);

      // Set colors - parse both preset and custom colors
      if (product.colors) {
        // Handle both string and array formats
        const colorArray = Array.isArray(product.colors) 
          ? product.colors 
          : (typeof product.colors === 'string' ? product.colors.split(',').map((c: string) => c.trim()) : []);
        
        const parsedColors = colorArray.map((colorItem: any, index: number) => {
          // If colorItem is already an object with hex/name properties
          if (typeof colorItem === 'object' && colorItem !== null) {
            return {
              name: colorItem.name || `Color ${index + 1}`,
              hex: colorItem.hex
            };
          }
          
          // If it's a string, parse it
          const colorName = String(colorItem).trim();
          const preset = PRESET_COLORS.find(c => c.name === colorName);
          if (preset) {
            return { name: preset.name, hex: preset.hex };
          }
          // Check if it's a hex code
          if (/^#[0-9A-F]{6}$/i.test(colorName)) {
            return { name: colorName, hex: colorName };
          }
          // Custom color name without hex
          return { name: colorName };
        });
        setSelectedColors(parsedColors);
      }
    }
  }, [product]);

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData({ ...formData, name, slug });
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrl = (index: number) => {
    if (imageUrls.length > 1) {
      setImageUrls(imageUrls.filter((_, i) => i !== index));
    }
  };

  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const toggleColor = (colorName: string, hex: string) => {
    const exists = selectedColors.find(c => c.name === colorName);
    if (exists) {
      setSelectedColors(selectedColors.filter(c => c.name !== colorName));
    } else {
      setSelectedColors([...selectedColors, { name: colorName, hex }]);
    }
  };

  const addCustomColor = () => {
    if (!customColor) return;
    
    // Check if already added
    if (selectedColors.find(c => c.name === customColor || c.name === customColorHex)) {
      toast.error('Color already added');
      return;
    }

    // Check if it's a valid hex code
    const isHexCode = /^#[0-9A-F]{6}$/i.test(customColor);
    
    if (isHexCode) {
      // If user entered a hex code, use it as both name and hex
      setSelectedColors([...selectedColors, { name: customColor, hex: customColor }]);
    } else {
      // Custom color name with the selected hex value
      setSelectedColors([...selectedColors, { name: customColor, hex: customColorHex }]);
    }
    
    setCustomColor('');
    setCustomColorHex('#000000');
  };

  const removeColor = (colorName: string) => {
    setSelectedColors(selectedColors.filter(c => c.name !== colorName));
  };

  const generateAIDescription = async () => {
    if (!formData.name) {
      toast.error('Please enter a product name first');
      return;
    }

    try {
      setIsGeneratingDescription(true);
      
      const token = await getAccessToken();
      if (!token) {
        toast.error('Session expired. Please log in again.');
        return;
      }
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/admin/ai-description`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productName: formData.name,
            category: formData.category,
            material: formData.material,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setFormData(prev => ({ ...prev, description: data.description }));
        toast.success('AI description generated!');
      } else {
        toast.error(data.error || 'Failed to generate description');
      }
    } catch (error) {
      console.error('Error generating AI description:', error);
      toast.error('An error occurred while generating description');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const isColorSelected = (colorName: string) => {
    return selectedColors.some(c => c.name === colorName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.price || !formData.category || !formData.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    const validImageUrls = imageUrls.filter(url => url.trim());
    if (validImageUrls.length === 0) {
      toast.error('Please add at least one image URL');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Build dimensions string
      const dimensions = [formData.width, formData.height, formData.depth]
        .filter(Boolean)
        .join(' x ');
      
      // Build colors string - use the name for display
      const colorsString = selectedColors.map(c => c.name).join(', ');
      
      const stockQty = parseInt(formData.stock);
      const productData = {
        ...formData,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        price: parseFloat(formData.price),
        stock: stockQty,
        inStock: stockQty > 0,
        image: validImageUrls[0],
        images: validImageUrls,
        colors: colorsString,
        dimensions: dimensions || undefined,
        rating: product?.rating ?? 4.5 + Math.random() * 0.4,
        reviews: product?.reviews ?? 0,
        shippingCost: formData.shippingCost !== '' ? parseFloat(formData.shippingCost) : undefined,
        videoUrl: formData.videoUrl || undefined,
        materialVariants: formData.materialVariants ? formData.materialVariants.split(',').map(v => v.trim()).filter(Boolean) : undefined,
      };

      const url = isEditMode
        ? `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/admin/products/${product.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/admin/products`;
      
      const token = await getAccessToken();
      if (!token) {
        toast.error('Session expired. Please log in again.');
        return;
      }
      
      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        toast.success(isEditMode ? 'Product updated successfully!' : 'Product added successfully!');
        onSuccess();
      } else {
        const errorText = await response.text();
        console.error(`Failed to ${isEditMode ? 'update' : 'add'} product:`, response.status, errorText);
        toast.error(`Failed to ${isEditMode ? 'update' : 'add'} product`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} product:`, error);
      toast.error(`An error occurred while ${isEditMode ? 'updating' : 'adding'} the product`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && (
        <LoadingOverlay message={isEditMode ? 'Updating product...' : 'Adding product...'} />
      )}
      
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl mb-2">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isEditMode ? 'Update product information' : 'Create a new product in your catalog'}
              </p>
            </div>
            <Button
              variant="ghost"
            onClick={onCancel}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6 border border-gray-200 dark:border-zinc-800">
            <h2 className="text-xl mb-6 text-gray-900 dark:text-gray-100">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 mb-2 block">
                  Product Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Cloud Modern Sofa"
                  className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-900 dark:focus:border-white"
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="slug" className="text-gray-700 dark:text-gray-300 mb-2 block">
                  URL Slug
                  <span className="text-xs text-gray-500 dark:text-gray-500 ml-2 font-normal">
                    (auto-generated from name)
                  </span>
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="cloud-modern-sofa"
                  className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-900 dark:focus:border-white"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="description" className="text-gray-700 dark:text-gray-300 mb-2 block">
                  Description
                </Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your product..."
                  rows={4}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-gray-900 dark:focus:border-white"
                />
                <div className="mt-2">
                  <Button
                    type="button"
                    onClick={generateAIDescription}
                    disabled={isGeneratingDescription}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 w-full sm:w-auto"
                  >
                    {isGeneratingDescription ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Generating AI Description...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span>Generate AI Description</span>
                      </div>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    AI will create a professional product description based on the name, category, and material
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="category" className="text-gray-700 dark:text-gray-300 mb-2 block">
                  Category <span className="text-red-500">*</span>
                </Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat: any) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="material" className="text-gray-700 dark:text-gray-300 mb-2 block">
                  Material
                </Label>
                <Input
                  id="material"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  placeholder="e.g., Velvet, Leather"
                  className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-900 dark:focus:border-white"
                />
              </div>

              <div>
                <Label htmlFor="price" className="text-gray-700 dark:text-gray-300 mb-2 block">
                  Price (AUD) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-900 dark:focus:border-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="stock" className="text-gray-700 dark:text-gray-300 mb-2 block">
                  Stock Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="1"
                  className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-900 dark:focus:border-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="shippingCost" className="text-gray-700 dark:text-gray-300 mb-2 block">
                  Shipping Cost (AUD)
                  <span className="text-xs text-gray-500 ml-2 font-normal">(0 = free, blank = use default)</span>
                </Label>
                <Input
                  id="shippingCost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.shippingCost}
                  onChange={(e) => setFormData({ ...formData, shippingCost: e.target.value })}
                  placeholder="Leave blank for default rate"
                  className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-900 dark:focus:border-white"
                />
              </div>

              <div className="col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Feature this product on homepage</span>
                </label>
              </div>

              <div>
                <Label htmlFor="materialVariants" className="text-gray-700 dark:text-gray-300 mb-2 block">
                  Material / Stone Variants
                  <span className="text-xs text-gray-500 ml-2 font-normal">(comma-separated, e.g., Marble, Oak, Walnut)</span>
                </Label>
                <Input
                  id="materialVariants"
                  value={formData.materialVariants}
                  onChange={(e) => setFormData({ ...formData, materialVariants: e.target.value })}
                  placeholder="e.g., Cream Travertine, Rosa Levanto, Calacatta Nero"
                  className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-900 dark:focus:border-white"
                />
              </div>

              <div>
                <Label htmlFor="videoUrl" className="text-gray-700 dark:text-gray-300 mb-2 block">
                  Product Video URL
                  <span className="text-xs text-gray-500 ml-2 font-normal">(YouTube, Vimeo, or direct MP4 link)</span>
                </Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=... or https://example.com/video.mp4"
                  className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-900 dark:focus:border-white"
                />
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6 border border-gray-200 dark:border-zinc-800">
            <h2 className="text-xl mb-6 text-gray-900 dark:text-gray-100">Dimensions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="width" className="text-gray-700 dark:text-gray-300 mb-2 block">
                  Width (cm)
                </Label>
                <Input
                  id="width"
                  value={formData.width}
                  onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                  placeholder="200"
                  className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-900 dark:focus:border-white"
                />
              </div>
              <div>
                <Label htmlFor="height" className="text-gray-700 dark:text-gray-300 mb-2 block">
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="85"
                  className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-900 dark:focus:border-white"
                />
              </div>
              <div>
                <Label htmlFor="depth" className="text-gray-700 dark:text-gray-300 mb-2 block">
                  Depth (cm)
                </Label>
                <Input
                  id="depth"
                  value={formData.depth}
                  onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
                  placeholder="90"
                  className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-900 dark:focus:border-white"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6 border border-gray-200 dark:border-zinc-800">
            <h2 className="text-xl mb-6 text-gray-900 dark:text-gray-100">Product Images <span className="text-red-500">*</span></h2>
            <div className="space-y-3">
              {imageUrls.map((url, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <Input
                      value={url}
                      onChange={(e) => updateImageUrl(index, e.target.value)}
                      placeholder={index === 0 ? 'Main image URL' : 'Additional image URL'}
                      className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-900 dark:focus:border-white"
                    />
                  </div>
                  {imageUrls.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImageUrl(index)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addImageUrl}
                className="w-full border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Image
              </Button>
            </div>
          </div>

          {/* Colors */}
          <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6 border border-gray-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl text-gray-900 dark:text-gray-100">Available Colors</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                <Palette className="h-4 w-4 mr-2" />
                {showColorPicker ? 'Hide' : 'Show'} Color Palette
              </Button>
            </div>

            {/* Selected Colors */}
            {selectedColors.length > 0 && (
              <div className="mb-6">
                <Label className="text-gray-700 dark:text-gray-300 mb-3 block">Selected Colors</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedColors.map((color, colorIndex) => {
                    return (
                      <div
                        key={`${color.name}-${colorIndex}`}
                        className="flex items-center gap-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-full px-4 py-2"
                      >
                        {color.hex && (
                          <div
                            className="w-4 h-4 rounded-full border border-gray-400 dark:border-zinc-600"
                            style={{ backgroundColor: color.hex }}
                          />
                        )}
                        <span className="text-sm">{color.name}</span>
                        <button
                          type="button"
                          onClick={() => removeColor(color.name)}
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color Palette */}
            {showColorPicker && (
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300 mb-3 block">Preset Colors</Label>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    {PRESET_COLORS.map((color) => {
                      const isSelected = isColorSelected(color.name);
                      return (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => toggleColor(color.name, color.hex)}
                          className={`group relative flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                            isSelected
                              ? 'bg-gray-100 dark:bg-zinc-800 border-2 border-gray-900 dark:border-white'
                              : 'bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 hover:border-gray-500 dark:hover:border-zinc-500'
                          }`}
                          title={color.name}
                        >
                          <div
                            className="w-8 h-8 rounded-full border-2 border-gray-400 dark:border-zinc-600"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-xs text-center text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300">
                            {color.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label className="text-gray-700 dark:text-gray-300 mb-3 block">Custom Color</Label>
                  <div className="flex gap-3 items-end">
                    <div className="flex-1">
                      <Input
                        value={customColor}
                        onChange={(e) => {
                          const value = e.target.value;
                          setCustomColor(value);
                          // If it's a valid hex code, update the color picker preview
                          if (/^#[0-9A-F]{6}$/i.test(value)) {
                            setCustomColorHex(value);
                          }
                        }}
                        placeholder="Enter color name or hex code (e.g., #FF66CC)"
                        className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-900 dark:focus:border-white"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        You can enter a color name or a hex code like #FF66CC
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Label className="text-gray-600 dark:text-gray-400 text-xs">Preview</Label>
                      <input
                        type="color"
                        value={customColorHex}
                        onChange={(e) => {
                          const hex = e.target.value.toUpperCase();
                          setCustomColorHex(hex);
                          // If custom color input is empty or not a hex, update it with the picked color
                          if (!customColor || !/^#[0-9A-F]{6}$/i.test(customColor)) {
                            setCustomColor(hex);
                          }
                        }}
                        className="w-12 h-12 rounded cursor-pointer bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700"
                        title="Pick a color"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={addCustomColor}
                      disabled={!customColor}
                      className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 min-w-[150px]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                  <span>{isEditMode ? 'Updating...' : 'Adding...'}</span>
                </div>
              ) : (
                isEditMode ? 'Update Product' : 'Add Product'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}