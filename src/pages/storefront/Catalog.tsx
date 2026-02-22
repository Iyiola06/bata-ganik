import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Catalog() {
  const { category } = useParams();
  
  const getTitle = () => {
    switch(category) {
      case 'new-arrivals': return 'New Arrivals';
      case 'best-sellers': return 'Best Sellers';
      case 'accessories': return 'Accessories';
      case 'oba-collection': return 'The Oba Collection';
      case 'saharan-edit': return 'Saharan Edit';
      default: return 'Shop';
    }
  };

  const getDescription = () => {
    switch(category) {
      case 'new-arrivals': return 'Fresh from our Lagos workshop. Be the first to wear our latest designs.';
      case 'best-sellers': return 'Our most coveted pieces, loved by connoisseurs worldwide.';
      case 'accessories': return 'Complete your look with our handcrafted leather belts, bags, and care kits.';
      case 'oba-collection': return 'Fit for royalty. Designed with intricate detailing inspired by Benin bronze art.';
      case 'saharan-edit': return 'Rugged elegance inspired by the vast landscapes of the North.';
      default: return 'Explore our full range of handcrafted luxury footwear.';
    }
  };

  // Mock products - in a real app, this would be filtered based on the category
  const products = [
    { id: 1, name: 'The Danfo Oxford', price: '₦ 245,000', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbI0GADz62_Ubwvh23hXTsDhQPNVQvxBVfabR0enD1I_rhe0W29LgpRXdUIleBjSGLAKK9Vdm_xEZbt26zTXy_cphehzKcYSwIRrl4QDNXXAPArtMN5_z1EsiitehCrD58PBbecglGQw4ZVP-SLcjw6H5kBiPypu4SEJ-uzS1AhkmZSTS1haSsc6jMRb5KbvmxAcmRCzclKFR3eTPEP4sttrN-i4hNGBAgirFt1xzsWgfxzJ8FtYhIfZKC-NtoX7dZRIh3wWco_YZw', color: 'Cognac Leather' },
    { id: 2, name: 'The Eyo Derby', price: '₦ 280,000', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6laHQk2sp0cC3fJVrbJPbjSU0GxypHmst-3VGLpLlLVbXnDILWxOuJcp_k1gyFN8Wddlxg1lJ48xVFwhToZKbzp5b-E3hcxCx5eBHJzTYagCqxVVuqKt-AHS7NqImu02lWMFUyn4snLoPsTz1cbip6tjSejVupxrvjAgKledejifK2JvvV2lDnEpKwTCsWQF0-9-K2lewRwmtufwGWNtCvPzdGLUB7ZDWLcFts57wz99PQ7X5glP2wIfPqsqQc9OVkBV09U65FU-e', color: 'Midnight Black' },
    { id: 3, name: 'The Lekki Loafer', price: '₦ 210,000', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEIMuP1P06qsNfV0aoHOfgyU-VjzKIXVSSFEfWnwyGmgwgQi99GyQLP7zfo2I2TOHY8DNI2qwzMhxWnyThFiX2_pifkvo40utu5PrRzWq3AFeu2mnlUIP-JOx46aGAqL9ukubQZBDtsgw10mCCmzeak_REhCiqhQ6lAFcLc6k_epxYB0q-mGo7L5IGIvlSuFuKqAxbOaQ5PGhmPQyEBwTT5T2WumBrOq8_vXddbgOqeXOFrGL5f2rvmcF0VoLuUkvJrBSsnqzR7doL', color: 'Royal Blue Suede' },
    { id: 4, name: 'The Zaria Boot', price: '₦ 315,000', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArfYU1GgdDyPuvM1vwBQ73lXf7KvuxA-a9RVqme8UGYPHMNusQA45030xEWz04zizYh7NwbtgNUv0JuZKtKRDiY2T-MikLI1TjJiI7396FxHly144w9ipa6rNBd2MQVzRgf22Wf8qFMHH_9AZMifYQLLsWAQeLlzCiQz8UaVTZKOvQKzxCuk7bi6PY_PuRKe4ipl8OQLkCjvqhrh_ZGXQwUqL3BuBas9QnTOKr_lPV6aoAHJFbxr0bjofjjT0Jw1WbedhTDHB0nubI', color: 'Chocolate Brown' },
    { id: 5, name: 'The Oba Oxford', price: '₦ 120,000', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDm67IA7RXIA_V5-P7yQtms_Ujf1RHkfqLCnJPbDpssajbPh1Nz_CgkDOo2uSoTORdHg89ewHnUnzciVxRv18fiiXclQVM9f8aZysQh9C-BBXELW8j-Kx9OEfHMvc2K423RG9L7xKtWXM98lG3uosVEM-Qy2BNz84uU-bhSBk6xVNIwFP2m2n46SP_at-b1PBkRZPjU5l8yvg8Ogd6FIfUPhXzNvQiTAR4H-eTn1cCXwHNVh9Jfg1GaPBxB7D-fGh50EV_5SiXOO5HH', color: 'Savannah Brown' },
    { id: 6, name: 'The Heritage Belt', price: '₦ 25,000', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArfYU1GgdDyPuvM1vwBQ73lXf7KvuxA-a9RVqme8UGYPHMNusQA45030xEWz04zizYh7NwbtgNUv0JuZKtKRDiY2T-MikLI1TjJiI7396FxHly144w9ipa6rNBd2MQVzRgf22Wf8qFMHH_9AZMifYQLLsWAQeLlzCiQz8UaVTZKOvQKzxCuk7bi6PY_PuRKe4ipl8OQLkCjvqhrh_ZGXQwUqL3BuBas9QnTOKr_lPV6aoAHJFbxr0bjofjjT0Jw1WbedhTDHB0nubI', color: 'Full Grain Leather' },
  ];

  return (
    <div className="bg-white dark:bg-stone-950 min-h-screen pb-20">
      <div className="bg-stone-100 dark:bg-stone-900 py-20 px-6 text-center">
        <h1 className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-white mb-4">{getTitle()}</h1>
        <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto font-light">{getDescription()}</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link to={`/products/${product.id}`} key={product.id} className="group">
              <div className="aspect-[3/4] bg-stone-100 dark:bg-stone-800 rounded-lg overflow-hidden mb-4 relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <button className="absolute bottom-4 right-4 bg-white dark:bg-black text-slate-900 dark:text-white p-3 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white">
                  <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                </button>
              </div>
              <div>
                <h3 className="font-serif text-lg text-stone-900 dark:text-white group-hover:text-primary transition-colors">{product.name}</h3>
                <p className="text-sm text-stone-500 mb-2">{product.color}</p>
                <span className="text-primary font-bold">{product.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
