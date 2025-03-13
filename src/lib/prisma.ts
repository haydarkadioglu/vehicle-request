import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

let prisma: PrismaClient | DeepMockProxy<PrismaClient>;

if (process.env.NODE_ENV === 'production') {
  // Prodüksiyon ortamında basit bir in-memory çözüm
  // Not: Bu sadece geçici bir çözümdür ve veriler kalıcı olmayacaktır
  const mockRequests: any[] = [];
  let requestId = 1;
  
  prisma = mockDeep<PrismaClient>();
  
  // Talep oluşturma işlemini simüle et
  (prisma.vehicleRequest.create as any).mockImplementation(({ data }: any) => {
    const newRequest = { 
      id: requestId++,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockRequests.push(newRequest);
    return Promise.resolve(newRequest);
  });
  
  // Talepleri listeleme işlemini simüle et
  (prisma.vehicleRequest.findMany as any).mockImplementation(() => {
    return Promise.resolve(mockRequests);
  });
  
  // Tek bir talebi bulma işlemini simüle et
  (prisma.vehicleRequest.findUnique as any).mockImplementation(({ where }: any) => {
    const request = mockRequests.find(req => req.id === where.id);
    return Promise.resolve(request || null);
  });
  
  // Talep güncelleme işlemini simüle et
  (prisma.vehicleRequest.update as any).mockImplementation(({ where, data }: any) => {
    const index = mockRequests.findIndex(req => req.id === where.id);
    if (index !== -1) {
      mockRequests[index] = { ...mockRequests[index], ...data, updatedAt: new Date() };
      return Promise.resolve(mockRequests[index]);
    }
    throw new Error('Request not found');
  });
  
  // Talep silme işlemini simüle et
  (prisma.vehicleRequest.delete as any).mockImplementation(({ where }: any) => {
    const index = mockRequests.findIndex(req => req.id === where.id);
    if (index !== -1) {
      const deletedRequest = mockRequests[index];
      mockRequests.splice(index, 1);
      return Promise.resolve(deletedRequest);
    }
    throw new Error('Request not found');
  });
} else {
  // Geliştirme ortamında normal Prisma Client
  prisma = new PrismaClient();
}

export default prisma as PrismaClient;