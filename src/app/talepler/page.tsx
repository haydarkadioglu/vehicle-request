"use client"

import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';

type Request = {
  id: number;
  unitName: string;
  personnelName: string;
  phoneNumber: string;
  notes: string;
  missionDate: string;
  missionTime: string;
  destination: string;
  status: string;
  withWheelchair: boolean;
  withStretcher: boolean;
  createdAt: string;
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create a memoized fetch function to avoid recreating it on each render
  const fetchRequests = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      
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
      if (showLoading) setLoading(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Set up polling for data refresh (every 10 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchRequests(false); // false means don't show loading spinner for auto-refresh
    }, 10000); // 10 seconds
    
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [fetchRequests]);

  // Manual refresh function
  const handleManualRefresh = () => {
    fetchRequests(true); // true means show loading spinner for manual refresh
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'Onaylandı';
      case 'REJECTED': return 'Reddedildi';
      default: return 'Beklemede';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <>
      <Head>
        <title>Taleplerim</title>
        <meta name="description" content="Araç taleplerim" />
      </Head>
      
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 p-4 pt-6">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-black">Taleplerim</h1>
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
          </div>
          
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-black font-medium">Yükleniyor...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {!loading && !error && requests.length === 0 && (
            <div className="text-center py-4 text-black">Kayıtlı talebiniz bulunmamaktadır.</div>
          )}
          
          {!loading && !error && requests.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-2 text-left text-black font-semibold">Birim Adı</th>
                    <th className="py-3 px-2 text-left text-black font-semibold">Personel Ad Soyad</th>
                    <th className="py-3 px-2 text-left text-black font-semibold">Personel Telefon No</th>
                    <th className="py-3 px-2 text-left text-black font-semibold">Hasta Not</th>
                    <th className="py-3 px-2 text-left text-black font-semibold">Görev Tarihi</th>
                    <th className="py-3 px-2 text-left text-black font-semibold">Görev Saati</th>
                    <th className="py-3 px-2 text-left text-black font-semibold">Adres</th>
                    <th className="py-3 px-2 text-left text-black font-semibold">Onay Durumu</th>
                    <th className="py-3 px-2 text-left text-black font-semibold">Tekerlekli Sandalye</th>
                    <th className="py-3 px-2 text-left text-black font-semibold">Sedye</th>
                    <th className="py-3 px-2 text-left text-black font-semibold">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-2 text-black">{request.unitName}</td>
                      <td className="py-3 px-2 text-black">{request.personnelName}</td>
                      <td className="py-3 px-2 text-black">{request.phoneNumber}</td>
                      <td className="py-3 px-2 text-black">
                        {request.notes ? 
                          (request.notes.length > 15 ? 
                            `${request.notes.substring(0, 15)}...` : 
                            request.notes) : 
                          '-'}
                      </td>
                      <td className="py-3 px-2 text-black">{request.missionDate}</td>
                      <td className="py-3 px-2 text-black">{request.missionTime}</td>
                      <td className="py-3 px-2 text-black">
                        {request.destination.length > 15 ? 
                          `${request.destination.substring(0, 15)}...` : 
                          request.destination}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`py-1 px-2 rounded-full text-xs font-medium ${getStatusClass(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-black text-center">
                        {request.withWheelchair ? 'Evet' : 'Hayır'}
                      </td>
                      <td className="py-3 px-2 text-black text-center">
                        {request.withStretcher ? 'Evet' : 'Hayır'}
                      </td>
                      <td className="py-3 px-2">
                        <Link 
                          href={`/talepler/${request.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Görüntüle
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