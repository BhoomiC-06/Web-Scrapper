import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Clear authentication (in a real app, you'd invalidate the JWT token)
    const response = NextResponse.json({ message: 'Logged out successfully' });
    
    // Remove authentication cookie/session
    response.cookies.set('auth-token', '', { 
      httpOnly: true, 
      expires: new Date(0),
      path: '/'
    });
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}