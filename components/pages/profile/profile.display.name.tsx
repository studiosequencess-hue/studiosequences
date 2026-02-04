'use client'

import React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { DBUser } from '@/lib/models'
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
import { UserRole } from '@/lib/constants'

type Props = {
  user: DBUser
  editable: boolean
}

const formSchema = z.object({
  first_name: z.string().max(255, {
    error: 'Too long',
  }),
  last_name: z.string().max(255, {
    error: 'Too long',
  }),
  company_name: z.string().max(255, { error: 'Too long' }),
})

const ProfileDisplayName: React.FC<Props> = ({ user, editable }) => {
  const { user: currentUser, setUser, loading } = useAuthStore()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: currentUser?.first_name || '',
      last_name: currentUser?.last_name || '',
      company_name: currentUser?.company_name || '',
    },
  })
  const [open, setOpen] = React.useState<boolean>(false)
  const [updating, setUpdating] = React.useState<boolean>(false)

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!currentUser || loading) return
    if (!editable) return

    if (
      currentUser.role == UserRole.User.toString() &&
      values.first_name.trim().length <= 0
    ) {
      form.setError('first_name', {
        message: 'Too short',
      })
      return
    }

    if (
      currentUser.role == UserRole.Company.toString() &&
      values.company_name.trim().length <= 0
    ) {
      form.setError('company_name', {
        message: 'Too short',
      })
      return
    }

    setUpdating(true)

    const response = await updateUserInfo({
      user_id: currentUser.id,
      first_name: values.first_name,
      last_name: values.last_name,
      company_name: values.company_name,
    })

    if (response.status == 'success') {
      toast.success(response.message)
      setUser({
        ...currentUser,
        first_name: values.first_name,
        last_name: values.last_name,
        company_name: values.company_name,
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
    form.setValue('first_name', currentUser.first_name || '')
    form.setValue('last_name', currentUser.last_name || '')
    form.setValue('company_name', currentUser.company_name || '')
  }, [form, currentUser, loading])

  if (!editable) {
    return (
      <span className={'text-foreground text-xl/none capitalize'}>
        {(user?.role == UserRole.Company.toString()
          ? [user?.company_name]
          : [user?.first_name, user?.last_name]
        )
          .join(' ')
          .toLowerCase()
          .trim() || 'No name'}
      </span>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={!currentUser || loading}>
        <span
          className={
            'hover:text-foreground/80 text-foreground cursor-pointer text-xl/none capitalize'
          }
        >
          {(currentUser?.role == UserRole.Company.toString()
            ? [currentUser?.company_name]
            : [currentUser?.first_name, currentUser?.last_name]
          )
            .join(' ')
            .toLowerCase()
            .trim() || 'No name'}
        </span>
      </PopoverTrigger>
      <PopoverContent align={'start'} sideOffset={20} className={'w-fit'}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <div className={'flex w-full items-start gap-4'}>
              {currentUser?.role == UserRole.User.toString() && (
                <React.Fragment>
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem className={'w-40'}>
                        <FormLabel className={'text-xs/none'}>
                          First Name<sup>*</sup>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage className={'text-xs/none'} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem className={'w-40'}>
                        <FormLabel className={'text-xs/none'}>
                          Last Name{' '}
                          <span className={'text-muted-foreground'}>
                            (optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage className={'text-xs/none'} />
                      </FormItem>
                    )}
                  />
                </React.Fragment>
              )}
              {currentUser?.role == UserRole.Company.toString() && (
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem className={'w-40'}>
                      <FormLabel className={'text-xs/none'}>
                        Company Name<sup>*</sup>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage className={'text-xs/none'} />
                    </FormItem>
                  )}
                />
              )}
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

export default ProfileDisplayName
