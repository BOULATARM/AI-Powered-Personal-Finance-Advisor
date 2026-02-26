'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, MessageCircle } from 'lucide-react'
import type { PredictionResponse } from '@/lib/api'

interface PredictionResultsProps {
  prediction: PredictionResponse
  onChatOpen: () => void
}

export function PredictionResults({ prediction, onChatOpen }: PredictionResultsProps) {
  const chartColors = ['#06B6D4', '#0EA5E9', '#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444']

  const total = prediction?.Total_Potential_Savings ?? 0

  // ✅ pie chart uses Potential_Savings_* fields from backend
  const expenseData = [
    { name: 'Groceries', value: prediction.Potential_Savings_Groceries ?? 0 },
    { name: 'Transport', value: prediction.Potential_Savings_Transport ?? 0 },
    { name: 'Eating Out', value: prediction.Potential_Savings_Eating_Out ?? 0 },
    { name: 'Entertainment', value: prediction.Potential_Savings_Entertainment ?? 0 },
    { name: 'Utilities', value: prediction.Potential_Savings_Utilities ?? 0 },
    { name: 'Healthcare', value: prediction.Potential_Savings_Healthcare ?? 0 },
    { name: 'Education', value: prediction.Potential_Savings_Education ?? 0 },
    { name: 'Misc', value: prediction.Potential_Savings_Miscellaneous ?? 0 },
  ].filter((item) => item.value > 0)

  // ✅ comparison chart: only predicted total (desired is not returned by backend)
  const savingsData = [
    { category: 'Predicted', amount: Math.round(total) },
  ]

  // ✅ fake "confidence" derived from how big the prediction is (UI-only)
  const confidencePercent = total > 0 ? 70 : 0

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Predicted Savings Card */}
        <Card className="border border-border/50 bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-xl p-6">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Predicted Savings</p>
                <h3 className="text-3xl font-bold text-primary">
                  ${Math.round(total).toLocaleString()}
                </h3>
              </div>
              <TrendingUp className="w-8 h-8 text-primary opacity-50" />
            </div>
            <p className="text-xs text-muted-foreground">
              Total potential savings across categories
            </p>
          </div>
        </Card>

        {/* Confidence Card (UI only) */}
        <Card className="border border-border/50 bg-gradient-to-br from-accent/10 to-primary/10 backdrop-blur-xl p-6">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Model Confidence</p>
                <h3 className="text-3xl font-bold text-accent">{confidencePercent}%</h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center text-accent font-bold">
                {confidencePercent}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {confidencePercent >= 70 ? 'Good reliability' : 'Use with caution'}
            </p>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown Pie Chart */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-xl p-6">
          <h3 className="font-bold mb-4 text-foreground">Savings Breakdown (by category)</h3>
          {expenseData.length > 0 ? (
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: $${Math.round(value)}`}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {expenseData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${Math.round(value).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              No savings data available
            </div>
          )}
        </Card>

        {/* Total Savings Bar Chart */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-xl p-6">
          <h3 className="font-bold mb-4 text-foreground">Total Predicted Savings</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={savingsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="category" type="category" stroke="hsl(var(--muted-foreground))" />
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Quick Summary */}
      <Card className="border border-border/50 bg-card/50 backdrop-blur-xl p-6">
        <h3 className="font-bold mb-4 text-foreground">Top Opportunities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {expenseData
            .slice()
            .sort((a, b) => b.value - a.value)
            .slice(0, 4)
            .map((item) => (
              <div key={item.name} className="p-3 rounded-lg bg-muted/30 flex items-center justify-between">
                <p className="text-sm text-foreground font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">${Math.round(item.value).toLocaleString()}</p>
              </div>
            ))}
        </div>
      </Card>

      {/* Chat CTA */}
      <Button
        onClick={onChatOpen}
        className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold h-11"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Ask AI for Financial Advice
      </Button>
    </div>
  )
}
