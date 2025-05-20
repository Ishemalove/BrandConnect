/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: [
      'images.unsplash.com',
      'localhost',
      'picsum.photos',
      'via.placeholder.com',
      'cloudflare-ipfs.com',
      'source.unsplash.com',
      'placehold.co',
      'placeimg.com',
      'randomuser.me',
      'i.imgur.com',
      'placekitten.com',
      'storage.googleapis.com',
      'firebasestorage.googleapis.com',
      'res.cloudinary.com',
      'amazonaws.com',
      's3.amazonaws.com',
      'img.freepik.com',
      'loremflickr.com'
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ]
  },
}

export default nextConfig
