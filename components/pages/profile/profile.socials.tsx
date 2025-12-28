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
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa6'
import Link from 'next/link'

type Props = {
  editable: boolean
}

const formSchema = z.object({
  instagram: z.string().max(255, {
    error: 'Too long',
  }),
  twitter: z.string().max(255, {
    error: 'Too long',
  }),
  facebook: z.string().max(255, {
    error: 'Too long',
  }),
  linkedin: z.string().max(255, {
    error: 'Too long',
  }),
})

const ProfileSocials: React.FC<Props> = ({ editable }) => {
  const { user, setUser, loading } = useAuthStore()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instagram: user?.instagram || '',
      twitter: user?.twitter || '',
      linkedin: user?.linkedin || '',
      facebook: user?.facebook || '',
    },
  })
  const [open, setOpen] = React.useState<boolean>(false)
  const [updating, setUpdating] = React.useState<boolean>(false)

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user || loading) return
    if (!editable) return
    setUpdating(true)

    const response = await updateUserInfo({
      user_id: user.id,
      instagram: values.instagram,
      twitter: values.twitter,
      linkedin: values.linkedin,
      facebook: values.facebook,
    })

    if (response.status == 'success') {
      toast.success(response.message)
      setUser({
        ...user,
        instagram: values.instagram,
        twitter: values.twitter,
        linkedin: values.linkedin,
        facebook: values.facebook,
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
    form.setValue('instagram', user.instagram || '')
    form.setValue('linkedin', user.linkedin || '')
    form.setValue('twitter', user.twitter || '')
    form.setValue('facebook', user.facebook || '')
  }, [form, user, loading])

  if (!editable) {
    return (
      <div
        className={
          'text-foreground flex items-center gap-1.5 text-lg/none capitalize'
        }
      >
        <Link href={user?.instagram || ''}>
          <FaInstagram />
        </Link>
        <Link href={user?.twitter || ''}>
          <FaTwitter />
        </Link>
        <Link href={user?.facebook || ''}>
          <FaFacebook />
        </Link>
        <Link href={user?.linkedin || ''}>
          <FaLinkedin />
        </Link>
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={!user || loading}>
        <div
          className={
            'hover:text-foreground/80 text-foreground flex cursor-pointer items-center gap-1.5 text-lg/none capitalize'
          }
        >
          <FaInstagram />
          <FaTwitter />
          <FaFacebook />
          <FaLinkedin />
        </div>
      </PopoverTrigger>
      <PopoverContent align={'start'} sideOffset={20} className={'w-fit'}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <div className={'grid w-96 grid-cols-2 gap-2'}>
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem className={''}>
                    <FormLabel className={'text-xs/none'}>Instagram</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className={'text-xs/none'} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem className={''}>
                    <FormLabel className={'text-xs/none'}>Twitter</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className={'text-xs/none'} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem className={''}>
                    <FormLabel className={'text-xs/none'}>Facebook</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className={'text-xs/none'} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem className={''}>
                    <FormLabel className={'text-xs/none'}>LinkedIn</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
              disabled={
                !form.formState.isValid || !form.formState.isDirty || updating
              }
            >
              {updating ? <Spinner /> : 'Update'}
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}

export default ProfileSocials
