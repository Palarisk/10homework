import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = { top: 0, left: 0, right: 0, bottom: 0 }

let height = 500 - margin.top - margin.bottom

let width = 900 - margin.left - margin.right

let svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .style('background', 'black')
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')


let projection = d3.geoMercator()
let graticule = d3.geoGraticule()

let path = d3.geoPath().projection(projection)

let colorScale = d3
  .scaleSequential(d3.interpolateViridis)
  .domain([100000, 1000000])
  .clamp(true)

Promise.all([
  d3.csv(require('./data/world-cities.csv')),
  d3.json(require('./data/world.topojson'))
])
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready([datapoints, json]) {
//  console.log(json.objects)
  let countries = topojson.feature(json, json.objects.countries)
//  console.log(countries)

//  console.log(datapoints)

  svg
    .selectAll('.country')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', path)


  svg
    .selectAll('.city')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('class', 'city')
    .attr('r', 1)
    .attr('transform', d => {
      let coords = projection([d.lng, d.lat])
      return `translate(${coords})`
    })
    .attr('fill', d => colorScale(d.population))

  // console.log(graticule())

  svg
    .append('path')
    .datum(graticule())
    .attr('d', path)
    .attr('stroke', 'grey')
    .attr('stroke-width', 0.5)
    .lower()
}
