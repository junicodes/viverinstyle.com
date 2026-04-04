import { useState } from 'react';
import { motion } from 'motion/react';
import { Database, ExternalLink, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

interface DatabaseSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const SQL_QUERY = `CREATE TABLE IF NOT EXISTS public.kv_store_e9dccf07 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_kv_store_e9dccf07_key_prefix 
ON public.kv_store_e9dccf07 
USING btree (key text_pattern_ops);`;

const SUPABASE_SQL_URL = 'https://supabase.com/dashboard/project/awmgkhticthegwazfkoq/sql';

export function DatabaseSetupWizard({ isOpen, onClose, onComplete }: DatabaseSetupWizardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Fallback copy method for when Clipboard API is blocked
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(SQL_QUERY)
          .then(() => {
            setCopied(true);
            toast.success('SQL copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
          })
          .catch(() => {
            // Fallback to textarea method
            copyWithTextarea();
          });
      } else {
        // Use textarea method
        copyWithTextarea();
      }
    } catch (error) {
      copyWithTextarea();
    }
  };

  const copyWithTextarea = () => {
    // Create temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = SQL_QUERY;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    
    try {
      textarea.select();
      textarea.setSelectionRange(0, 99999); // For mobile
      const success = document.execCommand('copy');
      
      if (success) {
        setCopied(true);
        toast.success('SQL copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } else {
        toast.error('Please manually copy the SQL', {
          description: 'Select the text and press Ctrl+C (or Cmd+C on Mac)',
        });
      }
    } catch (error) {
      toast.error('Please manually copy the SQL', {
        description: 'Select the text and press Ctrl+C (or Cmd+C on Mac)',
      });
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const handleOpenSupabase = () => {
    window.open(SUPABASE_SQL_URL, '_blank');
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-8 h-8" />
            <div>
              <h2 className="text-2xl">Database Setup Required</h2>
              <p className="text-blue-100 text-sm">One-time setup • Takes 30 seconds</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error Explanation */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-amber-900 mb-1">
                Table 'kv_store_e9dccf07' not found
              </p>
              <p className="text-amber-700">
                Your Supabase database is empty. You need to create the storage table to store products, categories, and orders.
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Follow these 3 steps:</h3>

            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Copy the SQL Query</h4>
                <div className="relative">
                  <textarea
                    readOnly
                    value={SQL_QUERY}
                    className="w-full bg-gray-900 text-gray-100 p-4 rounded-lg text-xs font-mono h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={(e) => e.currentTarget.select()}
                  />
                  <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-white text-xs flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  💡 Click the text to select all, then Ctrl+C (or Cmd+C) to copy
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Open Supabase SQL Editor</h4>
                <Button
                  onClick={handleOpenSupabase}
                  className="bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open SQL Editor
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  This will open your Supabase project's SQL editor in a new tab
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Run the Query</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                  <li>Paste the SQL you copied</li>
                  <li>Click the green <strong>"RUN"</strong> button</li>
                  <li>Wait for the success message</li>
                  <li>Come back here and click "Done" below</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Visual Guide */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Database className="w-4 h-4" />
              What this creates:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✅ Table: <code className="bg-blue-100 px-1.5 py-0.5 rounded">kv_store_e9dccf07</code></li>
              <li>✅ Storage for products, categories & orders</li>
              <li>✅ Fast search index for better performance</li>
              <li>✅ One-time setup, permanent storage</li>
            </ul>
          </div>

          {/* Help */}
          <details className="text-sm">
            <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
              Need help? Click here
            </summary>
            <div className="mt-2 p-3 bg-gray-50 rounded space-y-2 text-gray-700">
              <p><strong>Can't find SQL Editor?</strong></p>
              <p>In Supabase dashboard, look for "SQL Editor" in the left sidebar navigation.</p>
              
              <p className="mt-3"><strong>Error when running SQL?</strong></p>
              <p>Make sure you're logged into Supabase with the account that created the project.</p>
              
              <p className="mt-3"><strong>Table already exists?</strong></p>
              <p>That's okay! The <code>IF NOT EXISTS</code> clause prevents errors. Just click Done below.</p>
            </div>
          </details>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-6 flex items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            After creating the table, click Done to reload
          </p>
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleComplete}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Done - I Created the Table
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
