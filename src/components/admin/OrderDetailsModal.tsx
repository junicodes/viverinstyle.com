import { useState, useRef } from 'react';
import { X, Package, Truck, CheckCircle, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface OrderDetailsModalProps {
  order: any;
  accessToken: string;
  onClose: () => void;
  onUpdate: () => void;
}

const ORDER_STATUSES = [
  { value: 'processing', label: 'Processing', icon: Package, color: 'bg-blue-500' },
  { value: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, color: 'bg-yellow-500' },
  { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'bg-green-500' },
];

export default function OrderDetailsModal({ order, accessToken, onClose, onUpdate }: OrderDetailsModalProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [deliveryImages, setDeliveryImages] = useState<string[]>(order.deliveryImages || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentStatusIndex = ORDER_STATUSES.findIndex(s => s.value === order.status);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setIsUpdatingStatus(true);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/admin/orders/${order.id.replace('order:', '')}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        toast.success('Order status updated successfully');
        onUpdate();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('An error occurred while updating order status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      setIsUploadingImage(true);

      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        // Upload image and update order
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-35e920f3/admin/orders/${order.id.replace('order:', '')}/delivery-image`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ 
              image: base64Image,
              fileName: file.name,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setDeliveryImages([...deliveryImages, data.imageUrl]);
          
          // Automatically mark as delivered when image is uploaded
          if (order.status !== 'delivered') {
            await handleStatusUpdate('delivered');
          } else {
            toast.success('Delivery image uploaded successfully');
            onUpdate();
          }
        } else {
          const error = await response.json();
          toast.error(error.error || 'Failed to upload image');
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('An error occurred while uploading image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'processing':
        return 'secondary';
      case 'out_for_delivery':
        return 'default';
      case 'delivered':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'text-blue-600 dark:text-blue-400';
      case 'out_for_delivery':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'delivered':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-zinc-800">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-gray-900 dark:text-white mb-1">
              Order #{order.id.replace('order:', '').slice(0, 8).toUpperCase()}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-AU', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Status */}
          <div className="hover:bg-gray-100 dark:hover:bg-zinc-800/50 rounded-lg p-6 border border-gray-200 dark:border-zinc-800 transition-colors">
            <h3 className="text-lg mb-4 text-gray-900 dark:text-white">Order Status</h3>
            
            {/* Status Progress */}
            <div className="flex items-center justify-between mb-6 relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700" style={{ zIndex: 0 }}>
                <div 
                  className="h-full bg-[#98867a] transition-all duration-500"
                  style={{ 
                    width: `${(currentStatusIndex / (ORDER_STATUSES.length - 1)) * 100}%` 
                  }}
                />
              </div>

              {/* Status Steps */}
              {ORDER_STATUSES.map((status, index) => {
                const Icon = status.icon;
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;

                return (
                  <div key={status.value} className="flex flex-col items-center flex-1 relative" style={{ zIndex: 1 }}>
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                        isCompleted 
                          ? 'bg-[#98867a] text-white' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                      } ${isCurrent ? 'ring-4 ring-[#98867a]/30' : ''}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className={`text-xs text-center ${isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                      {status.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Status Actions */}
            <div className="flex gap-2 mt-4">
              {ORDER_STATUSES.map((status, index) => {
                if (index <= currentStatusIndex) return null; // Don't show buttons for completed statuses

                return (
                  <Button
                    key={status.value}
                    onClick={() => handleStatusUpdate(status.value)}
                    disabled={isUpdatingStatus}
                    className="flex-1 bg-[#98867a] hover:bg-[#8a7a6d] text-white"
                  >
                    {isUpdatingStatus ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        Mark as {status.label}
                      </>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Customer Information */}
          <div className="hover:bg-gray-100 dark:hover:bg-zinc-800/50 rounded-lg p-6 border border-gray-200 dark:border-zinc-800 transition-colors">
            <h3 className="text-lg mb-4 text-gray-900 dark:text-white">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Name</p>
                <p className="text-gray-900 dark:text-white">{order.customerName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</p>
                <p className="text-gray-900 dark:text-white">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phone</p>
                <p className="text-gray-900 dark:text-white">{order.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="hover:bg-gray-100 dark:hover:bg-zinc-800/50 rounded-lg p-6 border border-gray-200 dark:border-zinc-800 transition-colors">
            <h3 className="text-lg mb-4 text-gray-900 dark:text-white">Shipping Address</h3>
            <div className="text-gray-900 dark:text-white">
              <p>{order.shippingAddress?.address}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postcode}
              </p>
              <p>{order.shippingAddress?.country || 'Australia'}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="hover:bg-gray-100 dark:hover:bg-zinc-800/50 rounded-lg p-6 border border-gray-200 dark:border-zinc-800 transition-colors">
            <h3 className="text-lg mb-4 text-gray-900 dark:text-white">Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-zinc-800/50 p-3 rounded-lg border border-gray-200 dark:border-zinc-800 transition-colors">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white">{item.name}</p>
                    {item.color && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">Color: {item.color}</p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>${order.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span>${order.shipping?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-lg text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>Total</span>
                <span>${order.total?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>

          {/* Delivery Proof */}
          <div className="hover:bg-gray-100 dark:hover:bg-zinc-800/50 rounded-lg p-6 border border-gray-200 dark:border-zinc-800 transition-colors">
            <h3 className="text-lg mb-4 text-gray-900 dark:text-white">Delivery Proof</h3>
            
            {deliveryImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {deliveryImages.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={image}
                      alt={`Delivery proof ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                No delivery images uploaded yet
              </p>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImage}
              variant="outline"
              className="w-full border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              {isUploadingImage ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Delivery Image
                </>
              )}
            </Button>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Uploading an image will automatically mark the order as delivered
            </p>
          </div>

          {/* Payment Information */}
          {order.paymentMethod && (
            <div className="hover:bg-gray-100 dark:hover:bg-zinc-800/50 rounded-lg p-6 border border-gray-200 dark:border-zinc-800 transition-colors">
              <h3 className="text-lg mb-4 text-gray-900 dark:text-white">Payment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Payment Method</p>
                  <p className="text-gray-900 dark:text-white capitalize">{order.paymentMethod}</p>
                </div>
                {order.paymentIntentId && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Payment ID</p>
                    <p className="text-gray-900 dark:text-white text-xs font-mono">{order.paymentIntentId}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}