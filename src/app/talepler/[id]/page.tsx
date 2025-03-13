"use client"

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

type RequestDetail = {
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
  updatedAt: string;
};

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;
  
  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchRequestDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/requests/${requestId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Talep bulunamadı');
          }
          throw new Error('Talep yüklenirken bir hata oluştu');
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          // Format the dates for display
          setRequest({
            ...data.data,
            missionDate: new Date(data.data.missionDate).toLocaleDateString('tr-TR'),
            createdAt: new Date(data.data.createdAt).toLocaleDateString('tr-TR', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            updatedAt: new Date(data.data.updatedAt).toLocaleDateString('tr-TR', {
              hour: '2-digit',
              minute: '2-digit'
            })
          });
        } else {
          throw new Error('Veri alınamadı');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');
        console.error('Error fetching request details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchRequestDetail();
    }
  }, [requestId]);

  const handleDelete = async () => {
    if (!confirm('Bu talebi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/requests/${requestId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Talep silinirken bir hata oluştu');
      }

      // Redirect back to requests page
      router.push('/talepler');
      router.refresh(); // Force refresh for the next page
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Silme sırasında bir hata oluştu');
      console.error('Error deleting request:', err);
      setIsDeleting(false);
    }
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
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 p-4 pt-6">
          <div className="max-w-4xl mx-auto text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-black font-medium">Yükleniyor...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 p-4 pt-6">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
              <p className="font-medium">{error}</p>
            </div>
            <div className="mt-6">
              <Link href="/talepler" className="text-blue-600 hover:text-blue-800 font-medium">
                &larr; Taleplere Geri Dön
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!request) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 p-4 pt-6">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            <p className="text-black">Talep bulunamadı.</p>
            <div className="mt-6">
              <Link href="/talepler" className="text-blue-600 hover:text-blue-800 font-medium">
                &larr; Taleplere Geri Dön
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Talep Detayı #{request.id}</title>
      </Head>
      
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 p-4 pt-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-black">Talep Detayı #{request.id}</h1>
            <span 
              className={`py-1 px-3 rounded-full text-sm font-medium border ${getStatusClass(request.status)}`}
            >
              {getStatusText(request.status)}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h2 className="text-lg font-semibold text-black mb-2">Talep Bilgileri</h2>
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Birim Adı</p>
                    <p className="text-black">{request.unitName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Personel Ad Soyad</p>
                    <p className="text-black">{request.personnelName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Personel Telefon No</p>
                    <p className="text-black">{request.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Hasta Not</p>
                    <p className="text-black">{request.notes || '-'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-black mb-2">Görev Bilgileri</h2>
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Görev Tarihi</p>
                    <p className="text-black">{request.missionDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Görev Saati</p>
                    <p className="text-black">{request.missionTime}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Adres</p>
                    <p className="text-black">{request.destination}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h2 className="text-lg font-semibold text-black mb-2">İlave İhtiyaçlar</h2>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tekerlekli Sandalye</p>
                    <p className="text-black">{request.withWheelchair ? 'Evet' : 'Hayır'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sedye</p>
                    <p className="text-black">{request.withStretcher ? 'Evet' : 'Hayır'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-black mb-2">Sistem Bilgileri</h2>
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Talep Oluşturulma</p>
                    <p className="text-black">{request.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Son Güncelleme</p>
                    <p className="text-black">{request.updatedAt}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between border-t pt-6">
            <Link href="/talepler" className="text-blue-600 hover:text-blue-800 font-medium">
              &larr; Taleplere Geri Dön
            </Link>
            
            {request.status === 'PENDING' && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${
                  isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isDeleting ? 'Siliniyor...' : 'Talebi İptal Et'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}