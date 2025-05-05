import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    console.log("Debug API: Testing connection to:", backendUrl);

    // Get the auth token from the request headers
    const authHeader = request.headers.get('authorization') || '';
    
    // Try all application endpoints and return debug info
    const endpoints = [
      "/applications",
      "/applications/my",
    ];
    
    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const fullUrl = `${backendUrl}${endpoint}`;
        console.log(`Debug API: Trying ${fullUrl}`);
        
        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
          }
        });
        
        let responseData;
        try {
          responseData = await response.json();
        } catch (e) {
          responseData = { error: "Invalid JSON response", text: await response.text() };
        }
        
        results.push({
          endpoint,
          status: response.status,
          ok: response.ok,
          data: responseData,
          headers: Object.fromEntries(response.headers.entries())
        });
      } catch (error: any) {
        results.push({
          endpoint,
          error: error.message,
          stack: error.stack
        });
      }
    }
    
    return NextResponse.json({
      backend_url: backendUrl,
      endpoints_tested: endpoints,
      results
    });
  } catch (error: any) {
    console.error("Debug API error:", error);
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
} 