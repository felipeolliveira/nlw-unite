import { Ticket } from 'lucide-react'

export type EventLogoProps = {
  imageUrl: string | null
  title: string
}

export function EventLogo({ imageUrl, title }: EventLogoProps) {
  if (!imageUrl) {
    return (
      <div className="grid size-10 place-items-center rounded-lg bg-orange-500/10 p-1.5">
        <Ticket className="size-6 text-orange-500" />
      </div>
    )
  }

  return (
    <div className="size-10 rounded-lg bg-orange-500/10 p-1.5">
      <img
        alt={`logo do evento ${title}`}
        className="rounded-full"
        src={`http://localhost:8080/${imageUrl}`}
      />
    </div>
  )
}
