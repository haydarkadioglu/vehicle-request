import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type RouteParams = {
  params: {
    id: string;
  };
};

// Fix the GET handler signature to match Next.js expectations
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID' },
        { status: 400 }
      );
    }

    const vehicleRequest = await prisma.vehicleRequest.findUnique({
      where: { id }
    });

    if (!vehicleRequest) {
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: vehicleRequest });
  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch request' },
      { status: 500 }
    );
  }
}

// Fix the PATCH handler signature as well
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate the status
    if (body.status && !['PENDING', 'APPROVED', 'REJECTED'].includes(body.status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const updatedRequest = await prisma.vehicleRequest.update({
      where: { id },
      data: {
        status: body.status
      }
    });

    return NextResponse.json({ success: true, data: updatedRequest });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update request' },
      { status: 500 }
    );
  }
}

// Fix the DELETE handler signature as well
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID' },
        { status: 400 }
      );
    }

    // Check if the request exists before deleting
    const existingRequest = await prisma.vehicleRequest.findUnique({
      where: { id }
    });

    if (!existingRequest) {
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      );
    }

    // Delete the request
    await prisma.vehicleRequest.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete request' },
      { status: 500 }
    );
  }
}