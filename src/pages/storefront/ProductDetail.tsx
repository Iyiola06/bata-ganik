import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, type Product, type ProductVariant, formatNGN } from '../../lib/api';
import { useCart } from '../../context/CartContext';

function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
      <div className="lg:col-span-7 aspect-[4/5] bg-stone-200 dark:bg-stone-800 rounded" />
      <div className="lg:col-span-5 pt-4 space-y-4">
        <div className="h-8 bg-stone-200 dark:bg-stone-800 rounded w-3/4" />
        <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/2" />
        <div className="h-6 bg-stone-200 dark:bg-stone-800 rounded w-1/4 mt-4" />
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id: slug } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [mainImage, setMainImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const [activeAccordion, setActiveAccordion] = useState<string | null>('craft');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError('');
    api.get<{ product: Product; related: Product[] }>(`/products/${slug}`)
      .then((res) => {
        setProduct(res.product);
        setRelated(res.related);
        if (res.product.images[0]) setMainImage(res.product.images[0].url);
      })
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  // Derive available sizes and colours from variants
  const availableSizes = product
    ? [...new Set(product.variants.map((v) => v.sizeEU))].sort()
    : [];

  const availableColors = selectedSize
    ? [...new Set(
      product!.variants
        .filter((v) => v.sizeEU === selectedSize && v.stockQty > 0)
        .map((v) => v.color ?? '')
        .filter(Boolean)
    )]
    : [];

  // Update selected variant whenever size or color changes
  useEffect(() => {
    if (!product || !selectedSize) {
      setSelectedVariant(null);
      return;
    }
    const match = product.variants.find(
      (v) => v.sizeEU === selectedSize && (availableColors.length === 0 || v.color === selectedColor)
    );
    setSelectedVariant(match ?? null);
  }, [selectedSize, selectedColor, product]);

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;
    setAddingToCart(true);
    try {
      await addToCart(product.id, selectedVariant.id, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2500);
    } catch (err: any) {
      alert(err?.message ?? 'Could not add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const toggleAccordion = (id: string) =>
    setActiveAccordion(activeAccordion === id ? null : id);

  if (loading) {
    return (
      <div className="bg-white dark:bg-stone-950 min-h-screen pt-28 pb-20">
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-white dark:bg-stone-950 min-h-screen pt-28 pb-20 text-center">
        <p className="text-slate-500 dark:text-slate-400 text-lg mt-24">{error || 'Product not found.'}</p>
        <Link to="/shop" className="mt-4 inline-block text-primary underline">Browse all products</Link>
      </div>
    );
  }

  const inStock = selectedVariant ? selectedVariant.stockQty > 0 : true;
  const effectivePrice = product.price + (selectedVariant?.priceModifier ?? 0);

  return (
    <div className="bg-white dark:bg-stone-950 min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-6 py-6 text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-primary">Shop</Link>
        {product.collection && (
          <>
            <span className="mx-2">/</span>
            <Link to={`/shop?collection=${product.collection.slug}`} className="hover:text-primary">
              {product.collection.name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-stone-900 dark:text-white font-bold">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible">
            {product.images.map((img) => (
              <button
                key={img.id}
                onClick={() => setMainImage(img.url)}
                className={`w-20 h-20 md:w-24 md:h-24 flex-shrink-0 border-2 rounded-sm overflow-hidden ${mainImage === img.url ? 'border-primary' : 'border-transparent'
                  }`}
              >
                <img src={img.url} alt={img.altText ?? product.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          {/* Main Image */}
          <div className="flex-1 bg-stone-100 dark:bg-stone-900 rounded-lg overflow-hidden relative">
            {product.isFeatured && (
              <span className="absolute top-4 right-4 bg-white dark:bg-black text-xs font-bold px-3 py-1 uppercase tracking-widest z-10">
                New Arrival
              </span>
            )}
            {mainImage && (
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-5 pt-4">
          <p className="text-xs text-stone-400 uppercase tracking-widest mb-2">
            {product.collection?.name ?? 'Bata Ganik'}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-white mb-2">{product.name}</h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mb-6">{product.description}</p>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-2xl font-bold text-primary">{formatNGN(effectivePrice)}</span>
            {product.compareAtPrice && (
              <span className="text-base text-slate-400 line-through">{formatNGN(product.compareAtPrice)}</span>
            )}
            {selectedVariant && (
              <span
                className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${inStock
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-700'
                  }`}
              >
                {inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            )}
          </div>

          {/* Color Selection */}
          {availableColors.length > 0 && (
            <div className="mb-6">
              <span className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-widest block mb-3">
                Select Color — <span className="font-normal text-stone-500">{selectedColor}</span>
              </span>
              <div className="flex gap-3 flex-wrap">
                {availableColors.map((color) => {
                  const variant = product.variants.find(
                    (v) => v.sizeEU === selectedSize && v.color === color
                  );
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      className={`w-8 h-8 rounded-full ring-2 ring-offset-2 transition-all ${selectedColor === color ? 'ring-primary' : 'ring-transparent hover:ring-stone-400'
                        }`}
                      style={{ backgroundColor: variant?.colorHex ?? '#888' }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selection */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-widest">
                Select Size (EU)
              </span>
              <Link to="/size-guide" className="text-xs text-primary underline">Size Guide</Link>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {availableSizes.map((size) => {
                const sizeVariants = product.variants.filter((v) => v.sizeEU === size);
                const hasStock = sizeVariants.some((v) => v.stockQty > 0);
                return (
                  <button
                    key={size}
                    disabled={!hasStock}
                    onClick={() => { setSelectedSize(size); setSelectedColor(''); }}
                    className={`h-10 border rounded text-sm font-medium transition-all ${selectedSize === size
                        ? 'border-primary bg-primary/10 text-primary'
                        : hasStock
                          ? 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-primary hover:text-primary'
                          : 'border-stone-100 dark:border-stone-800 text-stone-300 dark:text-stone-700 cursor-not-allowed line-through'
                      }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex gap-4 mb-6">
            <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-3 text-stone-600 dark:text-stone-400 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-sm">remove</span>
              </button>
              <span className="px-4 text-sm font-medium text-stone-900 dark:text-white min-w-[32px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-3 text-stone-600 dark:text-stone-400 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || !inStock || addingToCart}
              className={`flex-1 py-3 px-6 font-bold uppercase tracking-wider text-sm rounded transition-all flex items-center justify-center gap-2 ${addedToCart
                  ? 'bg-green-600 text-white'
                  : !selectedVariant || !inStock
                    ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
            >
              {addingToCart ? (
                <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>
              ) : addedToCart ? (
                <>
                  <span className="material-symbols-outlined text-sm">check</span> Added to Bag
                </>
              ) : !selectedVariant ? (
                'Select a size'
              ) : !inStock ? (
                'Out of Stock'
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">shopping_bag</span> Add to Bag
                </>
              )}
            </button>
          </div>

          {/* Accordions */}
          <div className="border-t border-stone-200 dark:border-stone-800 mt-8">
            {[
              {
                id: 'craft',
                title: 'Heritage & Craft',
                content: product.heritageStory ?? 'Each pair is meticulously handcrafted by master artisans using time-honoured techniques passed down through generations.',
              },
              {
                id: 'materials',
                title: 'Materials',
                content: 'Premium full-grain leather sourced from certified Nigerian tanneries. Leather sole for breathability; rubber heel cap for durability.',
              },
              {
                id: 'shipping',
                title: 'Shipping & Returns',
                content: 'Free shipping on orders over ₦50,000. Delivered in 3–5 business days within Nigeria; 7–14 days internationally. Returns accepted within 30 days.',
              },
            ].map(({ id, title, content }) => (
              <div key={id} className="border-b border-stone-200 dark:border-stone-800">
                <button
                  onClick={() => toggleAccordion(id)}
                  className="w-full flex justify-between items-center py-4 text-left text-sm font-bold uppercase tracking-widest text-stone-900 dark:text-white hover:text-primary transition-colors"
                >
                  {title}
                  <span className="material-symbols-outlined text-sm">
                    {activeAccordion === id ? 'remove' : 'add'}
                  </span>
                </button>
                {activeAccordion === id && (
                  <p className="pb-4 text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-24">
          <h2 className="font-serif text-3xl text-stone-900 dark:text-white mb-8">Complete the Look</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <Link key={p.id} to={`/products/${p.slug}`} className="group">
                <div className="aspect-[3/4] bg-stone-100 dark:bg-stone-900 overflow-hidden rounded mb-3">
                  {p.images[0] && (
                    <img
                      src={p.images[0].url}
                      alt={p.images[0].altText ?? p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                <h3 className="font-serif text-base text-stone-900 dark:text-white group-hover:text-primary transition-colors">
                  {p.name}
                </h3>
                <p className="text-sm font-bold text-stone-700 dark:text-stone-300 mt-1">{formatNGN(p.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
