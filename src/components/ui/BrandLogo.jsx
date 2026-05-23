import clsx from 'clsx'
import logoDark from '../../assets/pbxcom-logo-dark.png'
import logoLight from '../../assets/pbxcom-logo-light.png'

export function BrandLogo({ className, compact = false }) {
  return (
    <div className={clsx('flex items-center', compact ? 'w-12 justify-center' : 'w-52', className)}>
      <img
        src={logoLight}
        alt="PBxcom"
        className={clsx('block object-contain dark:hidden', compact ? 'h-11 w-11 object-left' : 'h-16 w-full')}
      />
      <img
        src={logoDark}
        alt="PBxcom"
        className={clsx('hidden object-contain dark:block', compact ? 'h-11 w-11 object-left' : 'h-16 w-full')}
      />
    </div>
  )
}
