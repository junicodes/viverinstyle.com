import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { migration } from '../utils/api';
import { Button } from './ui/button';

interface MigrationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function MigrationWizard({ isOpen, onClose, onComplete }: MigrationWizardProps) {
  const [step, setStep] = useState<'detect' | 'migrate' | 'success' | 'error'>('detect');
  const [hasLocalData, setHasLocalData] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      // Check for local data
      const hasData = migration.hasLocalData();
      setHasLocalData(hasData);
      setStep(hasData ? 'detect' : 'success');
    }
  }, [isOpen]);

  const handleMigrate = async () => {
    setMigrating(true);
    setStep('migrate');

    try {
      const migrationResult = await migration.migrateToSupabase();
      
      if (migrationResult.success) {
        setResult(migrationResult);
        setStep('success');
        
        // Clear localStorage
        migration.clearLocalData();
        
        // Notify parent to refresh data
        setTimeout(() => {
          onComplete();
        }, 1000);
      } else {
        setResult(migrationResult);
        setStep('error');
      }
    } catch (error) {
      console.error('Migration error:', error);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      setStep('error');
    } finally {
      setMigrating(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl">Supabase Migration</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 'detect' && hasLocalData && (
              <motion.div
                key="detect"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <Upload className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">
                      Local Data Detected
                    </h3>
                    <p className="text-sm text-blue-700">
                      We found data in your browser's localStorage. Would you like to migrate it to Supabase cloud storage?
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>✅ Your data will be stored in the cloud</p>
                  <p>✅ Access from any device</p>
                  <p>✅ Never lose your products</p>
                  <p>✅ Automatic backups</p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleMigrate}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Migrate to Cloud
                  </Button>
                  <Button
                    onClick={handleSkip}
                    variant="outline"
                    className="flex-1"
                  >
                    Skip for Now
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 'migrate' && (
              <motion.div
                key="migrate"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 text-center py-8"
              >
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Migrating Data...
                  </h3>
                  <p className="text-sm text-gray-600">
                    Uploading your products and categories to Supabase
                  </p>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1">
                      {hasLocalData ? 'Migration Complete!' : 'Cloud Connected!'}
                    </h3>
                    <p className="text-sm text-green-700">
                      {result?.message || 'Your data is now stored in Supabase cloud database.'}
                    </p>
                  </div>
                </div>

                {result && (
                  <div className="text-sm text-gray-600 space-y-1">
                    {result.categoriesSeeded > 0 && (
                      <p>📁 {result.categoriesSeeded} categories uploaded</p>
                    )}
                    {result.productsSeeded > 0 && (
                      <p>📦 {result.productsSeeded} products uploaded</p>
                    )}
                  </div>
                )}

                <Button
                  onClick={onClose}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Continue
                </Button>
              </motion.div>
            )}

            {step === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-1">
                      Migration Failed
                    </h3>
                    <p className="text-sm text-red-700">
                      {result?.message || 'Failed to migrate data to Supabase.'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleMigrate}
                    variant="outline"
                    className="flex-1"
                    disabled={migrating}
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={onClose}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
