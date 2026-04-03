import { useState } from 'react'
import styles from './Collapsible.module.css'

interface CollapsibleProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export function Collapsible({ title, defaultOpen = true, children }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={styles.container} data-testid={`collapsible-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <button
        className={styles.header}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={styles.title}>{title}</span>
        <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>▾</span>
      </button>
      {isOpen && <div className={styles.content}>{children}</div>}
    </div>
  )
}
