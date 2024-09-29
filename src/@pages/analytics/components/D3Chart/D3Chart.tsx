import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import "./D3Chart.scss";

interface ID3Chart {
  initialData: any[];
  defaultColor?: string;
  gradientColor?: { startColor: string; endColor: string };
  chartFor?: string;
}

// inspired by https://sharkcoder.com/data-visualization/d3-line-chart

const D3Chart = ({
  initialData,
  defaultColor = "#EB2F96",
  gradientColor = { startColor: "green", endColor: "yellow" },
  chartFor = "today",
}: ID3Chart) => {
  // margin for svg chart
  const margin = { top: 49, right: 26, bottom: 30, left: 35 },
    width = 380 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  // gradient color
  const { startColor, endColor } = gradientColor;

  // random id name generator string
  const [svgGradient] = useState(
    "svgGrad" + (Math.random() + 1).toString(36).substring(7)
  );

  const svgNRef = useRef(null);

  useEffect(() => {
    chartFC();
  }, [initialData]);

  const chartFC = () => {
    const parseDate = d3.timeParse("%m/%d/%Y"),
      formatDate = d3.timeFormat("%d %b"),
      formatMonth = d3.timeFormat("%d %b");

    // range for x and y
    const x: any = d3.scaleTime().range([0, width]);
    const y: any = d3.scaleLinear().range([height, 0]);

    const formateTick = () => {
      if (chartFor === "today" || chartFor === "yesterday") {
        return "%H %p";
      }
      return "%d %b";
    };

    // domain for x and y

    if (chartFor === "week" || chartFor === "month") {
      x.domain(
        d3.extent(initialData, (d: any) => {
          return new Date(d.date);
        })
      );
    } else if (chartFor === "today" || chartFor === "yesterday") {
      x.domain([Date.now(), Date.now() + 21 * 60 * 60 * 1000]).nice();
    }

    y.domain(d3.extent(initialData, (d: any) => d.value));

    // area
    const area: any = d3
      .area()
      .x((d: any) => {
        return x(d.date);
      })
      .y0(height)
      .y1((d: any) => {
        return y(d.value);
      })
      .curve(d3.curveMonotoneX);

    // line
    const line: any = d3
      .line()
      .x((d: any) => {
        return x(d.date);
      })
      .y((d: any) => {
        return y(d.value);
      })
      .curve(d3.curveMonotoneX);

    // to remove previous chart
    (() => {
      const div = d3.select(svgNRef.current);
      const preSvg = div.select("svg");
      preSvg ? preSvg.remove() : null;
    })();
    // end

    // appending svg into the div
    const svg: any = d3
      .select(svgNRef.current)
      .append("svg")
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      )
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // appending rect for the box
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("stroke", "#BBBCBF")
      .style("stroke-dasharray", "4,3");

    // x axis
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")");
    // .call(d3.axisBottom(x).tickFormat(formatMonth));

    // y axis
    svg.append("g").attr("class", "y axis");
    // .call(d3.axisLeft(y))

    // x axis ticks
    svg
      .select(".x.axis")
      .transition()
      .duration(750)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickSize(-height)
          // .tickFormat(d3.timeFormat("%d %b"))
          .tickFormat(d3.timeFormat(formateTick()))
      );

    // y axis ticks
    svg
      .select(".y.axis")
      .transition()
      .duration(750)
      .call(
        d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(d3.format("~s"))
      );

    // adding margin top to x axis text
    svg
      .selectAll(".x.axis")
      .selectAll(".tick text") // selects the text within all groups of ticks
      .attr("dy", "15");

    // adding margin top to x axis text
    svg
      .selectAll(".y.axis")
      .selectAll(".tick text") // selects the text within all groups of ticks
      .attr("dx", "-4");

    // appending defs for gradient effect
    const gradDefs = svg.append("defs");

    var gradient = gradDefs
      .append("linearGradient")
      .attr("id", svgGradient)
      .attr("x1", "50%")
      .attr("x2", "50%")
      .attr("y1", "50%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("class", "start")
      .attr("offset", "0%")
      .attr("stop-color", startColor)
      .attr("stop-opacity", 1);

    gradient
      .append("stop")
      .attr("class", "end")
      .attr("offset", "100%")
      .attr("stop-color", endColor)
      .attr("stop-opacity", 1);
    // end

    // appending path for area
    const areaPath = svg
      .append("path")
      .data([initialData])
      .attr("class", "area")
      .attr("d", area)
      .attr("transform", "translate(0,300)")
      .transition()
      .duration(1000)
      .attr("transform", "translate(0,0)")
      .attr("fill", `url(#${svgGradient})`);

    // path
    const linePath = svg
      .append("path")
      .data([initialData])
      .attr("class", "line")
      .attr("d", line);

    const pathLength = linePath.node().getTotalLength();

    // to remove previous circle
    (() => {
      const circle = svg.selectAll("circle");
      circle ? circle.remove() : null;
    })();
    // end

    const circles = svg
      .selectAll("circle")
      .data(initialData)
      .enter()
      .append("circle")
      .attr("class", "circle")
      .attr("cx", (d: any) => x(d.date))
      .attr("cy", (d: any) => y(d.value))
      .attr("r", 4)
      .style("fill", defaultColor)
      .style("stroke", "white")
      .style("stroke-width", 2);

    // append rect for mouse event
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .style("cursor", "crosshair")
      .on("mouseover", () => {
        focus.style("display", null);
      })
      .on("mouseout", () => {
        focus.style("display", "none");
      })
      .on("touchmove mousemove", mouseMove);

    //Container for the gradients
    var defs = svg.append("defs");

    //Filter for the outside glow
    var filter = defs.append("filter").attr("id", "glow");
    filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "2")
      .attr("result", "coloredBlur");
    var feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    linePath
      .attr("stroke-dasharray", pathLength)
      .attr("stroke-dashoffset", pathLength)
      .attr("stroke-width", 3)
      .transition()
      .duration(1000)
      .attr("stroke-width", 0)
      .attr("stroke-dashoffset", 0)
      // .style("stroke", defaultColor);
      .attr("stroke", `url(#${svgGradient})`);

    const focus = svg
      .append("g")
      .attr("class", "focus")
      .style("display", "none");

    focus
      .append("line")
      .attr("class", "x")
      // .style("stroke-dasharray", "3,3")
      .style("stroke", defaultColor)
      .style("opacity", 1)
      .attr("y1", 0)
      .attr("y2", height);

    focus
      .append("line")
      .attr("class", "y")
      // .style("stroke-dasharray", "3,3")
      .style("stroke", defaultColor)
      .style("opacity", 1)
      .attr("x1", width)
      .attr("x2", width);

    focus
      .append("circle")
      .attr("class", "y")
      .style("fill", defaultColor)
      .style("stroke", "white")
      .style("stroke-width", 2)
      .attr("r", 5);

    focus
      .append("rect")
      .attr("width", "50px")
      .attr("height", "30px")
      .style("fill", "white")
      .style("stroke", defaultColor)
      .attr("x", -25)
      .attr("y", "-3em")
      .attr("rx", "3");

    focus
      .append("text")
      .attr("class", "y1")
      .attr("dx", -12)
      .attr("dy", "-2.3em");
    focus
      .append("text")
      .attr("class", "y2")
      .attr("dx", -12)
      .attr("dy", "-2.3em");
    focus
      .append("text")
      .attr("class", "y3")
      .attr("dx", -16)
      .attr("dy", "-3.5em");
    focus
      .append("text")
      .attr("class", "y4")
      .attr("dx", -16)
      .attr("dy", "-3.5em");

    function mouseMove(event: any) {
      const bisect = d3.bisector((d: any) => d.date).left,
        x0: any = x.invert(d3.pointer(event, this)[0]),
        i = bisect(initialData, x0, 1),
        d0 = initialData[i - 1],
        d1 = initialData[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;

      focus
        .select("circle.y")
        .attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");

      focus
        .select("text.y1")
        .attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")")
        .text(d.value);

      focus
        .select("text.y2")
        .attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")")
        .text(d.value);

      focus
        .select("text.y3")
        .attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")")
        .text(formatDate(d.date));

      focus
        .select("text.y4")
        .attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")")
        .text(formatDate(d.date));

      focus
        .select(".x")
        .attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")")
        .attr("y2", height - y(d.value));

      focus
        .select(".y")
        .attr("transform", "translate(" + width * -1 + "," + y(d.value) + ")")
        .attr("x2", width + width);

      focus
        .select("rect")
        .attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
    }
  };

  return <div ref={svgNRef} id="exampleChart"></div>;
};

export default D3Chart;
