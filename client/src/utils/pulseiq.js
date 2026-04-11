const PULSEIQ_API_KEY = import.meta.env.VITE_PULSEIQ_API_KEY;
const PULSEIQ_PROJECT_ID = '69d692e2dca3ba1ee362b54b';
const PULSEIQ_ENDPOINT = 'https://pulseiq-ffio.onrender.com/api/ingest/event';
const PULSEIQ_ANONYMOUS_ID_KEY = 'pulseiqAnonymousId';

let lastTrackedPageKey = null;
let lastIdentifiedUserId = null;

const getAnonymousId = () => {
  if (typeof window === 'undefined') {
    return 'browser_event';
  }

  const storedAnonymousId = window.localStorage.getItem(PULSEIQ_ANONYMOUS_ID_KEY);

  if (storedAnonymousId) {
    return storedAnonymousId;
  }

  const anonymousId =
    window.crypto?.randomUUID?.() || `pulseiq_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  window.localStorage.setItem(PULSEIQ_ANONYMOUS_ID_KEY, anonymousId);

  return anonymousId;
};

export async function track(eventName, userId = null, properties = {}) {
  if (!PULSEIQ_API_KEY) {
    return;
  }

  try {
    await fetch(PULSEIQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': PULSEIQ_API_KEY,
      },
      body: JSON.stringify({
        projectId: PULSEIQ_PROJECT_ID,
        eventName,
        userId: userId || undefined,
        anonymousId: getAnonymousId(),
        properties,
      }),
    });
  } catch {}
}

export async function identify(userId, properties = {}) {
  if (!userId || lastIdentifiedUserId === userId) {
    return;
  }

  lastIdentifiedUserId = userId;
  await track('identify', userId, properties);
}

export function resetIdentity() {
  lastIdentifiedUserId = null;
}

export function trackPageView(location, userId = null) {
  const pageKey = `${location.pathname}${location.search}${location.hash}`;

  if (lastTrackedPageKey === pageKey) {
    return;
  }

  lastTrackedPageKey = pageKey;

  void track('page_view', userId, {
    path: location.pathname,
    search: location.search,
    hash: location.hash,
    title: document.title,
    url: window.location.href,
  });
}
