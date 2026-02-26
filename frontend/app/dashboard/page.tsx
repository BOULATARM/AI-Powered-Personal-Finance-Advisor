'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { getToken, removeToken } from '@/lib/auth'
import { predict, type PredictionResponse } from '@/lib/api'
import { AlertCircle, BarChart3, LogOut } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PredictionResults } from '@/components/prediction-results'
import { ChatBot } from '@/components/chatbot'

const OCCUPATIONS = ['Professional', 'Retired', 'Self_Employed', 'Student'] as const
const CITY_TIERS = ['Tier_1', 'Tier_2', 'Tier_3'] as const

export default function DashboardPage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [predictions, setPredictions] = useState<PredictionResponse | null>(null)
  const [showChat, setShowChat] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    Income: 50000,
    Age: 30,
    Dependents: 0,
    Disposable_Income: 10000,
    Desired_Savings: 5000,
    Groceries: 300,
    Transport: 200,
    Eating_Out: 150,
    Entertainment: 100,
    Utilities: 150,
    Healthcare: 100,
    Education: 50,
    Miscellaneous: 50,
    Occupation: 'Professional',
    City_Tier: 'Tier_1',
  })

  // Check auth on mount
  useEffect(() => {
    const t = getToken()
    if (!t) {
      router.push('/')
    } else {
      setToken(t)
    }
  }, [router])

  const handleLogout = () => {
    removeToken()
    router.push('/')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value), // numbers only (backend expects numbers)
    }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setError('')
    setLoading(true)

    try {
      // ✅ IMPORTANT: payload first, token second
      const result = await predict(formData as any, token)
      setPredictions(result)
    } catch (err) {
      setPredictions(null)
      setError(err instanceof Error ? err.message : 'Prediction failed')
    } finally {
      setLoading(false)
    }
  }

  if (!token) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-card/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold">
              ₿
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FinSight AI
            </h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 bg-destructive/10 border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <Card className="border border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl sticky top-24">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold">Prediction Form</h2>
                </div>

                <form onSubmit={handlePredict} className="space-y-4">
                  {/* Income */}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Income
                    </label>
                    <Input
                      name="Income"
                      type="number"
                      value={formData.Income}
                      onChange={handleInputChange}
                      className="mt-2 bg-background/50 border-border/50 focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Age</label>
                      <Input
                        name="Age"
                        type="number"
                        value={formData.Age}
                        onChange={handleInputChange}
                        className="mt-2 bg-background/50 border-border/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Dependents</label>
                      <Input
                        name="Dependents"
                        type="number"
                        value={formData.Dependents}
                        onChange={handleInputChange}
                        className="mt-2 bg-background/50 border-border/50"
                      />
                      <p className="text-[10px] text-muted-foreground mt-1">Max 20 (backend validation)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Disposable Income</label>
                      <Input
                        name="Disposable_Income"
                        type="number"
                        value={formData.Disposable_Income}
                        onChange={handleInputChange}
                        className="mt-2 bg-background/50 border-border/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Desired Savings</label>
                      <Input
                        name="Desired_Savings"
                        type="number"
                        value={formData.Desired_Savings}
                        onChange={handleInputChange}
                        className="mt-2 bg-background/50 border-border/50"
                      />
                    </div>
                  </div>

                  {/* Expenses */}
                  <div className="border-t border-border/50 pt-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">Monthly Expenses</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {[
                        ['Groceries', 'Groceries'],
                        ['Transport', 'Transport'],
                        ['Eating_Out', 'Eating Out'],
                        ['Entertainment', 'Entertainment'],
                        ['Utilities', 'Utilities'],
                        ['Healthcare', 'Healthcare'],
                        ['Education', 'Education'],
                        ['Miscellaneous', 'Misc'],
                      ].map(([key, label]) => (
                        <div key={key}>
                          <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
                          <Input
                            name={key}
                            type="number"
                            value={formData[key as keyof typeof formData] as number}
                            onChange={handleInputChange}
                            className="h-8 bg-background/50 border-border/50 text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Selects */}
                  <div className="border-t border-border/50 pt-4 space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">
                        Occupation
                      </label>
                      <Select
                        value={formData.Occupation}
                        onValueChange={(value) => handleSelectChange('Occupation', value)}
                      >
                        <SelectTrigger className="bg-background/50 border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {OCCUPATIONS.map((occ) => (
                            <SelectItem key={occ} value={occ}>
                              {occ.replace('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">City Tier</label>
                      <Select
                        value={formData.City_Tier}
                        onValueChange={(value) => handleSelectChange('City_Tier', value)}
                      >
                        <SelectTrigger className="bg-background/50 border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CITY_TIERS.map((tier) => (
                            <SelectItem key={tier} value={tier}>
                              {tier}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold mt-6"
                  >
                    {loading ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
                        Predicting...
                      </>
                    ) : (
                      'Get Prediction'
                    )}
                  </Button>
                </form>
              </div>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {predictions ? (
              <PredictionResults prediction={predictions} onChatOpen={() => setShowChat(true)} />
            ) : (
              <Card className="border border-border/50 bg-card/30 backdrop-blur-xl h-96 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">Submit the form to see predictions</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Chatbot */}
      {predictions && (
        <ChatBot
          token={token}
          predictions={predictions}
          isOpen={showChat}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  )
}
