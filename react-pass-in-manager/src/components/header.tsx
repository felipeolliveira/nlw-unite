import nlwUniteIcon from '@/assets/nlw-unite-icon.svg'

import { ModeToggle } from './theme/mode-toggle'

// export type HeaderProps = {}

export function Header() {
  return (
    <div className="flex items-center justify-between gap-5">
      <img alt="NLW Unite" className="size-8" src={nlwUniteIcon} />

      <ModeToggle />
    </div>
  )
}
