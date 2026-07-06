import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export function FloatingBottle({ src, alt, className = '', delayed = false, priority = false }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), {
    stiffness: 120,
    damping: 16,
  })
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), {
    stiffness: 120,
    damping: 16,
  })
  const translateX = useSpring(useTransform(mx, [-0.5, 0.5], [-16, 16]), {
    stiffness: 100,
    damping: 20,
  })

  function handleMouseMove(e) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    mx.set(0)
    my.set(0)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ position: 'relative', perspective: '900px' }}
    >
      <motion.div
        style={{ rotateX, rotateY, x: translateX, transformStyle: 'preserve-3d' }}
        className={delayed ? 'animate-float-soft-delayed' : 'animate-float-soft'}
      >
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '1rem', boxShadow: '0 30px 60px -20px rgba(120,90,50,0.4)' }}>
          <img
            src={src || '/placeholder.svg'}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            style={{ height: 'auto', width: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div
            aria-hidden="true"
            style={{ pointerEvents: 'none', position: 'absolute', inset: 0, background: 'linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.28) 48%, transparent 62%)' }}
          />
        </div>
      </motion.div>
    </div>
  )
}
