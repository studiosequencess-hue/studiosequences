import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LoginForm from '@/components/pages/auth/login-form'

const LoginPage = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Tabs defaultValue="email">
          <TabsList>
            <TabsTrigger
              value="email"
              className={
                'data-[state=active]:bg-foreground data-[state=active]:text-background hover:bg-foreground/10 rounded-md border-none py-2'
              }
            >
              Email
            </TabsTrigger>
            <TabsTrigger
              value="username"
              className={
                'data-[state=active]:bg-foreground data-[state=active]:text-background hover:bg-foreground/10 rounded-md border-none py-2'
              }
            >
              Username
            </TabsTrigger>
          </TabsList>
          <TabsContent value="email">
            <LoginForm type={'email'} />
          </TabsContent>
          <TabsContent value="username">
            <LoginForm type={'username'} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default LoginPage
