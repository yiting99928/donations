import * as d3 from 'd3';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { tool } from '../utils/tool';

// 工具function

// 計算半徑
const calculateRadius = (width, height, margin) =>
  Math.min(width, height) / 2 - margin;

// 顏色
const createColorScale = () =>
  d3
    .scaleOrdinal()
    .range(['#05BBD2', '#2070C4', '#EB80F1', '#F5C842', '#37D400']);

// 依資金排序
const sortData = (data) =>
  [...data].sort((a, b) => b['收入金額'] - a['收入金額']);

// 調整資料結構
const prepareData = (sortedData) => {
  const newData = sortedData.slice(0, 9).map((d) => ({
    donor: d['捐贈者／支出對象'],
    amount: d['收入金額'],
    key: d['候選人'] + d['序號'],
  }));

  if (sortedData.length > 9) {
    const remainingData = sortedData.slice(9);
    const otherAmount = remainingData.reduce(
      (total, d) => total + d['收入金額'],
      0
    );

    if (otherAmount > 0) {
      newData.push({ donor: '其他', amount: otherAmount, key: 'other' });
    }
  }

  return newData;
};

const getOrCreateSvg = (id, width, height) => {
  let svg = d3.select(`#${id}`).select('svg');

  if (svg.empty()) {
    svg = d3
      .select(`#${id}`)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
  }

  return svg;
};

const getOrCreateGroup = (svg, width, height) => {
  let g = svg.select('g');

  if (g.empty()) {
    g = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
  }

  return g;
};

const createPieChart = (g, colorScale, data, radius) => {
  g.selectAll('path').remove(); // 移除所有現有的路徑
  g.selectAll('text').remove(); // 移除所有現有的文字

  const pie = d3.pie().value((d) => d.amount);
  const data_ready = pie(data);

  const tooltip = d3.select('#chartTooltip');
  const totalAmount = tool.calculateTotalAmount(data);

  // 增加圖表 title
  g.append('text')
    .attr('x', 0)
    .attr('y', 0)
    .text('捐贈者 / 收入金額')
    .style('font-size', '14px')
    .style('fill', '#000')
    .style('text-anchor', 'middle')
    .style('dominant-baseline', 'middle')
    .raise();

  g.selectAll('path')
    .data(data_ready)
    .join('path')
    .attr('d', d3.arc().innerRadius(70).outerRadius(radius))
    .attr('fill', (d) => colorScale(d.data.donor))
    .attr('stroke', '#fff')
    .style('stroke-width', '1px')
    .on('mouseover', (event, d) => {
      tooltip.text(`${d.data.donor} / ${tool.formatMoney(d.data.amount)}元`);
      tooltip.style('top', event.pageY - 10 + 'px');
      tooltip.style('left', event.pageX + 10 + 'px');
      tooltip.style('visibility', 'visible');
    })
    .on('mouseleave', () => {
      tooltip.style('visibility', 'hidden');
    })
    .each(function (d) {
      // 計算百分比
      let percentage = ((d.data.amount / totalAmount) * 100).toFixed(2) + '%';

      // 為扇區中心點添加文字
      const centroid = d3.arc().innerRadius(70).outerRadius(radius).centroid(d);
      g.append('text')
        .attr('x', centroid[0])
        .attr('y', centroid[1])
        .text(percentage)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .style('font-size', '13px');
    });
};

export const PieChart = ({ data, index }) => {
  const sortedData = sortData(data);
  const newData = prepareData(sortedData);
  const colorScale = createColorScale();
  const radius = calculateRadius(300, 300, 20);

  useEffect(() => {
    const svg = getOrCreateSvg(`chart${index}`, 300, 300);
    const g = getOrCreateGroup(svg, 300, 300);
    createPieChart(g, colorScale, newData, radius);
  }, [colorScale, data, index, newData, radius]);

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
              {d.donor} <span>{tool.formatMoney(d.amount)}元</span>
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
  display:flex;
  align-items:center;
  font-size:14px;
  color:#5b5b5b;  
  line-height:1.4rem;
  span{
    margin-left:auto;
  }
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
