import React, { useEffect, useState, useRef } from 'react';
import { api, type Collection } from '../../lib/api';

export default function Collections() {
  const [collections, setCollections] = useState<(Collection & { _count: { products: number } })[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<any>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ collections: any[] }>('/admin/collections');
      setCollections(res.collections);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCollections(); }, []);

  const openForm = (collection?: any) => {
    if (collection) {
      setEditingCollection(collection);
      setName(collection.name);
      setDescription(collection.description || '');
      setIsActive(collection.isActive);
      setImageUrl(collection.imageUrl || '');
    } else {
      setEditingCollection(null);
      setName('');
      setDescription('');
      setIsActive(true);
      setImageUrl('');
    }
    setIsModalOpen(true);
  };

  const closeForm = () => {
    setIsModalOpen(false);
    setEditingCollection(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      // Optional: adjust bucket name based on your supabase storage config
      form.append('bucket', 'product-images'); 
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Upload failed');
      setImageUrl(data.url);
    } catch (err: any) {
      alert(err?.message ?? 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCollection) {
        await api.patch(`/admin/collections/${editingCollection.id}`, { name, description, isActive, imageUrl });
      } else {
        await api.post('/admin/collections', { name, description, isActive, imageUrl });
      }
      closeForm();
      fetchCollections();
    } catch (err: any) {
      alert(err.message || 'Failed to save collection');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete collection "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/collections/${id}`);
      setCollections(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-10">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Collections</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage product collections grouping</p>
          </div>
          <button
            onClick={() => openForm()}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg text-sm flex items-center gap-2 w-fit transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Collection
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                {['Collection', 'Products', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">Loading...</td></tr>
              ) : collections.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">No collections found.</td></tr>
              ) : collections.map((col) => (
                <tr key={col.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {col.imageUrl ? (
                          <img src={col.imageUrl} alt={col.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-slate-300">image</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{col.name}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{col.description || 'No description'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{col._count?.products || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${col.isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                      {col.isActive ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => openForm(col)} className="text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button onClick={() => handleDelete(col.id, col.name)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{editingCollection ? 'Edit Collection' : 'Add Collection'}</h2>
              <button onClick={closeForm} className="text-slate-400 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 dark:text-white mb-1.5">Name *</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-2.5 outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-2.5 outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Hero Image</label>
                <div className="flex items-center gap-4">
                   {imageUrl && (
                     <img src={imageUrl} alt="preview" className="w-16 h-16 rounded object-cover border border-slate-200 dark:border-slate-700" />
                   )}
                   <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                     {uploading ? 'Uploading...' : 'Choose Image'}
                   </button>
                   <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="rounded text-primary focus:ring-primary" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Active (Visible on storefront)</span>
              </label>
              
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={closeForm} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="px-5 py-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50">
                  {submitting ? 'Saving...' : 'Save Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
