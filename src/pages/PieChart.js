import * as d3 from 'd3';
import React, { useEffect } from 'react';

export const PieChart = ({ data, index, size }) => {
  const colorScale = d3
    .scaleOrdinal()
    .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56']);

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
  const preparedData = topFiveData;
  useEffect(() => {
    // set the dimensions and margins of the graph
    const width = size,
      height = size,
      margin = 30;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin;

    // Select svg
    let svg = d3.select(`#chart${index}`).select('svg');

    // If it doesn't exist, create it
    if (svg.empty()) {
      svg = d3
        .select(`#chart${index}`)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    }

    // Create or select g
    let g = svg.select(`#chart${index}`).select('g');
    if (g.empty()) {
      g = svg
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);
    }

    // set the color scale
    const donors = data.map((d) => d['捐贈者／支出對象']);
    colorScale.domain(donors);

    // Compute the position of each group on the pie:
    const pie = d3.pie().value(function (d) {
      return d.amount;
    });
    const data_ready = pie(preparedData);
    const tooltip = d3.select('#chartTooltip');

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    g.selectAll('path')
      .data(data_ready)
      .join('path')
      .attr('d', d3.arc().innerRadius(0).outerRadius(radius))
      .attr('fill', function (d) {
        return colorScale(d.data.donor);
      })
      .attr('stroke', 'black')
      .style('stroke-width', '2px')

      .on('mouseover', (event, d) => {
        tooltip.text(`${d.data.donor}: ${d.data.amount}`);
        tooltip.style('top', event.pageY - 10 + 'px');
        tooltip.style('left', event.pageX + 10 + 'px');
        tooltip.style('visibility', 'visible');
      })
      .on('mouseleave', () => {
        tooltip.style('visibility', 'hidden');
        // 移除文字
      });
  }, [colorScale, data, index, preparedData, size]);

  console.log(preparedData);
  return (
    <div>
      <div id={`chart${index}`} />
      <div
        id="chartTooltip"
        style={{ position: 'absolute', visibility: 'hidden' }}
      />
      <div id="legend">
        <div />
        <ul>
          {preparedData.map((d) => (
            <li key={d.key}>
              <div
                style={{
                  backgroundColor: colorScale(d.donor),
                  width: '10px',
                  height: '10px',
                  display: 'inline-block',
                  marginRight: '5px',
                }}
              />
              {d.donor}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
