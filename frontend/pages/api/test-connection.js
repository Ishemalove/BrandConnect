// API route to test connection to backend

export default async function handler(req, res) {
  try {
    console.log("Testing backend API connection...");
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    console.log("Using backend URL:", backendUrl);

    const response = await fetch(`${backendUrl}/applications/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || ""
      }
    });

    const data = await response.text();
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    
    return res.status(200).json({
      status: response.status,
      backend_url: backendUrl,
      ok: response.ok,
      data: data.substring(0, 1000) // Just the first 1000 chars for safety
    });
  } catch (error) {
    console.error("Connection test error:", error);
    return res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
} 