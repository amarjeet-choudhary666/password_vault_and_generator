import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('2FA Setup - Making request to backend...');
    console.log('Cookies:', request.headers.get('cookie'));
    
    const response = await fetch('http://localhost:8000/v1/api/user/2fa/setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    console.log('Backend response status:', response.status);
    
    const data = await response.json();
    console.log('Backend response data:', data);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('2FA setup proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}