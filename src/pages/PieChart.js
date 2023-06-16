import * as d3 from 'd3';
import React, { useEffect } from 'react';
import styled from 'styled-components';

export const PieChart = ({ data, index, size }) => {
  const colorScale = d3
    .scaleOrdinal()
    .range(['#05BBD2', '#2070C4', '#EB80F1', '#F5C842', '#37D400']);
  let sortedData = [...data].sort(
    (a, b) => Number(b['收入金額']) - Number(a['收入金額'])
  );
  const topFiveData = sortedData.slice(0, 9).map((d) => ({
    donor: d['捐贈者／支出對象'],
    amount: Number(d['收入金額']),
    key: d['候選人'] + d['序號'],
  }));

  const otherAmount = sortedData
    .slice(5)
    .reduce((total, d) => total + Number(d['收入金額']), 0);
  if (otherAmount > 0) {
    topFiveData.push({ donor: '其他', amount: otherAmount, key: 'other' });
  }

  const newData = topFiveData;
  useEffect(() => {
    // 設定圖形的大小
    const width = size,
      height = size,
      margin = 20;

    // 計算半徑
    const radius = Math.min(width, height) / 2 - margin;

    // 選取 SVG 若無則創建一個新的
    let svg = d3.select(`#chart${index}`).select('svg');

    if (svg.empty()) {
      svg = d3
        .select(`#chart${index}`)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    }

    // 選取中心點若無則創建一個新的
    let g = svg.select(`#chart${index}`).select('g');
    if (g.empty()) {
      g = svg
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);
    }
    // 在中心加上文字
    g.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .text('捐贈者 / 收入金額')
      .style('font-size', '14px')
      .style('fill', '#000')
      .style('text-anchor', 'middle')
      .style('dominant-baseline', 'middle')
      .raise();

    // 設置顏色比例尺的領域（domain）
    const donors = newData.map((d) => d.donor);
    colorScale.domain(donors);

    // 計算每个扇形的位置和大小
    const pie = d3.pie().value(function (d) {
      return d.amount;
    });
    const data_ready = pie(newData);
    const tooltip = d3.select('#chartTooltip');

    // 建構圓餅圖
    g.selectAll('path')
      .data(data_ready)
      .join('path')
      .attr('d', d3.arc().innerRadius(75).outerRadius(radius))
      .attr('fill', (d) => colorScale(d.data.donor))
      .attr('stroke', '#fff')
      .style('stroke-width', '1px')

      .on('mouseover', (event, d) => {
        tooltip.text(`${d.data.donor} / ${d.data.amount}`);
        tooltip.style('top', event.pageY - 10 + 'px');
        tooltip.style('left', event.pageX + 10 + 'px');
        tooltip.style('visibility', 'visible');
      })
      .on('mouseleave', () => {
        tooltip.style('visibility', 'hidden');
      });
  }, [colorScale, data, index, newData, size]);

  return (
    <div>
      <Chart id={`chart${index}`} />
      <TooltipStyled id="chartTooltip" visible={false} />
      <br />
      <div id="legend">
        <div />
        <Legend>
          {newData.map((d) => (
            <LegendItem key={d.key}>
              <LegendColor color={colorScale(d.donor)} />
              {d.donor}
            </LegendItem>
          ))}
        </Legend>
      </div>
    </div>
  );
};
const Legend = styled.ul`
`;
const LegendItem = styled.li`
  font-size:14px;
  color:#5b5b5b;  
  line-height:1.4rem;
`;

const LegendColor = styled.div`
  background-color: ${({ color }) => color};
  width: 10px;
  height: 10px;
  display: inline-block;
  margin-right: 5px;
`;

const TooltipStyled = styled.div`
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 5px;
  font-size: 14px;
  color: #5b5b5b;
  border-radius:10px;
  visibility:hidden;
`;

const Chart = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  min-width:300px;
  min-height:300px
`;
