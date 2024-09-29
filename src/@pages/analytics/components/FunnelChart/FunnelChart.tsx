import flatMap from "array.prototype.flatmap";
// import * as d3 from "d3";
import * as d3 from 'd3'
import { useEffect, useRef } from "react";
import data from "./data";
import "./FunnelChart.scss";

const FunnelChart = () => {
  const d3ref = useRef();
  const dataRef = useRef(flatMap(data, (e) => e));
  useEffect(() => {
    const width = 400;
    const height = 100;
    const margin = 10;

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(dataRef.current, (d:any) => new Date(d.date)))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d) => d3.max(d.map((el) => el.contributionCount))),
      ])
      .range([height, 0]);

    const line = d3
      .line()
      .x((d:any) => xScale(d.x))
      .y((d:any) => yScale(d.y));
    // .curve(d3.curveMonotoneX);

    const dataset = dataRef.current.map((d) => ({
      x: new Date(d.date),
      y: d.contributionCount,
    }));

    const svg = d3
      .select(d3ref.current)
      .append("svg")
      .attr("width", width + margin * 2)
      .attr("height", height + margin * 2)
      .append("g")
      .attr("transform", `translate(${margin}, ${margin})`);
    svg.append("path").datum(dataset).attr("class", "line").attr("d", line);
  }, []);
  return (
    <div>
      <div ref={d3ref} />
    </div>
  );
};

export default FunnelChart;
