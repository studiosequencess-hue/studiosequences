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
import { Field, FieldDescription } from '@/components/ui/field'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useAuthStore } from '@/store'
import { signUpWithEmailPassword } from '@/lib/actions.auth'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import { useRouter } from 'next/navigation'
import { HiOutlineAtSymbol } from 'react-icons/hi2'

const formSchema = z
  .object({
    username: z
      .string()
      .min(2, {
        error: 'Too short',
      })
      .max(255, {
        error: 'Too long',
      }),
    first_name: z
      .string()
      .min(1, {
        error: 'Too short',
      })
      .max(255, {
        error: 'Too long',
      }),
    last_name: z.string().max(255, {
      error: 'Too long',
    }),
    pronoun: z.string().max(255, {
      error: 'Too long',
    }),
    email: z.email(),
    contact: z.string().max(255, {
      error: 'Too long',
    }),
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

const SignupPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      first_name: '',
      last_name: '',
      pronoun: '',
      email: '',
      contact: '',
      password: '',
      confirmPassword: '',
    },
  })

  const { setLoading, loading } = useAuthStore()
  const router = useRouter()

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)

    const response = await signUpWithEmailPassword(values)

    if (response.status == 'success') {
      toast.success(response.message)
      router.push('/login')
    } else {
      toast.error(response.message)
    }

    setLoading(false)
  }

  React.useEffect(() => {
    router.prefetch('/login')
    router.prefetch('/forgot-password')
  }, [router])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your information below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col gap-4"
              >
                <div className={'grid grid-cols-2 items-start gap-4'}>
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            type={'text'}
                            placeholder={'John'}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className={'flex items-center justify-between'}
                        >
                          <span>Last Name </span>
                          <span className={'text-muted-foreground'}>
                            (optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input type={'text'} placeholder={'Doe'} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className={'grid grid-cols-2 items-start gap-4'}>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupInput
                              type={'text'}
                              placeholder={'johndoe'}
                              {...field}
                            />
                            <InputGroupAddon>
                              <HiOutlineAtSymbol />
                            </InputGroupAddon>
                          </InputGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pronoun"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className={'flex items-center justify-between'}
                        >
                          <span>Pronoun </span>
                          <span className={'text-muted-foreground'}>
                            (optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input type={'text'} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className={'grid grid-cols-2 items-start gap-4'}>
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
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className={'flex items-center justify-between'}
                        >
                          <span>Contact </span>
                          <span className={'text-muted-foreground'}>
                            (optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type={'tel'}
                            placeholder={'(555) 123-4567 or 5551234567'}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className={'grid grid-cols-2 items-start gap-4'}>
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
                </div>
                <Field className={'mt-4'}>
                  <Link
                    href={'/forgot-password'}
                    className={
                      'w-fit! self-end pr-2 text-xs/none underline-offset-4 hover:underline'
                    }
                  >
                    Forgot password
                  </Link>
                  <Button variant="secondary" type="submit" disabled={loading}>
                    {loading ? (
                      <div className={'flex items-center gap-2'}>
                        <Spinner />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                  {/*<Button variant="ghost" type="button">*/}
                  {/*  Sign up with Google*/}
                  {/*</Button>*/}
                  <FieldDescription className="text-center">
                    <span>Already have an account? </span>
                    <Link
                      href="/login"
                      className={'text-foreground hover:text-foreground/80!'}
                    >
                      Sign in
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

export default SignupPage
