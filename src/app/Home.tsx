"use client"
import { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Navbar from './components/Navbar';
import { useRouter } from 'next/navigation';

const VehicleRequestPage: NextPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  
  const [formData, setFormData] = useState({
    name: '',
    personnelId: '',
    phoneNumber: '',
    notes: '',
    missionDate: '',
    missionTime: '',
    destination: '',
    withChair: false,
    withSeat: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Update the handleSubmit function to better display errors
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });
    
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Bir hata oluştu');
      }
      
      // Success handling
      setSubmitStatus({
        type: 'success',
        message: 'Araç talebi başarıyla oluşturuldu!'
      });
      // Clear form
      setFormData({
        name: '',
        personnelId: '',
        phoneNumber: '',
        notes: '',
        missionDate: '',
        missionTime: '',
        destination: '',
        withChair: false,
        withSeat: false,
      });
      
      // Redirect to requests page after 2 seconds
      setTimeout(() => {
        router.push('/talepler');
      }, 2000);
      
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Talep gönderilirken bir hata oluştu'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Araç Talebi</title>
        <meta name="description" content="Araç talep formu" />
      </Head>
      
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 p-4 pt-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-black">Araç Talebi</h1>
          
          {submitStatus.type && (
            <div 
              className={`mb-4 p-3 rounded ${
                submitStatus.type === 'success' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {submitStatus.message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Name and Personnel ID side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-black">
                    Birim Adı:
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                  />
                </div>
                
                {/* Personnel ID */}
                <div>
                  <label htmlFor="personnelId" className="block text-sm font-semibold text-black">
                    Personel Ad Soyad:
                  </label>
                  <input
                    type="text"
                    name="personnelId"
                    id="personnelId"
                    value={formData.personnelId}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                  />
                </div>
              </div>
              
              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-black">
                  Personel Tel No:
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                />
              </div>
              
              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-black">
                  Not:
                </label>
                <input
                  type="text"
                  name="notes"
                  id="notes"
                  placeholder="Bu Alana Hasta Adı, Hasta Sayısı Gibi Bilgileri Giriniz"
                  value={formData.notes}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black placeholder-gray-500"
                />
              </div>
              
              {/* Mission Date and Time side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mission Date */}
                <div>
                  <label htmlFor="missionDate" className="block text-sm font-semibold text-black">
                    Görev Tarihi:
                  </label>
                  <input
                    type="date"
                    name="missionDate"
                    id="missionDate"
                    value={formData.missionDate}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                  />
                </div>
                
                {/* Mission Time */}
                <div>
                  <label htmlFor="missionTime" className="block text-sm font-semibold text-black">
                    Görev Saati:
                  </label>
                  <input
                    type="time"
                    name="missionTime"
                    id="missionTime"
                    value={formData.missionTime}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                  />
                </div>
              </div>
              
              {/* Destination */}
              <div>
                <label htmlFor="destination" className="block text-sm font-semibold text-black">
                  Gidilecek Mevki:
                </label>
                <input
                  type="text"
                  name="destination"
                  id="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                />
              </div>
              
              {/* Checkboxes */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="withChair"
                    id="withChair"
                    checked={formData.withChair}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="withChair" className="ml-2 block text-sm font-semibold text-black">
                    Tekerlekli Sandalye
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="withSeat"
                    id="withSeat"
                    checked={formData.withSeat}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="withSeat" className="ml-2 block text-sm font-semibold text-black">
                    Sedye
                  </label>
                </div>
              </div>
              
              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-32 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default VehicleRequestPage;