import { useId, useMemo } from 'react'

interface SparklineProps {
  data: number[]
  width: number
  height: number
  color: string
  fillOpacity?: number
}

export function Sparkline({ data, width, height, color, fillOpacity = 0.15 }: SparklineProps) {
  const gradId = useId()
  const path = useMemo(() => {
    if (data.length < 2) return { line: '', fill: '' }

    const max = Math.max(...data, 1)
    const step = width / (data.length - 1)

    const points = data.map((v, i) => ({
      x: i * step,
      y: height - (v / max) * (height - 2) - 1,
    }))

    // Smooth curve using cardinal spline
    let line = `M ${points[0].x} ${points[0].y}`
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(i - 1, 0)]
      const p1 = points[i]
      const p2 = points[i + 1]
      const p3 = points[Math.min(i + 2, points.length - 1)]

      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6

      line += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
    }

    const fill = `${line} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`

    return { line, fill }
  }, [data, width, height])

  if (data.length < 2) {
    return <svg width={width} height={height} />
  }

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${gradId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={fillOpacity} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path
        d={path.fill}
        fill={`url(#grad-${gradId})`}
      />
      <path
        d={path.line}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
