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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
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
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useAuthStore } from '@/store'
import { signInWithEmailPassword } from '@/lib/actions.auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(50),
})

const LoginPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { setLoading, loading, setUser } = useAuthStore()
  const router = useRouter()

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)

    const response = await signInWithEmailPassword(values)

    if (response.status == 'success') {
      setUser(response.data)
      toast.success(response.message)
      router.push('/')
    } else {
      toast.error(response.message)
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type={'email'}
                          placeholder={'email@example.com'}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <Field className={'mt-4'}>
                  <Button variant="secondary" type="submit" disabled={loading}>
                    {loading ? (
                      <div className={'flex items-center gap-2'}>
                        <Spinner />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      'Login'
                    )}
                  </Button>
                  {/*<Button variant="ghost" type="button">*/}
                  {/*  Login with Google*/}
                  {/*</Button>*/}
                  <FieldDescription className="text-center">
                    <span>Don&apos;t have an account? </span>
                    <Link
                      href="/signup"
                      className={'text-foreground hover:text-foreground/80!'}
                    >
                      Sign up
                    </Link>
                  </FieldDescription>
                </Field>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
