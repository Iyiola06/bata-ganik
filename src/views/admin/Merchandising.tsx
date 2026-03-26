import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { api, type Collection, type Category } from '../../lib/api';

export default function Merchandising() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeGroup, setActiveGroup] = useState<{ id: string; type: 'collection' | 'category' } | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Fetch dropdowns
    api.get<{ collections: Collection[] }>('/collections').then((res) => setCollections(res.collections)).catch(console.error);
    api.get<{ categories: Category[] }>('/admin/categories').then((res) => setCategories(res.categories)).catch(console.error);
  }, []);

  const loadProducts = async (type: 'collection' | 'category', id: string, slug?: string) => {
    setActiveGroup({ id, type });
    setLoading(true);
    setHasChanges(false);
    try {
      const res = await api.get<{ products: any[] }>(`/admin/products?limit=100&${type}=${slug || id}`);
      setProducts(res.products);
    } catch (err) {
      console.error(err);
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.index === destination.index) return;

    const newItems = Array.from(products);
    const [reorderedItem] = newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, reorderedItem);

    setProducts(newItems);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!activeGroup) return;
    setSaving(true);
    try {
      const items = products.map((p, index) => ({ id: p.id, sortOrder: index }));
      await api.put('/admin/merchandising', { type: activeGroup.type, groupId: activeGroup.id, items });
      setHasChanges(false);
      alert('Sort order successfully saved!');
    } catch (err) {
      console.error(err);
      alert('Failed to save sort order.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-10">
      <div className="max-w-[1000px] mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Merchandising</h1>
            <p className="text-slate-500 dark:text-slate-400">Control visual sort ordering via Drag-and-Drop</p>
          </div>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {saving ? <span className="animate-spin material-symbols-outlined text-[20px]">progress_activity</span> : <span className="material-symbols-outlined text-[20px]">save</span>}
            Save Sort Order
          </button>
        </div>

        {/* Group Selector */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Select Collection</label>
            <select
              onChange={(e) => {
                const c = collections.find(x => x.id === e.target.value);
                if (c) loadProducts('collection', c.id, c.slug);
              }}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-3 focus:ring-primary focus:border-primary text-slate-900 dark:text-white"
              value={activeGroup?.type === 'collection' ? activeGroup.id : ''}
            >
              <option value="">— Choose a Collection —</option>
              {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Select Category</label>
            <select
              onChange={(e) => {
                const c = categories.find(x => x.id === e.target.value);
                if (c) loadProducts('category', c.id, c.slug);
              }}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-3 focus:ring-primary focus:border-primary text-slate-900 dark:text-white"
              value={activeGroup?.type === 'category' ? activeGroup.id : ''}
            >
              <option value="">— Choose a Category —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Drag and Drop List */}
        {activeGroup && (
           <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 pb-2 overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
               <h2 className="font-bold text-slate-900 dark:text-white">Ordered Products</h2>
               <span className="text-xs font-bold text-slate-500 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
                 {products.length} Items
               </span>
             </div>
             
             {loading ? (
               <div className="p-10 text-center text-slate-400">Loading products...</div>
             ) : products.length === 0 ? (
               <div className="p-10 text-center text-slate-400">No products assigned to this group.</div>
             ) : (
               <DragDropContext onDragEnd={handleDragEnd}>
                 <Droppable droppableId="merchandisingList">
                   {(provided) => (
                     <div 
                       {...provided.droppableProps} 
                       ref={provided.innerRef}
                       className="p-4 flex flex-col gap-2"
                     >
                       {products.map((product, index) => (
                         <Draggable key={product.id} draggableId={product.id} index={index}>
                           {(provided, snapshot) => (
                             <div
                               ref={provided.innerRef}
                               {...provided.draggableProps}
                               className={`flex items-center gap-4 p-3 rounded-lg border \${snapshot.isDragging ? 'bg-primary/5 border-primary shadow-md' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
                             >
                               <div {...provided.dragHandleProps} className="text-slate-400 hover:text-primary transition-colors cursor-grab active:cursor-grabbing px-2 py-3">
                                 <span className="material-symbols-outlined block">drag_indicator</span>
                               </div>
                               <div className="w-12 h-12 rounded bg-slate-100 dark:bg-slate-900 flex items-center justify-center overflow-hidden flex-shrink-0">
                                 {product.images?.[0]?.url ? (
                                   <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                                 ) : (
                                   <span className="material-symbols-outlined text-slate-300">image</span>
                                 )}
                               </div>
                               <div className="flex-1">
                                 <p className="font-bold text-slate-900 dark:text-white text-sm">{product.name}</p>
                                 <p className="font-mono text-xs text-slate-500">{product.sku}</p>
                               </div>
                               <div className="px-4 text-right">
                                 <p className="font-medium text-slate-900 dark:text-white text-sm">₦{product.price.toLocaleString()}</p>
                                 <p className="text-xs text-slate-500">#{index + 1}</p>
                               </div>
                             </div>
                           )}
                         </Draggable>
                       ))}
                       {provided.placeholder}
                     </div>
                   )}
                 </Droppable>
               </DragDropContext>
             )}
           </div>
        )}

      </div>
    </div>
  );
}
