import { NextResponse } from 'next/server';
import { INITIAL_PACKAGES } from '@/lib/mockData';
import { TourPackage } from '@/types';

// In-memory runtime cache for server-side persistence during active session
let serverPackages: TourPackage[] = [...INITIAL_PACKAGES];

export async function GET() {
  return NextResponse.json({
    success: true,
    packages: serverPackages
  });
}

export async function POST(request: Request) {
  try {
    const pkg = await request.json();
    const id = pkg.id || `td-${Date.now()}`;
    const slug = pkg.slug || pkg.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newPackage: TourPackage = {
      ...pkg,
      id,
      slug,
      rating: pkg.rating || 4.9,
      reviewsCount: pkg.reviewsCount || 1,
      status: pkg.status || 'active',
      featured: Boolean(pkg.featured)
    };

    const existingIndex = serverPackages.findIndex(p => p.id === id);
    if (existingIndex >= 0) {
      serverPackages[existingIndex] = newPackage;
    } else {
      serverPackages.unshift(newPackage);
    }

    return NextResponse.json({ success: true, package: newPackage });
  } catch (error) {
    console.error('Error saving package:', error);
    return NextResponse.json({ success: false, message: 'Failed to save package' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Package ID required' }, { status: 400 });
    }

    serverPackages = serverPackages.filter(p => p.id !== id);
    return NextResponse.json({ success: true, message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Error deleting package:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete package' }, { status: 500 });
  }
}

