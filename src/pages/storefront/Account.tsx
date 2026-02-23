import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api, type Order, formatNGN } from '../../lib/api';

export default function Account() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: { pathname: '/account' } } });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user?.email) {
      setLoading(true);
      // We'll fetch orders for this email. 
      // The API needs to be updated to support this, or we use a specific endpoint.
      api.get<{ orders: Order[] }>(`/orders?email=${user.email}`)
        .then((res) => setOrders(res.orders || []))
        .catch((err) => console.error('Error fetching customer orders:', err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-900">
        <span className="animate-spin material-symbols-outlined text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  const latestOrder = orders[0];

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'orders', label: 'My Orders', icon: 'shopping_bag' },
    { id: 'profile', label: 'Profile Details', icon: 'person' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="bg-stone-50 dark:bg-stone-900 min-h-screen py-32 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm p-6 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
              <img src={`https://ui-avatars.com/api/?name=${user.user_metadata?.first_name || user.email}&background=C29D59&color=fff`} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider">Welcome Back</p>
              <h3 className="font-serif text-lg text-stone-900 dark:text-white truncate max-w-[150px]">
                {user.user_metadata?.first_name || user.email?.split('@')[0]}
              </h3>
            </div>
          </div>

          <nav className="bg-white dark:bg-stone-800 rounded-lg shadow-sm overflow-hidden">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 text-sm font-medium transition-colors border-l-4 ${activeTab === item.id
                    ? 'border-primary bg-stone-50 dark:bg-stone-700 text-stone-900 dark:text-white'
                    : 'border-transparent text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-white'
                  }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-4 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-l-4 border-transparent"
            >
              <span className="material-symbols-outlined">logout</span>
              Sign Out
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="mb-8">
            <h1 className="font-serif text-4xl md:text-5xl text-stone-900 dark:text-white mb-2">
              Hello, {user.user_metadata?.first_name || user.email?.split('@')[0]}.
            </h1>
            <p className="text-stone-500 dark:text-stone-400">Manage your Bata Ganik orders and profile details here.</p>
          </div>

          {activeTab === 'dashboard' && (
            <div className="space-y-12">
              {/* Latest Purchase */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <h2 className="font-serif text-2xl text-stone-900 dark:text-white">Latest Purchase</h2>
                  {orders.length > 0 && (
                    <button onClick={() => setActiveTab('orders')} className="text-primary text-sm hover:underline flex items-center gap-1">
                      View all orders <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  )}
                </div>

                {loading ? (
                  <div className="h-64 bg-white dark:bg-stone-800 rounded-lg animate-pulse" />
                ) : latestOrder ? (
                  <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3 h-64 md:h-auto relative bg-stone-100 dark:bg-stone-900">
                      <span className={`absolute top-4 left-4 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider z-10 ${latestOrder.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-primary/20 text-primary'
                        }`}>
                        {latestOrder.status}
                      </span>
                      <img
                        src={latestOrder.items[0]?.product?.images[0]?.url || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop'}
                        alt="Shoe"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs text-stone-500 uppercase tracking-wider">Order #{latestOrder.orderNumber}</span>
                          <span className="font-serif text-xl text-primary">{formatNGN(latestOrder.total)}</span>
                        </div>
                        <h3 className="font-serif text-2xl text-stone-900 dark:text-white mb-1">
                          {latestOrder.items[0]?.productName}
                          {latestOrder.items.length > 1 && <span className="text-sm font-normal text-stone-400"> + {latestOrder.items.length - 1} more items</span>}
                        </h3>
                        <p className="text-sm text-stone-500 mb-6">Ordered on {new Date(latestOrder.createdAt).toLocaleDateString()}</p>
                      </div>

                      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-stone-100 dark:border-stone-700">
                        <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300 text-sm">
                          <span className="material-symbols-outlined text-primary">local_shipping</span>
                          {latestOrder.status === 'SHIPPED' ? 'In Transit' : latestOrder.status}
                        </div>
                        <Link to={`/order-confirmation?orderId=${latestOrder.id}`} className="w-full md:w-auto text-center py-2 px-6 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded text-sm font-medium hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-stone-800 p-12 rounded-lg text-center border-2 border-dashed border-stone-200 dark:border-stone-700">
                    <span className="material-symbols-outlined text-5xl text-stone-300 mb-4">shopping_cart</span>
                    <p className="text-stone-500 mb-6">No orders found yet. Ready to find something special?</p>
                    <Link to="/shop" className="bg-primary text-white px-8 py-3 rounded-lg font-bold">Start Shopping</Link>
                  </div>
                )}
              </div>

              {/* Settings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-stone-800 p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">person</span>
                      <h3 className="font-serif text-lg text-stone-900 dark:text-white">Profile</h3>
                    </div>
                    <button onClick={() => setActiveTab('profile')} className="text-primary text-sm font-medium hover:underline">Edit</button>
                  </div>
                  <div className="text-sm text-stone-600 dark:text-stone-400">
                    <p className="font-medium text-stone-900 dark:text-white">{user.user_metadata?.first_name} {user.user_metadata?.last_name}</p>
                    <p>{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              {loading ? (
                Array(3).fill(0).map((_, i) => <div key={i} className="h-32 bg-white dark:bg-stone-800 rounded-lg animate-pulse" />)
              ) : orders.length > 0 ? (
                <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-stone-50 dark:bg-stone-700 text-stone-500 dark:text-stone-400 uppercase text-xs tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Order #</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-700">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-stone-50 dark:hover:bg-stone-700/50">
                          <td className="px-6 py-4 font-mono font-medium">{order.orderNumber}</td>
                          <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'
                              }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold">{formatNGN(order.total)}</td>
                          <td className="px-6 py-4 text-right">
                            <Link to={`/order-confirmation?orderId=${order.id}`} className="text-primary font-bold hover:underline">Details</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-20 text-stone-500">No orders here yet.</p>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-stone-800 p-8 rounded-lg shadow-sm max-w-2xl">
              <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-8">Personal Information</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">First Name</label>
                    <input type="text" defaultValue={user.user_metadata?.first_name} className="w-full bg-stone-50 dark:bg-stone-700 border-none rounded p-3" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Last Name</label>
                    <input type="text" defaultValue={user.user_metadata?.last_name} className="w-full bg-stone-50 dark:bg-stone-700 border-none rounded p-3" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Email</label>
                  <input type="email" readOnly value={user.email} className="w-full bg-stone-100 dark:bg-stone-600 border-none rounded p-3 text-stone-500 cursor-not-allowed" />
                </div>
                <button type="button" className="bg-primary text-white font-bold px-8 py-3 rounded hover:bg-[#b09055] transition-colors">Update Profile</button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
