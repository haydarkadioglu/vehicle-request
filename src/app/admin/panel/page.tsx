"use client"

import Head from 'next/head';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Request = {
  id: number;
  unitName: string;
  personnelName: string;
  phoneNumber: string;
  notes: string | null;
  missionDate: string;
  missionTime: string;
  destination: string;
  status: string;
  withWheelchair: boolean;
  withStretcher: boolean;
  createdAt: string;
};

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('all'); // Default to showing all requests
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  const router = useRouter();
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      // Check if logged in
      const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
      
      // Check if login is expired
      let isExpired = false;
      const expiryStr = localStorage.getItem('adminLoginExpiry');
      if (expiryStr) {
        const expiry = new Date(expiryStr);
        isExpired = new Date() > expiry;
      }
      
      if (!isLoggedIn || isExpired) {
        // Clear any expired login data
        if (isExpired) {
          localStorage.removeItem('adminLoggedIn');
          localStorage.removeItem('adminLoginExpiry');
        }
        
        // Redirect to login page
        router.replace('/sofor/giris');
      } else {
        setIsAuthenticated(true);
      }
    };
    
    checkAuth();
  }, [router]);

  // Fetch requests only if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/requests');
        
        if (!response.ok) {
          throw new Error('Talepler yüklenirken bir hata oluştu');
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          // Format the date for display
          const formattedRequests = data.data.map((req: any) => ({
            ...req,
            missionDate: new Date(req.missionDate).toLocaleDateString('tr-TR'),
            createdAt: new Date(req.createdAt).toLocaleDateString('tr-TR')
          }));
          
          setRequests(formattedRequests);
        } else {
          throw new Error('Veri alınamadı');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');
        console.error('Error fetching requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [isAuthenticated]);
  
  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminLoginExpiry');
    router.push('/sofor/giris');
  };

  // Delete request function
  const handleDelete = async (id: number) => {
    // Ask for confirmation
    if (!confirm('Bu talebi silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      setIsDeletingId(id);
      const response = await fetch(`/api/requests/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Talep silinirken bir hata oluştu');
      }

      // Remove the deleted request from state
      setRequests(prevRequests => 
        prevRequests.filter(req => req.id !== id)
      );
      
      alert('Talep başarıyla silindi');
    } catch (err) {
      console.error('Error deleting request:', err);
      alert('Talep silinirken bir hata oluştu');
    } finally {
      setIsDeletingId(null);
    }
  };

  // Filter requests based on active tab
  const filteredRequests = requests.filter(request => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return request.status === 'PENDING';
    if (activeTab === 'approved') return request.status === 'APPROVED';
    if (activeTab === 'rejected') return request.status === 'REJECTED';
    return true;
  });

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Status değiştirilemedi');
      }

      // Update local state
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === id ? { ...req, status: newStatus } : req
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
      alert('İşlem sırasında bir hata oluştu.');
    }
  };

  // If not authenticated, show loading state or nothing
  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Head>
        <title>Admin Paneli</title>
        <meta name="description" content="Araç talep yönetim paneli" />
      </Head>
      
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 p-4 pt-6">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-black">Admin Paneli</h1>
            <button 
              onClick={handleLogout}
              className="bg-gray-200 hover:bg-gray-300 text-black py-1 px-4 rounded"
            >
              Çıkış Yap
            </button>
          </div>
          
          <div className="mb-6 border-b">
            <div className="flex flex-wrap">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-2 px-4 font-medium ${
                  activeTab === 'all'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-black hover:text-blue-600'
                }`}
              >
                Tüm Talepler
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-2 px-4 font-medium ${
                  activeTab === 'pending'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-black hover:text-blue-600'
                }`}
              >
                Bekleyen Talepler
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`py-2 px-4 font-medium ${
                  activeTab === 'approved'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-black hover:text-blue-600'
                }`}
              >
                Onaylanan Talepler
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`py-2 px-4 font-medium ${
                  activeTab === 'rejected'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-black hover:text-blue-600'
                }`}
              >
                Reddedilen Talepler
              </button>
            </div>
          </div>
          
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-black font-medium">Yükleniyor...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
              <p className="font-medium">{error}</p>
            </div>
          )}
          
          {!loading && !error && filteredRequests.length === 0 && (
            <div className="text-center py-8 text-black">
              <p className="font-medium">Bu kategoride talep bulunmamaktadır.</p>
            </div>
          )}
          
          {!loading && !error && filteredRequests.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-2 text-left text-black font-semibold">ID</th>
                    <th className="py-3 px-2 text-left text-black font-semibold">Birim Adı</th>
                    <th className="py-3 px-2 text-left text-black font-semibold">Personel Ad Soyad</th>
                    <th className="py-3 px-2 text-left text-black font-semibold">Telefon No</th>
                    <th className="py-3 px-2 text-left text-black font-semibold">Hasta Not</th>
                    <th className="py-3 px-2 text-left text-black font-semibold">Görev Tarihi</th>
                    <th className="py-3 px-2 text-left text-black font-semibold">Görev Saati</th>
                    <th className="py-3 px-2 text-left text-black font-semibold">Adres</th>
                    <th className="py-3 px-2 text-left text-black font-semibold">Durum</th>
                    <th className="py-3 px-2 text-center text-black font-semibold">Tekerlekli Sandalye</th>
                    <th className="py-3 px-2 text-center text-black font-semibold">Sedye</th>
                    <th className="py-3 px-2 text-left text-black font-semibold">İşlem</th>
                  </tr>
                </thead>
                <tbody className="text-black">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-2">{request.id}</td>
                      <td className="py-3 px-2">{request.unitName}</td>
                      <td className="py-3 px-2">{request.personnelName}</td>
                      <td className="py-3 px-2">{request.phoneNumber}</td>
                      <td className="py-3 px-2">
                        {request.notes ? 
                          (request.notes.length > 15 ? 
                            `${request.notes.substring(0, 15)}...` : 
                            request.notes) : 
                          '-'}
                      </td>
                      <td className="py-3 px-2">{request.missionDate}</td>
                      <td className="py-3 px-2">{request.missionTime}</td>
                      <td className="py-3 px-2">
                        {request.destination.length > 15 ? 
                          `${request.destination.substring(0, 15)}...` : 
                          request.destination}
                      </td>
                      <td className="py-3 px-2">
                        <span 
                          className={`py-1 px-2 rounded-full text-xs font-medium ${
                            request.status === 'APPROVED' 
                              ? 'bg-green-100 text-green-800' 
                              : request.status === 'REJECTED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {request.status === 'APPROVED' 
                            ? 'Onaylandı' 
                            : request.status === 'REJECTED' 
                              ? 'Reddedildi' 
                              : 'Beklemede'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        {request.withWheelchair ? 'Evet' : 'Hayır'}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {request.withStretcher ? 'Evet' : 'Hayır'}
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        {request.status === 'PENDING' && (
                          <>
                            <button 
                              onClick={() => handleStatusChange(request.id, 'APPROVED')}
                              className="bg-green-500 text-white py-1 px-2 rounded mr-1 hover:bg-green-600 text-xs"
                            >
                              Onayla
                            </button>
                            <button 
                              onClick={() => handleStatusChange(request.id, 'REJECTED')}
                              className="bg-red-500 text-white py-1 px-2 rounded mr-1 hover:bg-red-600 text-xs"
                            >
                              Reddet
                            </button>
                          </>
                        )}
                        <Link 
                          href={`/talepler/${request.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs mr-1"
                        >
                          Detay
                        </Link>
                        <button 
                          onClick={() => handleDelete(request.id)}
                          disabled={isDeletingId === request.id}
                          className={`text-red-600 hover:text-red-800 font-medium text-xs ${
                            isDeletingId === request.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {isDeletingId === request.id ? 'Siliniyor...' : 'Sil'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}