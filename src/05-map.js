import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = { top: 0, left: 150, right: 0, bottom: 0 }

let height = 600 - margin.top - margin.bottom

let width = 900 - margin.left - margin.right

let svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let projection = d3.geoAlbersUsa()
let graticule = d3.geoGraticule()

let path = d3.geoPath().projection(projection)

let plantSizeScale = d3.scaleSqrt()
  .domain([0, 10000])
  .range([0, 25])
  .clamp(true)

let colorScale = d3.scaleOrdinal(d3.schemeSet3)

Promise.all([
  d3.csv(require('./data/powerplants.csv')),
  d3.json(require('./data/us_states.topojson'))
])
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready([datapoints, json]) {
  console.log(datapoints)
//  console.log(json.objects)

  let states = topojson.feature(json, json.objects.us_states)

    projection.fitSize([width, height], states)
  /*
  //  console.log(countries)
  console.log(counties)
  //  console.log(datapoints)
  console.log(counties.features)
*/


/*
    var cities = nested.map(d => d.key)
  xPositionScale.domain(cities)
*/
  let plants = datapoints.map( d => d.PrimSource)
  colorScale.domain(plants)


  svg
    .selectAll('.state')
    .data(states.features)
    .enter()
    .append('path')
    .attr('class', 'state')
    .attr('d', path)
    .attr('fill', 'lightgrey')
    .attr('stroke', 'lightgrey')

  svg
    .selectAll('.powerplant')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('class', 'powerplant')
    .attr('r', function (d) {
      return plantSizeScale(d.Total_MW)
    })
    .attr('transform', d => {
      let coords = projection([d.Longitude, d.Latitude])
      return `translate(${coords})`
    })
    .attr('opacity',0.6)
//    .attr('fill', 'green')
    .attr('fill', function (d) {
      return colorScale(d.PrimSource)
    })

  svg
    .selectAll('.state-label')
    .data(states.features)
    .enter()
    .append('text')
    .attr('class', 'state-label')
    .text(d => d.properties.abbrev)
    .attr('transform', d => {
      // hey d3, find the middle of this shape
      // d3.geoCentroid(d)
      let coords = projection(d3.geoCentroid(d))
      return `translate(${coords})`
    })
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('font-size', 14)

  
  let legend = svg.append('g')
    .attr('transform', 'translate(-100,100)')
/*
    let nested = d3
      .nest()
      .key(d => datapoints.PRimSource)
console.log(datapoints)
*/
  legend
    .selectAll('.legend-entry')
    .data(colorScale.domain())
    .enter()
    .append('g')
    .attr('transform', (d, i) => `translate(0,${i * 20})`)
    .attr('class', 'legend-entry')
    .each(function(d) {
      let g = d3.select(this)
      g.append('circle')
        .attr('r', 5)
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('fill', colorScale(d))


      g.append('text')
        .text(d.charAt(0).toUpperCase() + d.slice(1))
        .attr('dx', 10)
        .attr('dy', 5)



/*
      g.append('rect')
        .attr('x', -8)
        .attr('y', -9)
        .attr('width', 400)
        .attr('height', 18)
        .attr('fill', '#fcfcfc')
        .lower()

        */
    })



}
