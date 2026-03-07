'use client'

import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { updateUserInfo } from '@/lib/actions.user'
import { toast } from 'sonner'
import { useAuthStore } from '@/store'
import { Label } from '@/components/ui/label'

type Props = {
  editable: boolean
}

const ProfileOpenToWork: React.FC<Props> = ({ editable }) => {
  const { user, setUser, loading } = useAuthStore()
  const [updating, setUpdating] = React.useState<boolean>(false)

  const handleSubmit = async (value: boolean) => {
    if (!user || loading) return
    if (updating) return
    if (!editable) return
    setUpdating(true)

    setUser({
      ...user,
      isOpenToWork: value,
    })

    const response = await updateUserInfo({
      user_id: user.id,
      isOpenToWork: value,
    })

    if (response.status == 'success') {
      toast.success(response.message)
    } else {
      toast.error(response.message)
    }

    setUpdating(false)
  }

  if (!editable) return null

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="isOpenToWork">Is Open to Work</Label>
      <Checkbox
        id="isOpenToWork"
        checked={user?.isOpenToWork || false}
        onCheckedChange={(v) => handleSubmit(!!v)}
      />
    </div>
  )
}

export default ProfileOpenToWork
