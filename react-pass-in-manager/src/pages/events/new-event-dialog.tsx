import { zodResolver } from '@hookform/resolvers/zod'
import { ImageIcon } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const MAX_FILE_SIZE = 1024 * 500 // 500kb
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg']
const ACCEPTED_FILE_EXTENSIONS = ACCEPTED_FILE_TYPES.map(
  (type) => `.${type.split('/')[1]}`,
)

const newEventSchema = z.object({
  name: z
    .string({
      required_error: 'Nome é obrigatório',
    })
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),
  details: z
    .string({
      required_error: 'Detalhes são obrigatórios',
    })
    .min(3, 'Detalhes devem ter no mínimo 3 caracteres'),
  image: z
    .custom<File>()
    .refine(
      (file: File) => file.size < MAX_FILE_SIZE,
      'Tamanho máximo de 500kb',
    )
    .refine(
      (file: File) => ACCEPTED_FILE_TYPES.includes(file.type),
      `Apenas arquivos ${ACCEPTED_FILE_EXTENSIONS.join(', ')}`,
    )
    .optional(),
})

type NewEventFormData = z.output<typeof newEventSchema>

export type NewEventDialogProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export function NewEventDialog({ isOpen, onOpenChange }: NewEventDialogProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewEventFormData>({
    resolver: zodResolver(newEventSchema),
  })

  function handleCreateEvent(data: NewEventFormData) {
    console.log(data)
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent
        className="max-w-3xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Novo evento</DialogTitle>
          <form
            className="flex gap-6 pt-6"
            onSubmit={handleSubmit(handleCreateEvent)}
          >
            <div className="flex flex-col gap-2">
              <Label className="flex items-center justify-between">
                Imagem <span className="text-muted-foreground">opcional</span>
              </Label>
              <Controller
                control={control}
                name="image"
                render={({
                  field: { value, name, onBlur, onChange, ref, disabled },
                }) => (
                  <>
                    <Input
                      accept={ACCEPTED_FILE_TYPES.join(', ')}
                      disabled={disabled}
                      name={name}
                      onBlur={onBlur}
                      onChange={(e) => {
                        if (e.target.files) onChange(e.target.files[0])
                      }}
                      ref={ref}
                      type="file"
                    />
                    <div className="flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-zinc-800 p-10">
                      {!value && (
                        <ImageIcon className="size-10 text-zinc-500" />
                      )}

                      {value && (
                        <img
                          alt="preview"
                          className="w-32 shrink rounded-xl"
                          src={URL.createObjectURL(value)}
                        />
                      )}
                    </div>
                  </>
                )}
              />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex flex-col gap-2">
                <Label>Nome</Label>
                <Input
                  className={cn([errors.name && 'border-red-500'])}
                  placeholder="Java Summit 2024"
                  {...register('name')}
                />
                {errors.name?.message && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label>Detalhes</Label>
                <Textarea
                  className={cn([
                    'resize-none',
                    errors.name && 'border-red-500',
                  ])}
                  placeholder="Descreva os detalhes do evento"
                  rows={8}
                  {...register('details')}
                />
                {errors.details?.message && (
                  <p className="text-sm text-red-500">
                    {errors.details.message}
                  </p>
                )}
              </div>
              <DialogFooter className="flex gap-2 pt-4">
                <DialogClose asChild>
                  <Button className="w-full" type="button" variant="ghost">
                    Cancel
                  </Button>
                </DialogClose>
                <Button className="w-full" type="submit">
                  Criar
                </Button>
              </DialogFooter>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
