
class PlotData {

    constructor(country, xVal, yVal, color, circleSize) {
        this.state = country;
        this.xVal = xVal;
        this.yVal = yVal;
        this.color = color;
        this.circleSize = circleSize;
    }
}

class bubblePlot {


    constructor(data,activeyear){


        this.margin = { top: 20, right: 20, bottom: 60, left: 80 };
        this.width = 900 - this.margin.left - this.margin.right;
        this.height = 600 - this.margin.top - this.margin.bottom;

        this.data = data;
        this.activeyear = activeyear;


        this.minSize = {
            'population': Infinity,
            'income': Infinity,
            'unemployment': Infinity,
            'crime': Infinity
        };
        this.maxSize = {
            'population': -Infinity,
            'income': -Infinity,
            'unemployment': -Infinity,
            'crime': -Infinity
        };
        //console.log(this.data);
        for (let key of d3.keys(this.data)){
            let karray = this.data[key];
            if (key === "unemployment"){
                let Minvalue = Infinity;
                let Maxvalue = -Infinity;
                for (let eachState of karray){
                    for (let item of eachState.values){
                        let minvalue = parseFloat(item["Unemployment-rate"]) ? parseFloat(item["Unemployment-rate"]) :Infinity;
                        Minvalue = minvalue < Minvalue ? minvalue : Minvalue;
                        let maxvalue = parseFloat(item["Unemployment-rate"]) ? parseFloat(item["Unemployment-rate"]) :-Infinity;
                        Maxvalue = maxvalue > Maxvalue ? maxvalue : Maxvalue;
                    }
                }
                this.minSize[key] = Minvalue;
                this.maxSize[key] = Maxvalue;
            }
            if (key === "income"){
                let Minvalue = Infinity;
                let Maxvalue = -Infinity;

                for (let eachState of karray){
                    for (let item of eachState.values){
                        let minvalue = Number(item.income) ? Number(item.income) :Infinity;
                        Minvalue = minvalue < Minvalue ? minvalue : Minvalue;
                        let maxvalue = Number(item.income) ? Number(item.income) :-Infinity;
                        Maxvalue = maxvalue > Maxvalue ? maxvalue : Maxvalue;
                    }
                }
                this.minSize[key] = Minvalue;
                this.maxSize[key] = Maxvalue;

            }
            if (key === "crime") {
                let Minvalue = Infinity;
                let Maxvalue = -Infinity;
                let pMinvalue = Infinity;
                let pMaxvalue = -Infinity;
                for (let eachState of karray) {
                    //console.log(eachState);
                    if(eachState.key == "UnitedStatesTotal"){
                        continue;
                    }
                    for (let item of eachState.values) {
                        let minvalue = parseFloat(item.rate) ? parseFloat(item.rate) : Infinity;
                        Minvalue = minvalue < Minvalue ? minvalue : Minvalue;
                        let maxvalue = parseFloat(item.rate) ? parseFloat(item.rate) : -Infinity;
                        Maxvalue = maxvalue > Maxvalue ? maxvalue : Maxvalue;

                        let pminvalue = parseFloat(item.Population) ? parseFloat(item.Population) :Infinity;
                        pMinvalue= pminvalue < pMinvalue ? pminvalue : pMinvalue;
                        let pmaxvalue = parseFloat(item.Population) ? parseFloat(item.Population) :-Infinity;
                        pMaxvalue = pmaxvalue > pMaxvalue ? pmaxvalue : pMaxvalue;
                    }
                }
                this.minSize[key] = Minvalue;
                this.maxSize[key] = Maxvalue;
                this.maxSize["population"] = pMaxvalue;
                this.minSize["population"] = pMinvalue;
            }
        }

        //console.log(this.minSize);
        //console.log(this.maxSize);

        this.drawPlot();
        this.drawDropDown("unemployment", "crime", "income", "population");
        this.updatePlot(this.activeyear, "unemployment", "crime", "income", "population");
    }

