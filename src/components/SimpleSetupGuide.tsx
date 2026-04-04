import { useState } from 'react';
import { motion } from 'motion/react';
import { Database, ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

interface SimpleSetupGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const SQL_QUERY = `CREATE TABLE IF NOT EXISTS public.kv_store_e9dccf07 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);`;

const SUPABASE_SQL_URL = 'https://supabase.com/dashboard/project/awmgkhticthegwazfkoq/sql';

export function SimpleSetupGuide({ isOpen, onClose }: SimpleSetupGuideProps) {
  const [step, setStep] = useState<'guide' | 'waiting'>('guide');

  const handleOpenAndContinue = () => {
    window.open(SUPABASE_SQL_URL, '_blank');
    setStep('waiting');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full"
      >
        {step === 'guide' ? (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-white rounded-t-2xl">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-10 h-10 flex-shrink-0" />
                <div>
                  <h2 className="text-3xl mb-2">Database Setup Required</h2>
                  <p className="text-red-100 text-lg">
                    Table not found: kv_store_e9dccf07
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* Simple Explanation */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
                <p className="text-lg text-amber-900">
                  <strong>Your Supabase database is empty.</strong> You need to create a storage table before the app can work.
                </p>
              </div>

              {/* Quick Instructions */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Do This Now:</h3>
                
                {/* The SQL */}
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-700">
                    1. Copy this SQL:
                  </p>
                  <div className="relative">
                    <textarea
                      readOnly
                      value={SQL_QUERY}
                      onClick={(e) => {
                        e.currentTarget.select();
                        try {
                          document.execCommand('copy');
                        } catch (err) {
                          // Ignore copy errors
                        }
                      }}
                      className="w-full bg-gray-900 text-gray-100 p-6 rounded-xl text-base font-mono h-28 resize-none border-4 border-blue-500 cursor-text focus:outline-none focus:border-blue-600"
                    />
                    <div className="absolute top-3 right-3 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                      ← Click to select, then Ctrl+C
                    </div>
                  </div>
                </div>

                {/* Open Supabase */}
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-700">
                    2. Open Supabase SQL Editor and paste it:
                  </p>
                  <Button
                    onClick={handleOpenAndContinue}
                    className="w-full bg-green-600 hover:bg-green-700 text-white h-16 text-xl gap-3"
                  >
                    <ExternalLink className="w-6 h-6" />
                    Open Supabase SQL Editor
                  </Button>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 space-y-2">
                  <p className="font-bold text-blue-900 text-lg">In Supabase:</p>
                  <ol className="space-y-2 text-blue-800 text-base">
                    <li>✓ Paste the SQL you copied</li>
                    <li>✓ Click the green <strong>"RUN"</strong> button</li>
                    <li>✓ Wait for success message</li>
                    <li>✓ Come back here and refresh</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t bg-gray-50 p-6 rounded-b-2xl flex justify-between items-center">
              <p className="text-gray-600">
                This is a one-time setup
              </p>
              <Button
                onClick={handleOpenAndContinue}
                className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 text-lg"
              >
                Open Supabase →
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Waiting State */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white rounded-t-2xl">
              <div className="flex items-start gap-4">
                <Database className="w-10 h-10 flex-shrink-0" />
                <div>
                  <h2 className="text-3xl mb-2">Waiting for Setup...</h2>
                  <p className="text-blue-100 text-lg">
                    Complete the setup in Supabase, then come back
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* Checklist */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Checklist:</h3>
                <div className="space-y-3 text-lg">
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-green-900">Pasted SQL in Supabase SQL Editor</p>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-green-900">Clicked the green "RUN" button</p>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-green-900">Saw success message in Supabase</p>
                  </div>
                </div>
              </div>

              {/* Done */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-xl p-8 text-center space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">All Done?</h3>
                <p className="text-lg text-gray-700">
                  Click the button below to reload the app
                </p>
                <Button
                  onClick={handleRefresh}
                  className="bg-green-600 hover:bg-green-700 text-white h-16 px-12 text-xl gap-3"
                >
                  <CheckCircle className="w-6 h-6" />
                  Refresh App - I Created the Table
                </Button>
              </div>

              {/* Back button */}
              <div className="text-center">
                <button
                  onClick={() => setStep('guide')}
                  className="text-blue-600 hover:underline text-base"
                >
                  ← Go back to instructions
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
