'use client'

import React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { updateUserInfo } from '@/lib/actions.user'
import { toast } from 'sonner'
import { useAuthStore } from '@/store'
import { Textarea } from '@/components/ui/textarea'
import { DBUser } from '@/lib/models'

type Props = {
  user: DBUser
  editable: boolean
}

const formSchema = z.object({
  location: z.string().max(255, {
    error: 'Too long',
  }),
})

const ProfileLocation: React.FC<Props> = ({ user, editable }) => {
  const { user: currentUser, setUser, loading } = useAuthStore()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: currentUser?.location || '',
    },
  })
  const [open, setOpen] = React.useState<boolean>(false)
  const [updating, setUpdating] = React.useState<boolean>(false)

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!currentUser || loading) return
    if (!editable) return
    setUpdating(true)

    const response = await updateUserInfo({
      user_id: currentUser.id,
      location: values.location,
    })

    if (response.status == 'success') {
      toast.success(response.message)
      setUser({
        ...currentUser,
        location: values.location,
      })
      setOpen(false)
    } else {
      toast.error(response.message)
    }

    setUpdating(false)
  }

  React.useEffect(() => {
    if (!currentUser || loading) return

    form.reset()
    form.setValue('location', currentUser.location || '')
  }, [form, currentUser, loading])

  if (!editable) {
    return (
      <span className={'text-foreground text-sm/none capitalize'}>
        {[user?.location].join(' ').toLowerCase().trim() || 'No location'}
      </span>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={!currentUser || loading}>
        <span
          className={
            'hover:text-foreground/80 text-foreground cursor-pointer text-sm/none capitalize'
          }
        >
          {[currentUser?.location].join(' ').toLowerCase().trim() ||
            'No location'}
        </span>
      </PopoverTrigger>
      <PopoverContent align={'start'} sideOffset={20} className={'w-fit'}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <div className={'flex w-full items-start gap-4'}>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className={'w-72'}>
                    <FormLabel className={'text-xs/none'}>Location</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage className={'text-xs/none'} />
                  </FormItem>
                )}
              />
            </div>
            <Button
              size="sm"
              variant={'secondary'}
              type="submit"
              className={'flex w-24 items-center justify-center self-end'}
              disabled={!form.formState.isValid || updating}
            >
              {updating ? <Spinner /> : 'Update'}
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}

export default ProfileLocation
