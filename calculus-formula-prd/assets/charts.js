// assets/charts.js — ECharts chart logic for PRD
(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim() || '#4F6BFF';
  var accent2 = style.getPropertyValue('--accent2').trim() || '#B14BFF';
  var accent3 = style.getPropertyValue('--accent3').trim() || '#00C48C';
  var accent4 = style.getPropertyValue('--accent4').trim() || '#FFB800';
  var accent5 = style.getPropertyValue('--accent5').trim() || '#FF4D6D';
  var ink = style.getPropertyValue('--ink').trim() || '#1a1d29';
  var muted = style.getPropertyValue('--muted').trim() || '#6b7184';
  var rule = style.getPropertyValue('--rule').trim() || '#e4e7ef';

  // Competitor radar chart
  var radarEl = document.getElementById('chart-competitor-radar');
  if (radarEl && typeof echarts !== 'undefined') {
    var chart = echarts.init(radarEl);
    chart.setOption({
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderColor: rule,
        borderWidth: 1,
        textStyle: { color: ink, fontSize: 12 }
      },
      legend: {
        bottom: 5,
        textStyle: { color: muted, fontSize: 12 },
        itemWidth: 14,
        itemHeight: 14,
        itemGap: 20
      },
      radar: {
        indicator: [
          { name: '公式渲染', max: 10 },
          { name: '翻卡记忆', max: 10 },
          { name: '联动记忆', max: 10 },
          { name: '自测练习', max: 10 },
          { name: '搜索能力', max: 10 },
          { name: '离线可用', max: 10 },
          { name: '社交传播', max: 10 }
        ],
        center: ['50%', '48%'],
        radius: '62%',
        axisName: {
          color: ink,
          fontSize: 12,
          fontWeight: 500
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(79,107,255,0.02)', 'rgba(79,107,255,0.04)', 'rgba(79,107,255,0.06)', 'rgba(79,107,255,0.08)']
          }
        },
        splitLine: {
          lineStyle: { color: rule, width: 1 }
        },
        axisLine: {
          lineStyle: { color: rule, width: 1 }
        }
      },
      series: [{
        type: 'radar',
        data: [
          {
            value: [9, 7, 9, 8, 8, 4, 6],
            name: '我们（优化后）',
            areaStyle: { color: 'rgba(79,107,255,0.15)' },
            lineStyle: { color: accent, width: 2 },
            itemStyle: { color: accent },
            symbolSize: 6
          },
          {
            value: [3, 0, 0, 0, 0, 0, 9],
            name: '小红书公式帖',
            areaStyle: { color: 'rgba(255,77,109,0.08)' },
            lineStyle: { color: accent5, width: 2, type: 'dashed' },
            itemStyle: { color: accent5 },
            symbolSize: 5
          },
          {
            value: [5, 9, 0, 7, 3, 3, 3],
            name: '氢刻/Anki',
            areaStyle: { color: 'rgba(255,184,0,0.08)' },
            lineStyle: { color: accent4, width: 2, type: 'dashed' },
            itemStyle: { color: accent4 },
            symbolSize: 5
          },
          {
            value: [8, 0, 0, 5, 6, 0, 4],
            name: 'Mathos AI',
            areaStyle: { color: 'rgba(177,75,255,0.08)' },
            lineStyle: { color: accent2, width: 2, type: 'dashed' },
            itemStyle: { color: accent2 },
            symbolSize: 5
          },
          {
            value: [9, 0, 9, 0, 0, 0, 0],
            name: '我们（当前）',
            areaStyle: { color: 'rgba(0,196,140,0.08)' },
            lineStyle: { color: accent3, width: 2 },
            itemStyle: { color: accent3 },
            symbolSize: 5
          }
        ]
      }]
    });
    window.addEventListener('resize', function() { chart.resize(); });
  }
})();
