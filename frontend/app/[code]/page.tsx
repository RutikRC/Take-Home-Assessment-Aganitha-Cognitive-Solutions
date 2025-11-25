'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function RedirectPage() {
  const params = useParams();
  const router = useRouter();
  const code = params?.code as string;

  useEffect(() => {
    const redirect = async () => {
      // Skip if it's a reserved path
      if (code === 'api' || code === 'healthz' || code === 'code') {
        router.push('/');
        return;
      }

      // Validate code format
      if (!code || !/^[A-Za-z0-9]{6,8}$/.test(code)) {
        router.push('/');
        return;
      }

      try {
        // First, track the click by calling backend redirect endpoint
        // This will increment the click count and return the target URL
        const redirectResponse = await fetch(`${API_URL}/${code}`, {
          method: 'GET',
          redirect: 'manual', // Don't follow redirect automatically
        });

        if (redirectResponse.status === 404) {
          // Link not found, redirect to home
          router.push('/');
          return;
        }

        if (redirectResponse.status === 302) {
          // Get the target URL from the Location header
          const targetUrl = redirectResponse.headers.get('Location');
          if (targetUrl) {
            // Redirect to target URL
            window.location.href = targetUrl;
            return;
          }
        }

        // Fallback: Get link info from API if redirect header not available
        const apiResponse = await fetch(`${API_URL}/api/links/${code}`);
        if (apiResponse.ok) {
          const link = await apiResponse.json();
          window.location.href = link.target_url;
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Redirect error:', error);
        router.push('/');
      }
    };

    if (code) {
      redirect();
    }
  }, [code, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-gray-600 font-medium">Redirecting...</p>
      </div>
    </div>
  );
}

