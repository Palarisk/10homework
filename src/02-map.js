//WORK IN PROGRESS

import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = { top: 0, left: 20, right: 20, bottom: 0 }

let height = 400 - margin.top - margin.bottom

let width = 700 - margin.left - margin.right

let svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')


  let projection = d3.geoEqualEarth()
let graticule = d3.geoGraticule()

let path = d3.geoPath().projection(projection)


Promise.all([
  d3.csv(require('./data/flights.csv')),
  d3.csv(require('./data/airport-codes-subset.csv')),
  d3.json(require('./data/world.topojson'))
])
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready([flights, airportCodes, json]) {
  console.log(json.objects)
  let countries = topojson.feature(json, json.objects.countries)
 // console.log(countries)

  console.log(flights)

  svg
    .selectAll('.country')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', path)


  svg
    .selectAll('.city')
    .data(airportCodes)
    .enter()
    .append('circle')
    .attr('class', 'city')
    .attr('r', 1)
    .attr('fill', 'yellow')
    .attr('transform', d => {
      let coords = projection([d.longitude, d.latitude])
      return `translate(${coords})`
    })

 
    

  // console.log(graticule())
/*
  svg
    .append('path')
    .datum(graticule())
    .attr('d', path)
    .attr('stroke', 'grey')
    .attr('stroke-width', 0.5)
    .lower()
    */
}

