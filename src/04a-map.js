import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = { top: 0, left: 0, right: 0, bottom: 0 }

let height = 500 - margin.top - margin.bottom

let width = 900 - margin.left - margin.right

let svg = d3
  .select('#chart-4a')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let projection = d3.geoAlbersUsa()
let graticule = d3.geoGraticule()

let path = d3.geoPath().projection(projection)

let colorScale = d3
  .scaleLinear()
  .domain([0, 1])
  .range(['green', 'purple'])
 // .clamp(true)

Promise.all([d3.json(require('./data/counties_with_election_data.topojson'))])
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

function ready([json]) {
//  console.log(json.objects)
  let counties = topojson.feature(json, json.objects.us_counties)
  //  console.log(countries)
//  console.log(counties)
  //  console.log(datapoints)
//  console.log(counties.features)

  svg
    .selectAll('.country')
    .data(counties.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', path)
    .attr('fill', d => {
      let votesClinton =
        d.properties.clinton / (d.properties.clinton + d.properties.trump)
      return colorScale(votesClinton)

    })
 
    .attr('opacity', d => {
      let votesTotal = d.properties.clinton + d.properties.trump

      return votesTotal/500000
    })


}
