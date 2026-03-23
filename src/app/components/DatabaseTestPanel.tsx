import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, XCircle, Loader2, X } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { useTheme } from '../contexts/ThemeContext';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-14217f91`;

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  icon: any;
}

export function DatabaseTestPanel({ onClose }: { onClose: () => void }) {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Server Health', status: 'pending', message: 'Checking server connection...', icon: Database },
    { name: 'KV Store', status: 'pending', message: 'Testing key-value store...', icon: CheckCircle2 },
  ]);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    // Test 1: Server Health
    try {
      const response = await fetch(
        `${API_URL}/health`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      
      if (response.ok) {
        updateTest(0, 'success', '✅ Server is running and accessible');
      } else {
        updateTest(0, 'error', '❌ Server returned an error');
      }
    } catch (error) {
      updateTest(0, 'error', `❌ Cannot connect to server: ${error}`);
    }

    // Test 2: KV Store
    setTimeout(async () => {
      try {
        const testKey = 'test_connection_key';
        const testValue = { test: 'value', timestamp: Date.now() };

        // Try to write to KV store via API
        const writeResponse = await fetch(
          `${API_URL}/test-kv`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key: testKey, value: testValue }),
          }
        );

        if (writeResponse.ok) {
          updateTest(1, 'success', '✅ Key-value store is working');
        } else {
          updateTest(1, 'error', '❌ Key-value store failed');
        }
      } catch (error) {
        updateTest(1, 'error', `❌ KV store error: ${error}`);
      }
    }, 1000);
  };

  const updateTest = (index: number, status: 'success' | 'error', message: string) => {
    setTests(prev => {
      const newTests = [...prev];
      newTests[index] = { ...newTests[index], status, message };
      return newTests;
    });
  };

  const allTestsComplete = tests.every(t => t.status !== 'pending');
  const allTestsPassed = tests.every(t => t.status === 'success');

  const currentTheme = useTheme();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-md w-full shadow-2xl border border-gray-700 overflow-hidden">
        {/* Header */}
        <div 
          className="p-6 text-white relative"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <Database className="w-7 h-7" />
            <div>
              <h2 className="text-xl font-bold">Database Connection Test</h2>
              <p className="text-white/80 text-sm">Verifying Supabase integration</p>
            </div>
          </div>
        </div>

        {/* Tests */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {tests.map((test, index) => {
            const Icon = test.icon;
            return (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-4 border border-gray-700"
              >
                <div className="flex items-start gap-3">
                  {/* Status Icon */}
                  <div className="mt-0.5">
                    {test.status === 'pending' && (
                      <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                    )}
                    {test.status === 'success' && (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    )}
                    {test.status === 'error' && (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-gray-400" />
                      <h3 className="font-semibold text-gray-100 text-sm">
                        {test.name}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-400">{test.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {allTestsComplete && (
          <div className={`p-4 border-t border-gray-700 ${
            allTestsPassed ? 'bg-green-500/10' : 'bg-red-500/10'
          }`}>
            <p className={`text-sm text-center font-semibold ${
              allTestsPassed ? 'text-green-400' : 'text-red-400'
            }`}>
              {allTestsPassed 
                ? '🎉 All tests passed! Database is connected.' 
                : '⚠️ Some tests failed. Check the messages above.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}