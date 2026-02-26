'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { sendChatMessage, type PredictionResponse } from '@/lib/api'
import { X, Send, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface ChatBotProps {
  token: string
  predictions: PredictionResponse
  isOpen: boolean
  onClose: () => void
  // ✅ add this
  onOpen?: () => void
}

export function ChatBot({ token, predictions, isOpen, onClose, onOpen }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userText = input.trim()

    const userMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setError('')
    setLoading(true)

    try {
      // ✅ correct order: (message, token, context)
      const response = await sendChatMessage(userText, token, predictions)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.reply || 'No response',
        sender: 'bot',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  // ✅ closed state: show floating open button
  if (!isOpen) {
    return (
      <button
        onClick={() => onOpen?.()}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center text-white z-50 group"
        title="Open chat"
      >
        <svg
          className="w-6 h-6 group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-96 bg-card/50 backdrop-blur-xl border border-border/50 rounded-lg shadow-2xl flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-4 text-white flex items-center justify-between flex-shrink-0">
        <h3 className="font-bold">FinSight AI Assistant</h3>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-1 rounded-md transition-colors"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/30">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-center">
            <div className="text-muted-foreground">
              <p className="font-medium mb-2">Hello! 👋</p>
              <p className="text-sm">Ask me anything about your financial predictions.</p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                message.sender === 'user'
                  ? 'bg-primary text-white rounded-br-none'
                  : 'bg-muted text-foreground rounded-bl-none'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted px-3 py-2 rounded-lg">
              <Spinner className="w-4 h-4" />
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/50 text-sm">
            <AlertCircle className="h-3 w-3" />
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t border-border/50 p-4 flex-shrink-0 bg-card/50">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            disabled={loading}
            className="bg-background/50 border-border/50 focus:border-primary focus:ring-primary text-sm h-9"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white px-3 h-9"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
