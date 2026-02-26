import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type SpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: number
}

export function Spinner({ className, size = 18, ...props }: SpinnerProps) {
  return (
    <div className={cn("inline-flex items-center justify-center", className)} {...props}>
      <Loader2 className="animate-spin" width={size} height={size} />
    </div>
  )
}
