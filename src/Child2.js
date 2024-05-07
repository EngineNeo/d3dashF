import React, { Component } from 'react';
import * as d3 from 'd3';

class Child2 extends Component {
    constructor(props) {
        super(props);
        this.d3Container = React.createRef();
        this.state = {
            selectedCategory: 'A', 
        };
        this.margin = { top: 40, right: 30, bottom: 50, left: 60 };
        this.width = 950 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;
    }

    componentDidMount() {
        this.drawScatterPlot();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.data !== this.props.data || prevState.selectedCategory !== this.state.selectedCategory) {
            this.drawScatterPlot();
        }
    }

    drawScatterPlot() {
        const data = this.state.selectedCategory === 'A' ?
            this.props.data :
            this.props.data.filter(d => d.category === this.state.selectedCategory);

        const svg = d3.select(this.d3Container.current);
        svg.selectAll("*").remove();

        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => +d.x))
            .range([0, this.width]);

        const y = d3.scaleLinear()
            .domain(d3.extent(data, d => +d.y))
            .range([this.height, 0]);


        const g = svg.append("g").attr("transform", `translate(${this.margin.left},${this.margin.top})`);

        g.append("g")
            .attr("transform", `translate(0,${this.height})`)
            .call(d3.axisBottom(x))
            .append("text")
            .attr("y", this.margin.bottom - 10)
            .attr("x", this.width / 2)
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("X Value");

        g.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -this.margin.left + 20)
            .attr("x", -this.height / 2)
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("Y Value");

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")
            .style("position", "absolute");

        g.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d.x))
            .attr("cy", d => y(d.y))
            .attr("r", 5)
            .style("fill", "#69b3a2")
            .on("mouseover", function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`X: ${d.x}<br/>Y: ${d.y}`)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    }

    handleCategoryChange = (event) => {
        this.setState({ selectedCategory: event.target.value });
    };

    render() {
        return (
            <div>
                <select id="category-select" onChange={this.handleCategoryChange}>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                </select>
                <svg width={this.width + this.margin.left + this.margin.right} height={this.height + this.margin.top + this.margin.bottom} ref={this.d3Container} style={{ border: "1px solid #ccc" }}></svg>
            </div>
        );
    }
}

export default Child2;
