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

let coordinateStore = d3.map()

function ready([flights, airportCodes, json]) {
  airportCodes.forEach(d => {
    let name = d.iata_code
    let coords = [d.longitude, d.latitude]
    coordinateStore.set(name, coords)
  })


  //console.log(json.objects)
  let countries = topojson.feature(json, json.objects.countries)
 // console.log(countries)

  //console.log(flights)

  projection.fitSize([width, height], countries)

    svg.append('path')  
      .datum({type: 'Sphere'})
      .attr('d', path)
      .attr('fill', 'lightblue')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)

  svg
    .selectAll('.country')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', path)
    .attr('fill', 'lightgrey')
    .attr('stroke', 'black')
    .attr('stroke-width', 0.7)

  svg
    .selectAll('.city')
    .data(airportCodes)
    .enter()
    .append('circle')
    .attr('class', 'city')
    .attr('r', 2)
    .attr('fill', 'white')
    .attr('transform', d => {
      let coords = projection([d.longitude, d.latitude])
      return `translate(${coords})`
    })

   svg.selectAll('.flights')
    .data(airportCodes)
    .enter().append('path')
    .attr('d', d => {
      // What is the 'from' city?
      console.log(d)
      // Get the coordinates based on that city's name
      console.log(coordinateStore.get(d.iata_code))

      // Pull out our coordinates
      let fromCoords = ([-73.781187,40.645477])
      let toCoords = coordinateStore.get(d.iata_code)

      // Build a GeoJSON LineString
      var geoLine = {
        type: 'LineString',
        coordinates: [fromCoords, toCoords]
      }


      // Feed that to our d3.geoPath()
      return path(geoLine)
    })
    .attr('fill', 'none')
    .attr('stroke', 'white')


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

