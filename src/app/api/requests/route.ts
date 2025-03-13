import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Format the date and time for database storage
    const missionDateObj = body.missionDate ? new Date(body.missionDate) : new Date();
    
    // Log the data we're trying to insert for debugging
    console.log('Creating vehicle request with data:', {
      unitName: body.name,
      personnelName: body.personnelId,
      phoneNumber: body.phoneNumber,
      notes: body.notes || "",
      missionDate: missionDateObj,
      missionTime: body.missionTime || "",
      destination: body.destination || "",
      withWheelchair: body.withChair || false,
      withStretcher: body.withSeat || false,
    });
    
    const vehicleRequest = await prisma.vehicleRequest.create({
      data: {
        unitName: body.name,
        personnelName: body.personnelId,
        phoneNumber: body.phoneNumber,
        notes: body.notes || "",
        missionDate: missionDateObj,
        missionTime: body.missionTime || "",
        destination: body.destination || "",
        withWheelchair: body.withChair || false,
        withStretcher: body.withSeat || false,
      },
    });

    return NextResponse.json({ success: true, data: vehicleRequest }, { status: 201 });
  } catch (error) {
    console.error('Request error:', error);
    
    // Provide more detailed error message
    const errorMessage = error instanceof Error 
      ? `Talep oluşturulamadı: ${error.message}` 
      : 'Talep oluşturulurken bir hata oluştu';
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const requests = await prisma.vehicleRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json({ success: true, data: requests });
  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}