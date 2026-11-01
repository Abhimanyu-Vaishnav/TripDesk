import { NextResponse } from 'next/server';
import { INITIAL_PACKAGES } from '@/lib/mockData';
import { TourPackage } from '@/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

let serverPackages: TourPackage[] = [...INITIAL_PACKAGES];

export async function GET() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        serverPackages = data.map(item => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          tagline: item.tagline || '',
          state: item.state,
          location: item.location,
          duration: item.duration || { days: 5, nights: 4 },
          price: Number(item.price) || 0,
          originalPrice: item.original_price ? Number(item.original_price) : undefined,
          hidePrice: Boolean(item.hide_price),
          featured: Boolean(item.featured),
          status: item.status || 'active',
          rating: Number(item.rating) || 4.9,
          reviewsCount: Number(item.reviews_count) || 1,
          bannerImage: item.banner_image,
          gallery: item.gallery || [],
          videoUrl: item.video_url || '',
          overview: item.overview || '',
          theme: item.theme || 'Nature',
          highlights: item.highlights || [],
          inclusions: item.inclusions || [],
          exclusions: item.exclusions || [],
          itinerary: item.itinerary || [],
          groupSize: item.group_size || 'Customizable',
          bestTimeToVisit: item.best_time_to_visit || 'Year-round'
        }));
      } else if (!error && data && data.length === 0) {
        // First-time seed: populate Supabase with verified mock packages automatically
        for (const pkg of INITIAL_PACKAGES) {
          await supabase.from('packages').upsert({
            id: pkg.id,
            slug: pkg.slug,
            title: pkg.title,
            tagline: pkg.tagline || '',
            state: pkg.state,
            location: pkg.location,
            duration: pkg.duration,
            price: pkg.price,
            original_price: pkg.originalPrice,
            hide_price: pkg.hidePrice || false,
            featured: pkg.featured || false,
            status: pkg.status || 'active',
            rating: pkg.rating,
            reviews_count: pkg.reviewsCount,
            banner_image: pkg.bannerImage,
            gallery: pkg.gallery,
            video_url: pkg.videoUrl || '',
            overview: pkg.overview || '',
            theme: pkg.theme,
            highlights: pkg.highlights,
            inclusions: pkg.inclusions,
            exclusions: pkg.exclusions,
            itinerary: pkg.itinerary,
            group_size: pkg.groupSize,
            best_time_to_visit: pkg.bestTimeToVisit,
            updated_at: new Date().toISOString()
          });
        }
      }
    } catch (e) {
      console.warn('Supabase packages fetch in API error:', e);
    }
  }

  return NextResponse.json({
    success: true,
    packages: serverPackages
  });
}

export async function POST(request: Request) {
  try {
    const pkg: TourPackage = await request.json();
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

    if (isSupabaseConfigured && supabase) {
      await supabase.from('packages').upsert({
        id: newPackage.id,
        slug: newPackage.slug,
        title: newPackage.title,
        tagline: newPackage.tagline,
        state: newPackage.state,
        location: newPackage.location,
        duration: newPackage.duration,
        price: newPackage.price,
        original_price: newPackage.originalPrice,
        hide_price: newPackage.hidePrice,
        featured: newPackage.featured,
        status: newPackage.status,
        rating: newPackage.rating,
        reviews_count: newPackage.reviewsCount,
        banner_image: newPackage.bannerImage,
        gallery: newPackage.gallery,
        video_url: newPackage.videoUrl,
        overview: newPackage.overview,
        theme: newPackage.theme,
        highlights: newPackage.highlights,
        inclusions: newPackage.inclusions,
        exclusions: newPackage.exclusions,
        itinerary: newPackage.itinerary,
        group_size: newPackage.groupSize,
        best_time_to_visit: newPackage.bestTimeToVisit,
        updated_at: new Date().toISOString()
      });
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
      return NextResponse.json({ success: false, message: 'Missing package ID' }, { status: 400 });
    }

    serverPackages = serverPackages.filter(p => p.id !== id);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('packages').delete().eq('id', id);
    }

    return NextResponse.json({ success: true, message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Error deleting package:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete package' }, { status: 500 });
  }
}
