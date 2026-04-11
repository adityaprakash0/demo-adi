const PULSEIQ_PROJECT_ID = '69d692e2dca3ba1ee362b54b';
const PULSEIQ_ENDPOINT = 'https://pulseiq-ffio.onrender.com/api/ingest/event';

async function track(eventName, userId = null, properties = {}) {
  const pulseIQApiKey = process.env.PULSEIQ_API_KEY;

  if (!pulseIQApiKey) {
    return;
  }

  try {
    await fetch(PULSEIQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': pulseIQApiKey,
      },
      body: JSON.stringify({
        projectId: PULSEIQ_PROJECT_ID,
        eventName,
        userId: userId || undefined,
        anonymousId: 'server_event',
        properties,
      }),
    });
  } catch {}
}

async function identify(userId, properties = {}) {
  if (!userId) {
    return;
  }

  await track('identify', userId, properties);
}

export { identify, track };
