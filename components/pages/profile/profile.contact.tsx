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

const formSchema = z.object({
  contact: z.string().max(255, {
    error: 'Too long',
  }),
})

const ProfileContact = () => {
  const { user, setUser, loading } = useAuthStore()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contact: user?.contact || '',
    },
  })
  const [open, setOpen] = React.useState<boolean>(false)
  const [updating, setUpdating] = React.useState<boolean>(false)

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user || loading) return
    setUpdating(true)

    const response = await updateUserInfo({
      user_id: user.id,
      contact: values.contact,
    })

    if (response.status == 'success') {
      toast.success(response.message)
      setUser({
        ...user,
        contact: values.contact,
      })
      setOpen(false)
    } else {
      toast.error(response.message)
    }

    setUpdating(false)
  }

  React.useEffect(() => {
    if (!user || loading) return

    form.reset()
    form.setValue('contact', user.contact || '')
  }, [form, user, loading])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={!user || loading}>
        <span
          className={
            'hover:text-foreground/80 text-foreground cursor-pointer text-sm/none capitalize'
          }
        >
          {[user?.contact].join(' ').toLowerCase().trim() || 'No contact'}
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
                name="contact"
                render={({ field }) => (
                  <FormItem className={'w-72'}>
                    <FormLabel className={'text-xs/none'}>Contact</FormLabel>
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

export default ProfileContact
