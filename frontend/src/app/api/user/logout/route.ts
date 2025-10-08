import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Forward the request to the backend
    const backendResponse = await fetch('http://localhost:8000/v1/api/user/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    const data = await backendResponse.json();
    
    // Create response and clear cookies
    const response = NextResponse.json(data, { status: backendResponse.status });
    
    // Clear cookies
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    
    return response;
  } catch (error) {
    console.error('Logout proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}