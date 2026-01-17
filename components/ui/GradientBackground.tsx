import { LinearGradient } from 'expo-linear-gradient'

export function GradientBackground({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LinearGradient
      colors={['#FFD1DC', '#FFF9EE']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      className='flex-1'
    >
      {children}
    </LinearGradient>
  )
}
