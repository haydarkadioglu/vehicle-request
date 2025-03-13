"use client"

import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
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

// Define API response type to avoid 'any'
type ApiResponse = {
  success: boolean;
  data?: {
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
  }[];
  error?: string;
};

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('pending');
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Remove unused lastRefreshTime state
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
  const fetchRequests = useCallback(async (showLoading = true) => {
    if (!isAuthenticated) return;
    
    try {
      if (showLoading) setLoading(true);
      
      const response = await fetch('/api/requests');
      
      if (!response.ok) {
        throw new Error('Talepler yüklenirken bir hata oluştu');
      }
      
      const data = await response.json() as ApiResponse;
      
      if (data.success && data.data) {
        // Format the date for display
        const formattedRequests = data.data.map((req) => ({
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
      if (showLoading) setLoading(false);
    }
  }, [isAuthenticated]);

  // Initial data fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchRequests();
    }
  }, [isAuthenticated, fetchRequests]);

  // Set up polling
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const intervalId = setInterval(() => {
      fetchRequests(false);
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, [isAuthenticated, fetchRequests]);
  
  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminLoginExpiry');
    router.push('/sofor/giris');
  };
  
  // Manual refresh function
  const handleManualRefresh = () => {
    fetchRequests(true);
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

  // Filter requests based on active tab - now just Pending vs History
  const filteredRequests = requests.filter(request => {
    if (activeTab === 'pending') {
      return request.status === 'PENDING';
    } else {
      // history tab - show both approved and rejected requests
      return request.status === 'APPROVED' || request.status === 'REJECTED';
    }
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
  
  // Remove unused viewDetails function
  
  return (
    <>
      <Head>
        <title>Yetkili Ekranı</title>
        <meta name="description" content="Araç talep yönetim ekranı" />
      </Head>
      
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 p-4 pt-6">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-black">Yetkili Yönetim Paneli</h1>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handleManualRefresh}
                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Yenileniyor...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Yenile
                  </>
                )}
              </button>
              <button 
                onClick={handleLogout}
                className="bg-gray-200 hover:bg-gray-300 text-black py-1 px-4 rounded"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
          
          <div className="mb-6 border-b">
            <div className="flex flex-wrap">
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
                onClick={() => setActiveTab('history')}
                className={`py-2 px-4 font-medium ${
                  activeTab === 'history'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-black hover:text-blue-600'
                }`}
              >
                Geçmiş Talepler
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
              <p className="font-medium">
                {activeTab === 'pending' ? 'Bekleyen talep bulunmamaktadır.' : 'Geçmiş talep bulunmamaktadır.'}
              </p>
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
                    {activeTab === 'history' && (
                      <th className="py-3 px-2 text-left text-black font-semibold">Durum</th>
                    )}
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
                      {activeTab === 'history' && (
                        <td className="py-3 px-2">
                          <span 
                            className={`py-1 px-2 rounded-full text-xs font-medium ${
                              request.status === 'APPROVED' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {request.status === 'APPROVED' 
                              ? 'Onaylandı' 
                              : 'Reddedildi'}
                          </span>
                        </td>
                      )}
                      <td className="py-3 px-2 text-center">
                        {request.withWheelchair ? 'Evet' : 'Hayır'}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {request.withStretcher ? 'Evet' : 'Hayır'}
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        {activeTab === 'pending' && (
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
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                        >
                          Detay
                        </Link>
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