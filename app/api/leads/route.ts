import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { LeadInquiry } from '@/types';

export async function GET() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const leads: LeadInquiry[] = data.map(item => ({
          id: item.id,
          type: item.type || 'general_inquiry',
          name: item.name,
          phone: item.phone,
          email: item.email || '',
          destination: item.destination || '',
          travelDate: item.travel_date || '',
          travelersCount: item.travelers_count || 2,
          budgetRange: item.budget_range || '',
          notes: item.notes || '',
          packageId: item.package_id,
          packageTitle: item.package_title,
          createdAt: item.created_at,
          status: item.status || 'new'
        }));
        return NextResponse.json({ success: true, leads });
      }
    } catch (e) {
      console.warn('Supabase fetch leads error:', e);
    }
  }

  return NextResponse.json({ success: true, leads: [] });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || `lead-${Date.now()}`;
    const lead: LeadInquiry = {
      ...body,
      id,
      createdAt: body.createdAt || new Date().toISOString(),
      status: body.status || 'new'
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('leads').insert({
        id: lead.id,
        type: lead.type,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        destination: lead.destination,
        travel_date: lead.travelDate,
        travelers_count: lead.travelersCount,
        budget_range: lead.budgetRange,
        notes: lead.notes,
        package_id: lead.packageId,
        package_title: lead.packageTitle,
        status: lead.status,
        created_at: lead.createdAt
      });
    }

    // Optional: If user configured a Google Sheets / Webhook URL via env, forward it
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lead)
        });
      } catch (webhookErr) {
        console.warn('Webhook dispatch failed:', webhookErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry received successfully. Our desk representative will be in touch shortly.',
      lead
    });
  } catch (error) {
    console.error('Error handling lead inquiry:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process inquiry' },
      { status: 500 }
    );
  }
}
