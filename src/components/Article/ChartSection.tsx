import * as d3 from 'd3'
import React, {useState, useEffect, RefObject } from 'react'
import {PointType, KeyPointType} from './Article';
import {DSVRowArray} from 'd3-dsv';
import './ChartSection.css';

interface ChartSectionProps {
  time: string;
  timeWindow: number;
  points: PointType[];
  data: DSVRowArray; 
  allPoints: KeyPointType[];
}

const ChartSection = (props: ChartSectionProps) => {
  const ref: RefObject<HTMLDivElement> = React.createRef()
  const date: Date = new Date(props.time)
  const winDays: number = props.timeWindow * 1000 * 60 * 60 * 24;

  useEffect(() => draw())
  const draw = () => {
    const width: number = 500;
    const height: number = 250;
    const loff: number = 75;
    const boff: number = 50;
    const toff: number = 10;
    const textOff: number = 40;

    const data = props.data.filter((d) => {
      // @ts-ignore TS2769
      const candDate: number = new Date(d.Date).getTime();
      return candDate >= (date.getTime() - winDays) && candDate <= (date.getTime() + winDays);
    })

    const svg = d3.select(ref.current)
      .append('svg')
      .attr('width', width + loff)
      .attr('height', height + boff + toff);
    
    const xScale = d3.scaleTime()
      // @ts-ignore TS2352
      .domain(d3.extent(data, (d) => d.Date) as [Date, Date]) 
      .range([loff, width + loff])

    const yScale = d3.scaleLinear()
      // @ts-ignore TS2352
      .domain(d3.extent(data, (d) => parseInt(d.Cases)/1000) as [number, number])
      .range([height + toff, toff])

    svg.append('g')
       .attr('transform', `translate(0, ${height + toff})`)
       .attr('class', "chartAxis")
       .call(d3.axisBottom(xScale))

    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width/2 + loff)
      .attr("y", height + toff + textOff)
      .text("Time");

    svg.append('g')
      .attr('transform', `translate(${loff}, ${toff})`)
      .attr('class', "chartAxis")
      .call(d3.axisLeft(yScale))

    svg.append("text")
      .attr('transform', `translate(${loff - textOff}, ${height/2 - textOff + toff}) rotate(270)`)
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .text("Cases (in thousands)");

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', "white")
      .attr('stroke-width', 1.5)
      // @ts-ignore TS2345
      .attr('d', d3.line()
        .x((d) => xScale(((d as unknown) as { Date: number }).Date))
        .y((d) => yScale(((d as unknown) as { Cases: number }).Cases/1000)))

    props.allPoints
      .filter((point) => {
        const candDate: number = new Date(point.time).getTime();
        return candDate >= (date.getTime() - winDays) && candDate <= (date.getTime() + winDays);
      })
      .forEach((point) =>
        point.points.forEach((p) => 
          svg.append('circle')
            .attr('cx', xScale(new Date(point.time)))
            .attr('cy', yScale(p.point_value / 1000))
            .attr('r', 3)
            .attr('fill', 'yellow')
        )
    )
      
    props.points.forEach((point) =>
      svg.append('circle')
        .attr('cx', xScale(date))
        .attr('cy', yScale(point.point_value / 1000))
        .attr('r', 5)
        .attr('fill', 'red')
    )
  }

  return (
   <div ref={ref}>
   </div>
  )
}

export default ChartSection
