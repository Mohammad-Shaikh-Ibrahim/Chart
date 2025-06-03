import { useEffect, useRef } from 'react';
import {
  lightningChart,
  Themes,
  emptyLine,
  SolidFill,
  ColorHEX,
  AxisTickStrategies,
  AxisScrollStrategies,
} from '@arction/lcjs';

const SweepingEcgChart = () => {
  const chartContainerRef = useRef(null);
  const chartId = useRef(`chart-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const lc = lightningChart({
      license:
        '0002-n0i9AP8MN/ezP+gV3RZRzNiQvQvBKwBJvTnrFTHppybuCwWuickxBJV+q3qyoeEBGSE4hS0aeo3pySDywrb/iIsl-MEUCIAiJOU3BrUq71LqSlRAIFAI0dKK05qBRIJYHFmBoOoIHAiEA4Y55O1QpeuEkiuVktPGLauOHc1TzxNu85/vz/eNscz8=',
      licenseInformation: {
        appTitle: 'LightningChart JS Trial',
        company: 'LightningChart Ltd.',
      },
    });

    const chart = lc
      .ChartXY({ container, theme: Themes.turquoiseHexagon })
      .setTitle('Sweeping ECG');

    const axisTimeOrigin = Date.now();

    const xAxis = chart.getDefaultAxisX()
      .setScrollStrategy(AxisScrollStrategies.progressive)
      .setTickStrategy(AxisTickStrategies.Time, (strategy) =>
        strategy.setTimeOrigin(axisTimeOrigin)
      );

    chart.getDefaultAxisY()
      .setInterval(-200, 200)
      .setTickStrategy(AxisTickStrategies.Numeric);

    const lineSeries = chart.addLineSeries({
      dataPattern: { pattern: 'ProgressiveX' },
      strokeStyle: emptyLine,
      fillStyle: new SolidFill({ color: ColorHEX('#75FF32') }),
    });

    const dataPointCount = 2000;
    const updateIntervalMs = 30;
    const displayWindowDurationMs = dataPointCount * updateIntervalMs;

    const ecgData = new Array(dataPointCount).fill(0);
    let currentIndex = 0;

    xAxis.setInterval(0, displayWindowDurationMs);

    const generateEcgSample = (tSec) => {
      return (
        100 * Math.sin(2 * Math.PI * tSec * 1.5) +
        30 * Math.sin(2 * Math.PI * tSec * 12) +
        (tSec % 1 < 0.02 ? 150 : 0)
      );
    };

    const sweepInterval = setInterval(() => {
      const currentSampleTimeMs = currentIndex * updateIntervalMs;
      const sample = generateEcgSample(currentSampleTimeMs / 1000);

      ecgData[currentIndex % dataPointCount] = sample;

      const points = [];
      for (let i = 0; i < dataPointCount; i++) {
        const dataBufferIndex = (currentIndex + i + 1) % dataPointCount;
        const pointXTimeMs = i * updateIntervalMs;
        points.push({ x: pointXTimeMs, y: ecgData[dataBufferIndex] });
      }

      lineSeries.clear().add(points);
      currentIndex++;
    }, updateIntervalMs);

    return () => {
      clearInterval(sweepInterval);
      chart.dispose();
      lc.dispose();
    };
  }, []);

  return <div ref={chartContainerRef} id={chartId.current} style={{ width: '100%', height: '600px' }} />;
};

export default SweepingEcgChart;