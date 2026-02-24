'use client'

import { useEffect, useState } from 'react'
import { getPendingRequests, handleRequest } from '@/lib/actions.messaging'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'

export function RequestsPanel() {
  const [requests, setRequests] = useState<any[]>([])

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    const res = await getPendingRequests()
    if (res.status === 'success') {
      setRequests(res.data || [])
    }
  }

  const handleAction = async (
    requestId: number,
    action: 'approve' | 'reject',
  ) => {
    await handleRequest(requestId, action)
    loadRequests()
  }

  if (requests.length === 0) return null

  return (
    <div className="mb-4 rounded-lg border bg-yellow-50 p-4">
      <h3 className="mb-3 font-semibold">
        Pending Requests ({requests.length})
      </h3>
      <div className="space-y-3">
        {requests.map((req) => (
          <div
            key={req.id}
            className="flex items-center justify-between rounded-lg bg-white p-3"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-200">
                {req.user?.avatar && (
                  <img
                    src={req.user.avatar}
                    alt=""
                    className="h-full w-full rounded-full object-cover"
                  />
                )}
              </div>
              <div>
                <div className="font-medium">
                  {req.user?.first_name} {req.user?.last_name}
                </div>
                <div className="text-muted-foreground text-sm">
                  @{req.user?.username}
                </div>
                {req.message && (
                  <div className="mt-1 text-sm italic">"{req.message}"</div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAction(req.id, 'reject')}
              >
                <X size={16} />
              </Button>
              <Button size="sm" onClick={() => handleAction(req.id, 'approve')}>
                <Check size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
