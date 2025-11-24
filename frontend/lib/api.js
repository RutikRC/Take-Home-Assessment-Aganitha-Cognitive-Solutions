const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function createLink(targetUrl, code = null) {
  const response = await fetch(`${API_URL}/api/links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      target_url: targetUrl,
      code: code || undefined,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create link');
  }

  return response.json();
}

export async function getLinks() {
  const response = await fetch(`${API_URL}/api/links`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch links');
  }

  return response.json();
}

export async function getLinkStats(code) {
  const response = await fetch(`${API_URL}/api/links/${code}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Link not found');
    }
    throw new Error('Failed to fetch link stats');
  }

  return response.json();
}

export async function deleteLink(code) {
  const response = await fetch(`${API_URL}/api/links/${code}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Link not found');
    }
    throw new Error('Failed to delete link');
  }
}

