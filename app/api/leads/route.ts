import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Log the received lead
    console.log('[TripDesk Lead Received]:', body);

    // Optional: If user configured a Google Sheets / Webhook URL via env, forward it
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      } catch (webhookErr) {
        console.warn('Webhook dispatch failed:', webhookErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry received successfully. Our desk representative will be in touch shortly.',
      lead: body
    });
  } catch (error) {
    console.error('Error handling lead inquiry:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process inquiry' },
      { status: 500 }
    );
  }
}

