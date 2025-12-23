'use client'

import React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { User } from '@/lib/models'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
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

type Props = {
  user: User
  setUser: (user: User) => void
  show: boolean
  setShow: (show: boolean) => void
}

const formSchema = z.object({
  pronoun: z.string().max(50, {
    error: 'Too long',
  }),
})

const EditPronoun: React.FC<Props> = ({ user, setUser, show, setShow }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pronoun: user.pronoun || '',
    },
  })
  const [updating, setUpdating] = React.useState<boolean>(false)

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setUpdating(true)

    const response = await updateUserInfo({
      user_id: user.id,
      pronoun: values.pronoun,
    })

    if (response.status == 'success') {
      toast.success(response.message)
      setUser({
        ...user,
        pronoun: values.pronoun,
      })
      setShow(false)
    } else {
      toast.error(response.message)
    }

    setUpdating(false)
  }

  React.useEffect(() => {
    form.reset()
    form.setValue('pronoun', user.pronoun || '')
  }, [form, user, show])

  return (
    <Popover open={show} onOpenChange={setShow}>
      <PopoverTrigger asChild>
        <span
          className={
            'hover:text-foreground/80 text-foreground cursor-pointer self-end text-sm/none capitalize'
          }
        >
          ({user.pronoun?.trim() || 'No pronoun'})
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
                name="pronoun"
                render={({ field }) => (
                  <FormItem className={'w-40'}>
                    <FormLabel className={'text-xs/none'}>
                      Pronoun<sup>*</sup>
                    </FormLabel>
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

export default EditPronoun
