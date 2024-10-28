import {
  createChart,
  ColorType,
  IChartApi,
  Time,
  UTCTimestamp,
} from 'lightweight-charts'
import { useEffect, useRef } from 'react'

const colors = {
  backgroundColor: 'white',
  lineColor: '#2962FF',
  textColor: 'black',
  areaTopColor: '#2962FF',
  areaBottomColor: 'rgba(41, 98, 255, 0.28)',
}

export const SmallChart = ({
  data,
  base,
}: {
  data: { time: UTCTimestamp; value: number }[]
  base: number
}) => {
  const {
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
  } = colors

  const chartContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let chart: IChartApi
    if (chartContainerRef.current) {
      chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: backgroundColor },
          attributionLogo: false,
          textColor,
        },
        timeScale: {
          visible: false,
          lockVisibleTimeRangeOnResize: true,
        },

        rightPriceScale: {
          visible: false,
        },
        crosshair: {
          mode: 2,
        },
        width: 60,
        height: 20,
      })
      chart.timeScale().fitContent()

      const newSeries = chart.addBaselineSeries({
        baseValue: { type: 'price', price: base },
        topLineColor: 'rgba( 38, 166, 154, 1)',
        topFillColor1: 'rgba( 38, 166, 154, 0.28)',
        topFillColor2: 'rgba( 38, 166, 154, 0.05)',
        bottomLineColor: 'rgba( 239, 83, 80, 1)',
        bottomFillColor1: 'rgba( 239, 83, 80, 0.05)',
        bottomFillColor2: 'rgba( 239, 83, 80, 0.28)',
      })
      newSeries.setData(data)
    }

    return () => {
      if (chart) {
        chart.remove()
      }
    }
  }, [
    data,
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
  ])

  return <div ref={chartContainerRef} />
}

export default SmallChart