    drawPlot(){
        d3.select("#bubbleChart").append("div").attr("id","chart-view");


        let dropdownWrap = d3.select('#chart-view').append('div').classed('dropdown-wrapper', true);

        let cWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        cWrap.append('div').classed('c-label', true)
            .append('text')
            .text('Circle Size: ');

        cWrap.append('div').attr('id', 'dropdown_c').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        let colorWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        colorWrap.append('div').classed('c-color', true)
            .append('text')
            .text('Circle Color: ');

        colorWrap.append('div').attr('id', 'dropdown_color').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        let xWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        xWrap.append('div').classed('x-label', true)
            .append('text')
            .text('X Axis Data: ');

        xWrap.append('div').attr('id', 'dropdown_x').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        let yWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        yWrap.append('div').classed('y-label', true)
            .append('text')
            .text('Y Axis Data: ');

        yWrap.append('div').attr('id', 'dropdown_y').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');



        d3.select('#chart-view')
            .append('svg').classed('plot-svg', true)
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.svgGroup = d3.select('#chart-view').select('.plot-svg').append('g');

        this.svgGroup.append("g").attr("id","x-axis");
        this.svgGroup.append("text").attr("id", "xaxis-label");
        this.svgGroup.append("g").attr("id","y-axis");
        this.svgGroup.append("text").attr("id", "yaxis-label");

        d3.select('#chart-view')
            .append('div')
            .classed('circle-legend', true)
            .append('svg')
            .append('g')
            .attr('transform', 'translate(10, 0)');



    }

    updatePlot(activeYear, xIndicator, yIndicator, circleSizeIndicator, circleColorIndicator){
        //console.log(activeYear);
        //console.log(circleSizeIndicator);
        //console.log(circleColorIndicator);
        //console.log(xIndicator);
        //console.log(yIndicator);

        //this.activeyear = activeYear;
        let that = this;
        let minCS = this.minSize[circleSizeIndicator];
        let maxCS = this.maxSize[circleSizeIndicator];

        let circleSizer = function (d) {
            let cScale = d3.scaleSqrt().range([3, 20])
                .domain([minCS, maxCS]);
            return d.circleSize ? cScale(d.circleSize) : 3;
        };

        let plot_Data = [];
        //console.log(this.data["unemployment"]);
        let stateIDs = d3.map(that.data["unemployment"], function (d) {
            return d.key;
        });
        //console.log(activeYear);
        //console.log(that.data[yIndicator]);
        //console.log(that.data[xIndicator]);
        for (let cID of d3.keys(stateIDs)){
            //console.log(cID);
            let state = stateIDs[cID].State ;
            //console.log(stateIDs[cID]);
            //let activeyear = activeYear;
            let id = stateIDs[cID].key;
            if (id == undefined){
                continue;
            }
            //console.log(id)
            //console.log(that.data[xIndicator])
            let xData = that.data[xIndicator].find(d=> d.key === id);
            //console.log(this.data[xIndicator].find(d=> d.key === id));
            let xVal = filterData(xData, xIndicator,activeYear);
            //console.log(xVal);
            let yData = that.data[yIndicator].find(d=> d.key === id);

            let yVal = filterData(yData, yIndicator,activeYear);
            //console.log(yVal);
            let csData = that.data[circleSizeIndicator].find(d=> d.key === id);
            //console.log(csData);
            let circleSize = filterData(csData, circleSizeIndicator,activeYear);
            let ccData = that.data[circleColorIndicator].find(d=> d.key === id);
            let color = filterData(ccData, circleColorIndicator,activeYear);

            plot_Data.push(new PlotData(id, xVal, yVal, color, circleSize));
        }
            //console.log(plot_Data);
        function filterData(d, indicator,activeYear){
            //console.log(d);
            //console.log(activeYear);
            let stateData = d.values.find(d => d.Year === activeYear);
            //console.log(stateData);
            if (indicator === "unemployment"){
                return parseFloat(stateData["Unemployment-rate"]);
            }
            if (indicator === "crime"){
                return parseFloat(stateData["rate"]);
            }
            if (indicator === "population"){
                return parseFloat(stateData["Population"]);
            }
            if (indicator === "income"){
                return parseFloat(stateData.income);
            }
        }

        let xbScale = d3.scaleLinear().range([0, this.width])
            .domain([this.minSize[xIndicator], this.maxSize[xIndicator]]).nice();
        let ybScale = d3.scaleLinear().range([this.height, 0])
            .domain([this.minSize[yIndicator], this.maxSize[yIndicator]]).nice();


        let colorScale = d3.scaleSequential(d3.interpolatePRGn)
            .domain([this.minSize[circleColorIndicator], this.maxSize[circleColorIndicator]]);

        //import {legend} from "@d3/color-legend";

        //legend({
         //   color: d3.scaleSequential([this.minSize[circleColorIndicator], this.maxSize[circleColorIndicator]], d3.interpolatePRGn)
        //    title: circleColorIndicator
       // })

        let scatterplot = this.svgGroup.selectAll('circle').data(plot_Data);

        scatterplot.exit().remove();

        let newscatterplot = scatterplot.enter().append('circle');
        scatterplot = newscatterplot.merge(scatterplot);

        scatterplot.attr('cx', d => (this.margin.left + (d.xVal ? xbScale(d.xVal) : 0)))
            .attr('cy', d => (this.margin.top + (d.yVal ? ybScale(d.yVal) : this.height)))
            .attr('r', circleSizer)
            .attr("id", d => (d.id))
            .style("fill", d => colorScale(d.color));

        let xbAxis = d3.axisBottom()
            .scale(xbScale);
        d3.select("#x-axis")
            .classed("axis",true)
            .attr("transform", "translate("+this.margin.left+"," + (this.height+this.margin.top) + ")")
            .call(xbAxis);

        d3.select("#xaxis-label")
            .attr("transform",
                "translate(" + (this.width)/2 + " ," +
                (this.height + this.margin.top + 40) + ")")
            .classed("axis-label", true)
            .text(xIndicator.charAt(0).toUpperCase() + xIndicator.slice(1));

        let ybAxis = d3.axisLeft()
            .scale(ybScale);

        d3.select("#y-axis")
            .attr("transform",
                "translate("+this.margin.left+"," + this.margin.top  + ")")
            .call(ybAxis);

        d3.select("#yaxis-label")
            .attr("transform", "translate(12, "+(this.height / 2 + this.margin.top)+") rotate(-90)")
            .classed("axis-label", true)
            .text(yIndicator.charAt(0).toUpperCase() + yIndicator.slice(1));


        this.drawLegend(minCS, maxCS);

    }

