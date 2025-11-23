import { useState, useContext, createContext } from 'react'

const MarkdownContext = createContext()

export function useMarkdown() {
  return useContext(MarkdownContext)
}

export function MarkdownProvider({ children }) {
  const [markdown, setMarkdown] = useState('')
  const value = { markdown, setMarkdown }
  return (
    <MarkdownContext.Provider value={value}>
      {children}
    </MarkdownContext.Provider>
  )
}
