'use client'

import React from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Collection } from '@/lib/models'
import * as z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/constants'
import { createCollection } from '@/lib/actions.collections'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'

const formSchema = z.object({
  name: z.string().min(1, 'Too short.').max(255, 'Too long.'),
})

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  collection?: Collection
  onSuccess?: (collection: Collection) => void
}

const CollectionFormDialog: React.FC<Props> = (props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.collection?.name || '',
    },
  })

  const createCollectionMutation = useMutation({
    mutationKey: [QUERY_KEYS.PERSONAL_COLLECTION_CREATE],
    mutationFn: (data: z.infer<typeof formSchema>) => {
      return createCollection({
        name: data.name,
      })
    },
    onSuccess: (response) => {
      if (response.status == 'success') {
        form.reset()
        props.setOpen(false)
        props.onSuccess?.(response.data)
        toast.success(response.message)
      } else {
        toast.error(response.message)
      }
    },
  })

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    createCollectionMutation.mutate(data)
  }

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent className={'w-96'}>
        <DialogHeader>
          <DialogTitle>
            {props.collection ? 'Edit collection' : 'Create collection'}
          </DialogTitle>
          <DialogDescription className={'hidden'} />
        </DialogHeader>

        <form id="collection-form">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="collection-form-title">Name</FieldLabel>
                  <Input
                    {...field}
                    id="collection-form-title"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button
            size={'sm'}
            variant={'secondary'}
            className={'w-18'}
            disabled={createCollectionMutation.isPending}
            onClick={form.handleSubmit(handleSubmit)}
          >
            {props.collection ? (
              createCollectionMutation.isPending ? (
                <Spinner />
              ) : (
                'Update'
              )
            ) : createCollectionMutation.isPending ? (
              <Spinner />
            ) : (
              'Create'
            )}
          </Button>
          <DialogClose asChild>
            <Button size={'sm'} variant={'outline'}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CollectionFormDialog