    drawDropDown(xIndicator, yIndicator, circleSizeIndicator, circleColorIndicator){

        let that = this;
        //console.log(that.activeyear);
        let dropDownWrapper = d3.select('.dropdown-wrapper');
        let dropData = [];
        //console.log(this.data);
        let index = 0;
        for (let key in this.data) {
            dropData.push({
                indicator: key,
                indicator_name: key.charAt(0).toUpperCase() + key.slice(1)
            });
            index=index+1;
        }

        //console.log(dropData);
        /* CIRCLE DROPDOWN */
        let dropC = dropDownWrapper.select('#dropdown_c').select('.dropdown-content').select('select');

        let optionsC = dropC.selectAll('option')
            .data(dropData);


        optionsC.exit().remove();

        let optionsCEnter = optionsC.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsCEnter.append('text')
            .text((d, i) => d.indicator_name);

        optionsC = optionsCEnter.merge(optionsC);

        let selectedC = optionsC.filter(d => d.indicator === circleSizeIndicator)
            .attr('selected', true);

        dropC.on('change', function(d, i) {
            let cValue = this.options[this.selectedIndex].value.toLowerCase();
            let xValue = dropX.node().value.toLowerCase();
            let yValue = dropY.node().value.toLowerCase();
            let cColor = dropColor.node().value.toLowerCase();
            let activeyear = that.activeyear;
            that.updatePlot(activeyear, xValue, yValue, cValue, cColor);
            d3.event.stopPropagation();
        });

        /* CIRCLE COLOR DROPDOWN */
        let dropColor = dropDownWrapper.select('#dropdown_color').select('.dropdown-content').select('select');

        let optionsColor = dropColor.selectAll('option')
            .data(dropData);

        optionsColor.exit().remove();

        let optionsColorEnter = optionsColor.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsColor = optionsColorEnter.merge(optionsColor);

        optionsColorEnter.append('text')
            .text((d, i) => d.indicator_name);

        let selectedColor = optionsColor.filter(d => d.indicator === circleColorIndicator)
            .attr('selected', true);

        dropColor.on('change', function(d, i) {
            let cColor = this.options[this.selectedIndex].value;
            let xValue = dropX.node().value;
            let cValue = dropC.node().value;
            let yValue = dropY.node().value;
            let activeyear = that.activeyear;
            that.updatePlot(activeyear, xValue, yValue, cValue, cColor);

            d3.event.stopPropagation();
        });

        /* X DROPDOWN */
        let dropX = dropDownWrapper.select('#dropdown_x').select('.dropdown-content').select('select');

        let optionsX = dropX.selectAll('option')
            .data(dropData);

        optionsX.exit().remove();

        let optionsXEnter = optionsX.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsXEnter.append('text')
            .text((d, i) => d.indicator_name);

        optionsX = optionsXEnter.merge(optionsX);

        let selectedX = optionsX.filter(d => d.indicator === xIndicator)
            .attr('selected', true);

        dropX.on('change', function(d, i) {
            let xValue = this.options[this.selectedIndex].value;
            let yValue = dropY.node().value;
            let cValue = dropC.node().value;
            let cColor = dropColor.node().value;
            let activeyear = that.activeyear;
            that.updatePlot(activeyear, xValue, yValue, cValue, cColor);

            d3.event.stopPropagation();
        });

        /* Y DROPDOWN */
        let dropY = dropDownWrapper.select('#dropdown_y').select('.dropdown-content').select('select');

        let optionsY = dropY.selectAll('option')
            .data(dropData);

        optionsY.exit().remove();

        let optionsYEnter = optionsY.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsY = optionsYEnter.merge(optionsY);

        optionsYEnter.append('text')
            .text((d, i) => d.indicator_name);
        //console.log(yIndicator);
        let selectedY = optionsY.filter(d => d.indicator === yIndicator)
            .attr('selected', true);

        dropY.on('change', function(d, i) {
            //console.log(that.activeyear);
            let yValue = this.options[this.selectedIndex].value;
            let xValue = dropX.node().value;
            let cValue = dropC.node().value;
            let cColor = dropColor.node().value;
            let activeyear = that.activeyear;
            that.updatePlot(activeyear, xValue, yValue, cValue, cColor);
            //console.log(yValue);
            d3.event.stopPropagation();
        });

    }

