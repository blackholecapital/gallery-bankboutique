import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/primitives/Button';
import { useEstimate } from '@/estimate-save-path/EstimateProvider';
import { productFixtures, slugifyProductName } from '@/product-intake-model/Product';
import { routePaths } from '@/routes/paths';

const MAX_MESSAGE_LENGTH = 500;

export function EstimateSavePath() {
  const { items, removeProduct, clearAll, setActiveProductId, setCheckoutProductId } = useEstimate();
  const navigate = useNavigate();
  const [requestOpen, setRequestOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const closeRequest = () => {
    setRequestOpen(false);
    setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No backend wired up — in a real app this would POST the
    // selected items + contact details to the estimate endpoint.
    setSubmitted(true);
    setEmail('');
    setPhone('');
    setMessage('');
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50/60">
            <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
          </div>
          <p className="text-[15px] font-black text-blue-600 drop-shadow-[0_2px_4px_rgba(37,99,235,0.25)]">Your Build is Empty</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
            Browse the gallery and tap <strong>Add</strong> to save products to your build.
          </p>
          <Link to="/browse">
            <Button className="mt-5" variant="secondary">Browse</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Collect recommended modules (other products not in estimate)
  const estimateNames = new Set(items.map((i) => i.product.name));
  const recommendedModules = productFixtures.filter((p) => !estimateNames.has(p.name));

  return (
    <div className="space-y-5 px-4 pb-6 pt-4 mx-2 mt-1 rounded-[1.75rem] border border-white/50 bg-white/60 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-2px_rgba(0,0,0,0.06)] backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[14px] font-black tracking-tight text-blue-600 drop-shadow-[0_2px_4px_rgba(37,99,235,0.25)]">My Build</p>
          <p className="text-[13px] text-slate-500">{items.length} product{items.length !== 1 ? 's' : ''} selected</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const last = items[items.length - 1]?.product;
              if (last) setCheckoutProductId(slugifyProductName(last.name));
              navigate(routePaths.cart);
            }}
            className="rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-blue-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)] transition hover:brightness-105 active:scale-95"
          >
            Buy it now
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] font-medium text-slate-400 transition hover:text-red-500"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Estimate items */}
      <div className="space-y-3">
        {items.map(({ product }) => (
          <Link
            key={product.name}
            to={product.actionPath}
            onClick={() => setActiveProductId(slugifyProductName(product.name))}
            className="flex gap-3 rounded-xl border border-white/30 bg-white/40 p-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition hover:border-blue-200 hover:bg-white/60 hover:shadow-md"
          >
            <img
              src={product.orderedImages[0]}
              alt={product.name}
              className="h-16 w-20 shrink-0 rounded-lg object-cover"
            />
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[13px] font-bold text-slate-900">{product.name}</p>
                  <span className="font-mono text-[9px] font-semibold tracking-wide text-slate-400">ID {product.id}</span>
                </div>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{product.oneLinePromise}</p>
                <p className="mt-0.5 text-[11px] font-bold text-slate-700">
                  Setup ${product.setupPrice} · ${product.monthlyPrice}/{product.monthlyLabel ?? 'mo'}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeProduct(product.name);
                }}
                className="mt-1 self-start text-[10px] font-medium text-slate-400 transition hover:text-red-500"
              >
                Remove
              </button>
            </div>
          </Link>
        ))}
      </div>

      {/* Included modules */}
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Included Modules</p>
        <div className="flex flex-wrap gap-1.5">
          {items.map(({ product }) => (
            <span
              key={product.name}
              className="rounded-full bg-blue-50/60 px-2.5 py-1 text-[10px] font-semibold text-blue-600"
            >
              {product.name}
            </span>
          ))}
        </div>
      </div>

      {/* Recommended additions */}
      {recommendedModules.length > 0 && (
        <div className="space-y-2.5 border-t border-slate-100 pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Add More to Your Build</p>
          <div className="flex gap-2.5 overflow-x-auto pb-1">
            {recommendedModules.map((product) => (
              <Link
                key={product.name}
                to={product.actionPath}
                onClick={() => setActiveProductId(slugifyProductName(product.name))}
                className="flex w-[100px] shrink-0 flex-col overflow-hidden rounded-xl border border-white/30 bg-white/40 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition hover:border-blue-200 hover:shadow-md"
              >
                <img
                  src={product.orderedImages[0]}
                  alt={product.name}
                  className="aspect-[4/3] w-full object-cover"
                />
                <p className="px-2 py-1.5 text-[10px] font-semibold leading-tight text-slate-700">{product.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Request Estimate CTA — sits directly under Add More */}
      <div>
        <Button
          onClick={() => setRequestOpen(true)}
          className="w-full min-h-11 rounded-2xl text-[14px] font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-blue-600 shadow-[0_2px_12px_rgba(37,99,235,0.3)]"
        >
          Request Estimate
        </Button>
      </div>

      {/* Request Estimate popup */}
      {requestOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={closeRequest}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-white/60 bg-white p-5 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="text-[16px] font-black tracking-tight text-blue-600 drop-shadow-[0_2px_4px_rgba(37,99,235,0.25)]">Request Estimate</p>
                <p className="mt-0.5 text-[11px] text-slate-500">We'll reply with pricing and next steps.</p>
              </div>
              <button
                type="button"
                onClick={closeRequest}
                aria-label="Close"
                className="text-slate-400 transition hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {submitted ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-[14px] font-bold text-slate-900">Request sent</p>
                <p className="mt-1 text-[12px] text-slate-500">Thanks — we'll be in touch shortly.</p>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeRequest}
                  className="mt-4"
                >
                  Close
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Selected items as tags */}
                <div>
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Items ({items.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map(({ product }) => (
                      <span
                        key={product.name}
                        className="rounded-full bg-blue-50/80 px-2.5 py-1 text-[10px] font-semibold text-blue-600"
                      >
                        {product.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Email — required */}
                <div>
                  <label htmlFor="estimate-email" className="mb-1 block text-[11px] font-semibold text-slate-600">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="estimate-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                {/* Phone — optional */}
                <div>
                  <label htmlFor="estimate-phone" className="mb-1 block text-[11px] font-semibold text-slate-600">
                    Phone <span className="text-slate-400">(optional)</span>
                  </label>
                  <input
                    id="estimate-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 123 4567"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                {/* Message — 500 char limit */}
                <div>
                  <label htmlFor="estimate-message" className="mb-1 block text-[11px] font-semibold text-slate-600">
                    Your Request
                  </label>
                  <textarea
                    id="estimate-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                    maxLength={MAX_MESSAGE_LENGTH}
                    rows={4}
                    placeholder="Tell us about your project, timeline, and any specific needs…"
                    className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                  />
                  <p className="mt-1 text-right text-[10px] text-slate-400">
                    {message.length}/{MAX_MESSAGE_LENGTH}
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full min-h-11 rounded-2xl text-[14px] font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-blue-600 shadow-[0_2px_12px_rgba(37,99,235,0.3)]"
                >
                  Submit Request
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
