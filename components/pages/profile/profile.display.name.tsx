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
  firstName: z.string().max(255, {
    error: 'Too long',
  }),
  lastName: z.string().max(255, {
    error: 'Too long',
  }),
  companyName: z.string().max(255, { error: 'Too long' }),
})

const ProfileDisplayName: React.FC<Props> = ({ user, editable }) => {
  const { user: currentUser, setUser, loading } = useAuthStore()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      companyName: currentUser?.companyName || '',
    },
  })
  const [open, setOpen] = React.useState<boolean>(false)
  const [updating, setUpdating] = React.useState<boolean>(false)

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!currentUser || loading) return
    if (!editable) return

    if (
      currentUser.role == UserRole.User.toString() &&
      values.firstName.trim().length <= 0
    ) {
      form.setError('firstName', {
        message: 'Too short',
      })
      return
    }

    if (
      currentUser.role == UserRole.Company.toString() &&
      values.lastName.trim().length <= 0
    ) {
      form.setError('companyName', {
        message: 'Too short',
      })
      return
    }

    setUpdating(true)

    const response = await updateUserInfo({
      user_id: currentUser.id,
      firstName: values.firstName,
      lastName: values.lastName,
      companyName: values.companyName,
    })

    if (response.status == 'success') {
      toast.success(response.message)
      setUser({
        ...currentUser,
        firstName: values.firstName,
        lastName: values.lastName,
        companyName: values.companyName,
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
    form.setValue('firstName', currentUser.firstName || '')
    form.setValue('lastName', currentUser.lastName || '')
    form.setValue('companyName', currentUser.companyName || '')
  }, [form, currentUser, loading])

  if (!editable) {
    return (
      <span className={'text-foreground text-xl/none capitalize'}>
        {(user?.role == UserRole.Company.toString()
          ? [user?.companyName]
          : [user?.firstName, user?.lastName]
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
            ? [currentUser?.companyName]
            : [currentUser?.firstName, currentUser?.lastName]
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
                    name="firstName"
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
                    name="lastName"
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
                  name="companyName"
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