    drawLegend(min, max) {

        let scale = d3.scaleSqrt().range([3, 20]).domain([min, max]);

        let circleData = [min, max];

        let svg = d3.select('.circle-legend').select('svg').select('g');
        let circleGroup = svg.selectAll('g').data(circleData);
        circleGroup.exit().remove();

        let circleEnter = circleGroup.enter().append('g');
        circleEnter.append('circle').classed('neutral', true);
        circleEnter.append('text').classed('circle-size-text', true);

        circleGroup = circleEnter.merge(circleGroup);

        circleGroup.attr('transform', (d, i) => 'translate(' + ((i * (5 * scale(d))) + 20) + ', 25)');

        circleGroup.select('circle').attr('r', (d) => scale(d));
        circleGroup.select('circle').attr('cx', '0');
        circleGroup.select('circle').attr('cy', '0');
        let numText = circleGroup.select('text').text(d => new Intl.NumberFormat().format(d));

        numText.attr('transform', (d) => 'translate(' + ((scale(d)) + 10) + ', 0)');
    }

    updateYear(year){
        let that = this;
        let activeyear = year;
        //console.log(year);
        let xValue = d3.select("#dropdown_x").select('.dropdown-content').select('select').node().value;
        let yValue = d3.select("#dropdown_y").select('.dropdown-content').select('select').node().value;
        let cValue = d3.select("#dropdown_c").select('.dropdown-content').select('select').node().value;
        let cColor = d3.select("#dropdown_color").select('.dropdown-content').select('select').node().value;
        that.updatePlot(activeyear, xValue, yValue, cValue, cColor);
        //console.log(xValue);

    }


}
