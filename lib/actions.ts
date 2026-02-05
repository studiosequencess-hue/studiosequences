import { ServerResponse } from '@/lib/models'

type ApiRequest<T, K> = (...args: K[]) => Promise<ServerResponse<T>>

export async function ServerRequest<T, K = void>(
  title: string,
  request: ApiRequest<T, K>,
  error?: string,
): Promise<ServerResponse<T | null>> {
  try {
    return await request()
  } catch (e) {
    console.log(`${title} error:`, e)
    return {
      status: 'error',
      message: error || 'Server error. Please try again later.',
    }
  }
}
