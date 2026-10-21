'use client';

import React, { useState } from 'react';
import { Terminal, Play, CheckCircle, AlertTriangle, Clock, RefreshCw } from 'lucide-react';

interface ApiPreset {
  name: string;
  method: 'GET' | 'POST';
  endpoint: string;
  headers?: Record<string, string>;
  body?: string;
  description: string;
}

const PRESETS: ApiPreset[] = [
  {
    name: 'Browse Offers (Groceries, Page 1)',
    method: 'GET',
    endpoint: '/api/v1/offers?page=1&limit=6&availableNow=true',
    description: 'Queries promotional offers with relational joins, filtering for active promotions.',
  },
  {
    name: 'Search Offers (keyword "Avocado")',
    method: 'GET',
    endpoint: '/api/v1/offers?search=Avocado',
    description: 'Searches offers across title, description, and supermarket name.',
  },
  {
    name: 'Register a New Supermarket',
    method: 'POST',
    endpoint: '/api/v1/supermarkets/register',
    body: JSON.stringify(
      {
        name: 'Trident Bay Area SuperMart',
        email: `contact.${Date.now()}@tridentbaymart.com`,
        phone: '+1 (415) 880-9922',
        address: '500 Howard Street, SOMA',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105',
        logoUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58',
      },
      null,
      2
    ),
    description: 'Registers a supermarket, enforces unique email, and returns minted API key.',
  },
  {
    name: 'Create Offer for Supermarket',
    method: 'POST',
    endpoint: '/api/v1/offers',
    body: JSON.stringify(
      {
        supermarketId: 'sm_trident_01',
        title: '35% Off Fresh Honeycrisp Organic Apples',
        description: 'Crisp, sweet, locally harvested organic apples from Yakima Valley orchards.',
        category: 'PRODUCE',
        discountType: 'PERCENTAGE',
        discountValue: 35,
        originalPrice: 4.99,
        couponCode: 'HONEY35',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 10 * 86400000).toISOString(),
        maxRedemptions: 300,
      },
      null,
      2
    ),
    description: 'Publishes a new promotional offer tied to a target supermarket via foreign key.',
  },
  {
    name: 'System & Relational DB Health',
    method: 'GET',
    endpoint: '/api/v1/health',
    description: 'Checks API status, database engine, active table counts, and uptime.',
  },
  {
    name: 'OpenAPI 3.1 Spec Document',
    method: 'GET',
    endpoint: '/api/v1/docs',
    description: 'Retrieves complete OpenAPI 3.1 machine-readable JSON schema.',
  },
];

export const ApiConsole: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [method, setMethod] = useState<'GET' | 'POST'>('GET');
  const [endpoint, setEndpoint] = useState<string>('/api/v1/offers?page=1&limit=6&availableNow=true');
  const [apiKey, setApiKey] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [responseJson, setResponseJson] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const applyPreset = (index: number) => {
    const p = PRESETS[index];
    setSelectedPreset(index);
    setMethod(p.method);
    setEndpoint(p.endpoint);
    setBody(p.body || '');
    setResponseJson(null);
    setResponseStatus(null);
  };

  const executeRequest = async () => {
    setLoading(true);
    setResponseJson(null);
    setResponseStatus(null);
    const start = performance.now();

    try {
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };
      if (apiKey) {
        headers['X-API-Key'] = apiKey.trim();
      }
      if (method === 'POST') {
        headers['Content-Type'] = 'application/json';
      }

      const res = await fetch(endpoint, {
        method,
        headers,
        body: method === 'POST' ? body : undefined,
      });

      const elapsed = Math.round(performance.now() - start);
      setResponseTime(elapsed);
      setResponseStatus(res.status);

      const json = await res.json();
      setResponseJson(JSON.stringify(json, null, 2));
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - start);
      setResponseTime(elapsed);
      setResponseStatus(500);
      setResponseJson(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Terminal className="w-6 h-6 text-blue-600 dark:text-sky-400" />
          <span>Interactive REST API Explorer & Playground</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Execute live HTTP requests against the Trident IT promotional offers endpoints. Observe real-time response payloads, RFC status codes, and relational integrity validations.
        </p>
      </div>

      {/* Preset Pills */}
      <div className="mb-6 flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
        <span className="text-xs font-semibold text-slate-500 shrink-0">Presets:</span>
        {PRESETS.map((p, idx) => (
          <button
            key={p.name}
            id={`preset-btn-${idx}`}
            onClick={() => applyPreset(idx)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedPreset === idx
                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-500'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            <span className="font-mono text-[10px] mr-1.5 opacity-80">{p.method}</span>
            <span>{p.name}</span>
          </button>
        ))}
      </div>

      {/* Request Console Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Request Configuration */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            {/* Method & URL Bar */}
            <div className="flex items-center space-x-2">
              <select
                id="select-api-method"
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className={`px-3 py-2.5 rounded-xl font-mono text-xs font-bold border focus:outline-none cursor-pointer ${
                  method === 'POST'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700'
                    : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 border-blue-300 dark:border-blue-700'
                }`}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>

              <input
                id="input-api-endpoint"
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Optional API Key Header */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Header: <code className="font-mono text-blue-600 dark:text-sky-400">X-API-Key</code> (Optional authentication)
              </label>
              <input
                id="input-api-header-key"
                type="password"
                placeholder="trsk_live_... (auto-permitted for demo)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Request Body Editor (for POST) */}
            {method === 'POST' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  JSON Request Body
                </label>
                <textarea
                  id="textarea-api-body"
                  rows={9}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              {PRESETS[selectedPreset]?.description}
            </p>
          </div>

          <button
            id="btn-send-api-req"
            onClick={executeRequest}
            disabled={loading}
            className="w-full mt-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{loading ? 'Executing Request...' : 'Send HTTP Request'}</span>
          </button>
        </div>

        {/* Right Column: Live Response Terminal */}
        <div className="bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                <span className="text-xs font-mono text-slate-400 ml-2">Response Viewer</span>
              </div>

              {responseStatus !== null && (
                <div className="flex items-center space-x-3 text-xs font-mono">
                  <span
                    className={`px-2 py-0.5 rounded font-bold ${
                      responseStatus >= 200 && responseStatus < 300
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}
                  >
                    HTTP {responseStatus}
                  </span>
                  {responseTime !== null && (
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{responseTime}ms</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Response Content */}
            <div className="h-[360px] overflow-auto rounded-lg bg-black/40 p-3 font-mono text-xs text-emerald-400">
              {loading ? (
                <div className="flex items-center justify-center h-full text-slate-500 space-x-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Waiting for server response...</span>
                </div>
              ) : responseJson ? (
                <pre className="whitespace-pre-wrap">{responseJson}</pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-600 text-center">
                  <Terminal className="w-8 h-8 mb-2 opacity-50" />
                  <p>Click &quot;Send HTTP Request&quot; to test the endpoint live.</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Runtime: Next.js 15 Node Route Handler</span>
            <span>Encoding: UTF-8 JSON</span>
          </div>
        </div>
      </div>
    </div>
  );
};
