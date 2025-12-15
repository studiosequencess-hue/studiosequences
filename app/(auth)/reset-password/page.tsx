'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field } from '@/components/ui/field'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/store'
import { resetPassword, sendPasswordResetRequest } from '@/lib/actions.auth'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase.client'

const formSchema = z
  .object({
    password: z
      .string()
      .min(2, {
        error: 'Too short',
      })
      .max(50, {
        error: 'Too long',
      }),
    confirmPassword: z
      .string()
      .min(2, {
        error: 'Too short',
      })
      .max(50, {
        error: 'Too long',
      }),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword
    },
    {
      error: "Passwords don't match!",
      path: ['confirmPassword'],
    },
  )

const ResetPasswordPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const { setLoading, loading, setUser } = useAuthStore()
  const router = useRouter()

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)

    const response = await resetPassword(values)

    if (response.status == 'success') {
      toast.success(response.message)
      setUser(response.data)
      router.push('/')
    } else {
      toast.error(response.message)
    }

    setLoading(false)
  }

  React.useEffect(() => {
    const supabase = createClient()

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        setLoading(false)
      } else {
        toast.error('Password reset link is invalid or expired.')
        setLoading(false)
        router.push('/login')
      }
    }

    checkSession()
  }, [router, setLoading])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Reset password</CardTitle>
            <CardDescription>
              Enter new password to reset password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type={'password'}
                          placeholder={'*********'}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type={'password'}
                          placeholder={'*********'}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Field className={'mt-4'}>
                  <Button variant="secondary" type="submit" disabled={loading}>
                    {loading ? (
                      <div className={'flex items-center gap-2'}>
                        <Spinner />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      'Reset password'
                    )}
                  </Button>
                </Field>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ResetPasswordPage
