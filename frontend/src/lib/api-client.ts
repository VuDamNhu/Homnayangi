class ApiError extends Error {
  constructor(public message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Tránh gọi refresh nhiều lần cùng lúc khi nhiều request cùng bị 401
let refreshPromise: Promise<boolean> | null = null;

/**
 * Gọi API refresh token (cookie tự gửi kèm)
 * @returns true nếu refresh thành công
 */
async function refreshToken(): Promise<boolean> {
  const res = await fetch(`${API_URL}/auth/refresh`, { method: 'POST', credentials: 'include' });
  return res.ok;
}

/**
 * Hàm gọi API dùng chung
 * - Luôn gửi kèm cookie (credentials: 'include')
 * - Gặp 401 → tự refresh token 1 lần rồi gọi lại
 */
export async function apiFetch<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  if (res.status === 401 && retry) {
    refreshPromise ??= refreshToken().finally(() => (refreshPromise = null));
    const ok = await refreshPromise;
    if (ok) return apiFetch<T>(path, options, false);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  const body = await res.json();
  if (!res.ok) throw new ApiError(body.message ?? 'Có lỗi xảy ra', res.status);
  return body.data as T;
}
