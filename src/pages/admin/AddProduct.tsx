import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, type Collection } from '../../lib/api';

interface VariantRow {
  key: string;
  sizeEU: string;
  color: string;
  colorHex: string;
  priceModifier: number;
  stockQty: number;
}

function uid() {
  return Math.random().toString(36).slice(2);
}

const DEFAULT_SIZES = ['39', '40', '41', '42', '43', '44', '45'];

export default function AddProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Collections
  const [collections, setCollections] = useState<Collection[]>([]);
  useEffect(() => {
    api.get<{ collections: Collection[] }>('/collections').then((res) => setCollections(res.collections));
  }, []);

  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [heritageStory, setHeritageStory] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [tags, setTags] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // Variants
  const [variants, setVariants] = useState<VariantRow[]>([
    { key: uid(), sizeEU: '40', color: '', colorHex: '', priceModifier: 0, stockQty: 0 },
    { key: uid(), sizeEU: '41', color: '', colorHex: '', priceModifier: 0, stockQty: 0 },
    { key: uid(), sizeEU: '42', color: '', colorHex: '', priceModifier: 0, stockQty: 0 },
    { key: uid(), sizeEU: '43', color: '', colorHex: '', priceModifier: 0, stockQty: 0 },
  ]);

  const addVariant = () =>
    setVariants((prev) => [...prev, { key: uid(), sizeEU: '', color: '', colorHex: '', priceModifier: 0, stockQty: 0 }]);
  const removeVariant = (key: string) => setVariants((prev) => prev.filter((v) => v.key !== key));
  const updateVariant = (key: string, field: keyof VariantRow, value: string | number) =>
    setVariants((prev) => prev.map((v) => (v.key === key ? { ...v, [field]: value } : v)));

  // Images
  const [images, setImages] = useState<Array<{ url: string; altText: string; isMain: boolean; uploading?: boolean }>>([]);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploadError('');
    for (const file of files) {
      const placeholderKey = uid();
      setImages((prev) => [...prev, { url: '', altText: file.name, isMain: prev.length === 0, uploading: true }]);
      try {
        const form = new FormData();
        form.append('file', file);
        form.append('bucket', 'product-images');
        const res = await fetch('/api/upload', { method: 'POST', body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? 'Upload failed');
        setImages((prev) => {
          const idx = prev.findIndex((img) => img.uploading && img.altText === file.name);
          if (idx === -1) return prev;
          const next = [...prev];
          next[idx] = { url: data.url, altText: file.name, isMain: idx === 0, uploading: false };
          return next;
        });
      } catch (err: any) {
        setUploadError(err?.message ?? 'Upload failed');
        setImages((prev) => prev.filter((img) => !(img.uploading && img.altText === file.name)));
      }
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));
  const setMainImage = (idx: number) =>
    setImages((prev) => prev.map((img, i) => ({ ...img, isMain: i === idx })));

  // Submit
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent, publish: boolean) => {
    e.preventDefault();
    if (!name.trim()) { setFormError('Product name is required.'); return; }
    if (!price || Number(price) <= 0) { setFormError('Base price must be greater than 0.'); return; }
    if (variants.length === 0) { setFormError('Add at least one size variant.'); return; }
    if (images.length === 0) { setFormError('Upload at least one product image.'); return; }
    setFormError('');
    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        heritageStory: heritageStory.trim() || null,
        sku: sku.trim() || `BG-${Date.now()}`,
        price: Math.round(Number(price) * 100) / 100,
        compareAtPrice: compareAtPrice ? Math.round(Number(compareAtPrice) * 100) / 100 : null,
        collectionId: collectionId || null,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        isFeatured,
        isPublished: publish,
        variants: variants.map(({ sizeEU, color, colorHex, priceModifier, stockQty }) => ({
          sizeEU,
          color: color || null,
          colorHex: colorHex || null,
          priceModifier: Number(priceModifier),
          stockQty: Number(stockQty),
        })),
        images: images.map(({ url, altText, isMain }, order) => ({ url, altText, isMain, order })),
      };
      const res = await api.post<{ product: { id: string } }>('/admin/products', payload);
      navigate('/admin/products');
    } catch (err: any) {
      setFormError(err?.message ?? 'Failed to create product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-10 pb-20">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <nav className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-1">
              <Link to="/admin" className="hover:text-primary transition-colors">Dashboard</Link>
              <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
              <Link to="/admin/products" className="hover:text-primary transition-colors">Products</Link>
              <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
              <span className="text-slate-900 dark:text-white font-medium">Add New</span>
            </nav>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">New Product Listing</h1>
            <p className="text-slate-500 dark:text-slate-400">Create a new luxury footwear listing for the Bata Ganik collection.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={submitting}
              onClick={(e) => handleSubmit(e, false)}
              className="px-4 h-10 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              {submitting ? '...' : 'Save Draft'}
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={(e) => handleSubmit(e, true)}
              className="px-5 h-10 rounded-lg text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-lg">publish</span>
              )}
              Publish Product
            </button>
          </div>
        </div>

        {formError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-700 dark:text-red-400">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Media Uploader */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Product Media</h3>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                  {images.length} / 8 images
                </span>
              </div>
              {/* Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary/50 hover:bg-primary/5 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group mb-4"
              >
                <div className="size-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-2xl">add_photo_alternate</span>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Click to upload</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">PNG, JPG, WebP (max 8 images)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              {uploadError && <p className="text-red-500 text-xs mb-3">{uploadError}</p>}
              {/* Image Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 group">
                      {img.uploading ? (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                          <span className="animate-spin material-symbols-outlined text-primary">progress_activity</span>
                        </div>
                      ) : (
                        <img src={img.url} alt={img.altText} className="w-full h-full object-cover" />
                      )}
                      {!img.uploading && (
                        <>
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-white dark:bg-slate-800 rounded-full p-0.5 shadow-sm hover:bg-red-50 hover:text-red-500 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <span className="material-symbols-outlined text-sm block">close</span>
                          </button>
                          {img.isMain ? (
                            <div className="absolute bottom-1 left-1 bg-primary/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Main</div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setMainImage(idx)}
                              className="absolute bottom-1 left-1 bg-white/80 text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white"
                            >
                              Set main
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cultural Story */}
            <div className="bg-[#faf9f6] dark:bg-[#1a1814] border border-[#e8e6e1] dark:border-[#333] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                <h3 className="font-bold text-[#4a453e] dark:text-[#d4cfc5] text-lg">Cultural Story</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                Describe the Nigerian heritage, craftsmanship, or inspiration behind this design. Appears on the product page.
              </p>
              <textarea
                value={heritageStory}
                onChange={(e) => setHeritageStory(e.target.value)}
                className="w-full rounded-lg bg-white dark:bg-black border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-0 shadow-sm placeholder:text-slate-400 text-slate-700 dark:text-slate-300 text-sm leading-relaxed p-4 resize-none"
                placeholder="E.g., Inspired by the vibrant patterns of the Yoruba talking drum..."
                rows={6}
              />
            </div>

            {/* Organization */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-4">Organization</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Collection</label>
                  <select
                    value={collectionId}
                    onChange={(e) => setCollectionId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm p-2.5 focus:ring-primary focus:border-primary"
                  >
                    <option value="">— None —</option>
                    {collections.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tags <span className="text-xs font-normal text-slate-400">(comma-separated)</span></label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Leather, Handmade, Formal..."
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm p-2.5 focus:ring-primary focus:border-primary"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Feature on homepage</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* General Info */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                General Information
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. The Oba Loafer"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-medium p-3 focus:ring-primary focus:border-primary placeholder:text-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Description</label>
                  <textarea
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the product specifics, materials, and care instructions..."
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 p-4 resize-none focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                Pricing & Inventory
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Base Price (NGN) *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 text-sm">₦</span>
                    </div>
                    <input
                      type="number"
                      required
                      min="0"
                      step="500"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm p-2.5 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Compare at Price <span className="text-xs font-normal text-slate-400">(Optional)</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 text-sm">₦</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={compareAtPrice}
                      onChange={(e) => setCompareAtPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm p-2.5 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">SKU</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="BG-2025-001"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm p-2.5 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Size Variants *</h3>
                <button
                  type="button"
                  onClick={addVariant}
                  className="text-sm text-primary font-bold hover:text-primary/80 transition-colors"
                >
                  + Add Size
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium uppercase text-xs">
                    <tr>
                      <th className="px-3 py-3 text-left">Size (EU)</th>
                      <th className="px-3 py-3 text-left">Color</th>
                      <th className="px-3 py-3 text-left">Hex</th>
                      <th className="px-3 py-3 text-left">+Price</th>
                      <th className="px-3 py-3 text-left">Stock</th>
                      <th className="px-3 py-3 w-10" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {variants.map((v) => (
                      <tr key={v.key} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-3 py-3">
                          <select
                            value={v.sizeEU}
                            onChange={(e) => updateVariant(v.key, 'sizeEU', e.target.value)}
                            className="w-full text-sm border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 p-1.5 focus:ring-primary focus:border-primary"
                          >
                            <option value="">—</option>
                            {DEFAULT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="px-3 py-3">
                          <input
                            type="text"
                            value={v.color}
                            onChange={(e) => updateVariant(v.key, 'color', e.target.value)}
                            placeholder="Tan"
                            className="w-full text-sm border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 p-1.5 focus:ring-primary focus:border-primary max-w-[90px]"
                          />
                        </td>
                        <td className="px-3 py-3">
                          <input
                            type="color"
                            value={v.colorHex || '#888888'}
                            onChange={(e) => updateVariant(v.key, 'colorHex', e.target.value)}
                            className="w-9 h-9 rounded border border-slate-300 dark:border-slate-700 cursor-pointer"
                            title="Pick colour"
                          />
                        </td>
                        <td className="px-3 py-3">
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">₦</span>
                            <input
                              type="number"
                              value={v.priceModifier}
                              onChange={(e) => updateVariant(v.key, 'priceModifier', Number(e.target.value))}
                              min="0"
                              step="500"
                              className="w-20 text-sm border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 pl-5 pr-2 py-1.5 focus:ring-primary focus:border-primary"
                            />
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <input
                            type="number"
                            value={v.stockQty}
                            onChange={(e) => updateVariant(v.key, 'stockQty', Number(e.target.value))}
                            min="0"
                            className="w-16 text-sm border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 px-2 py-1.5 focus:ring-primary focus:border-primary"
                          />
                        </td>
                        <td className="px-3 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => removeVariant(v.key)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {variants.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">No variants yet. Click + Add Size above.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
