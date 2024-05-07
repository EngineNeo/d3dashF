import React, { Component } from "react";
import * as d3 from "d3";

class Child1 extends Component {
    componentDidUpdate() {
        const rawData = this.props.data || [];

        const data = Array.from(d3.rollup(rawData,
            v => d3.sum(v, d => Number(d.y)),
            d => d.category),
            ([category, ySum]) => ({
                category: category,
                ySum: ySum
            }));

        const margin = { top: 30, right: 30, bottom: 70, left: 40 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3.select('.chart').html('');

        const x = d3.scaleBand()
            .range([0, width])
            .domain(data.map(d => d.category))
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.ySum)])
            .range([height, 0]);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        g.selectAll(".bar")
            .data(data)
            .join("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.category))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.ySum))
            .attr("height", d => height - y(d.ySum))
            .attr("fill", "#69b3a2");

        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append("g")
            .call(d3.axisLeft(y));

        g.selectAll(".text")
            .data(data)
            .join("text")
            .attr("text-anchor", "middle")
            .attr("x", d => x(d.category) + x.bandwidth() / 2)
            .attr("y", d => y(d.ySum) - 5)
            .text(d => d.ySum.toFixed(2));
    }

    render() {
        return (
            <div>
                <svg className="chart" width="600" height="400"></svg>
            </div>
        );
    }
}

export default Child1;