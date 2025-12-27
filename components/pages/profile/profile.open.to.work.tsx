'use client'

import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { updateUserInfo } from '@/lib/actions.user'
import { toast } from 'sonner'
import { useAuthStore } from '@/store'
import { Label } from '@/components/ui/label'

const ProfileOpenToWork = () => {
  const { user, setUser, loading } = useAuthStore()
  const [updating, setUpdating] = React.useState<boolean>(false)

  const handleSubmit = async (value: boolean) => {
    if (!user || loading) return
    if (updating) return
    setUpdating(true)

    setUser({
      ...user,
      is_open_to_work: value,
    })

    const response = await updateUserInfo({
      user_id: user.id,
      is_open_to_work: value,
    })

    if (response.status == 'success') {
      toast.success(response.message)
    } else {
      toast.error(response.message)
    }

    setUpdating(false)
  }

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="is_open_to_work">Is Open to Work</Label>
      <Checkbox
        id="is_open_to_work"
        checked={user?.is_open_to_work || false}
        onCheckedChange={(v) => handleSubmit(!!v)}
      />
    </div>
  )
}

export default ProfileOpenToWork
