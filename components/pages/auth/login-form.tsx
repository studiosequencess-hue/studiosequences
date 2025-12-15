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
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useAuthStore } from '@/store'
import {
  signInWithEmailPassword,
  signInWithUsernamePassword,
} from '@/lib/actions.auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { HiOutlineAtSymbol } from 'react-icons/hi2'

const authTypeSchema = z.object({
  authType: z.enum(['email', 'username']),
})

const passwordFormSchema = {
  password: z.string().min(6).max(50),
}

const emailFormSchema = authTypeSchema
  .extend({
    authType: z.literal('email'),
    email: z.email(),
  })
  .extend(passwordFormSchema)

const usernameFormSchema = authTypeSchema
  .extend({
    authType: z.literal('username'),
    username: z
      .string()
      .min(1, {
        error: 'Too short',
      })
      .max(255, {
        error: 'Too long',
      }),
  })
  .extend(passwordFormSchema)

const formSchema = z.discriminatedUnion('authType', [
  emailFormSchema,
  usernameFormSchema,
])

type Props = {
  type: 'email' | 'username'
}

const LoginForm: React.FC<Props> = (props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      authType: props.type,
      email: '',
      password: '',
    },
    mode: 'onChange',
  })

  const { setLoading, loading, setUser } = useAuthStore()
  const router = useRouter()

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)

    const response =
      values.authType == 'email'
        ? await signInWithEmailPassword(values)
        : await signInWithUsernamePassword(values)

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
    <Card>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          <span>Enter your </span>
          <span className={'underline underline-offset-4'}>{props.type}</span>
          <span> to login to your account</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            {props.type == 'email' ? (
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
            ) : (
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
            )}
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
  )
}

export default LoginForm
