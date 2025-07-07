import { HorizontalSegmentViz, VerticalSegmentViz } from "./blw-dataviz-segment.js"

//first we make some fake data

const responses = ['tiny', 'small', 'big', 'gargantuan']
const groups = ['a', 'b', 'c']
const years = Array(30).fill(1).map((el, idx) => (1971 + idx))

function T(group) {
  if (group === 'a') {
    return 0.3
  }
  if (group === 'b') {
    return 0.6
  }
  return 0.9
}

let fakeData = Array(10000).fill(1)
  .map((el) => ({
    group: groups[Math.floor(Math.random() * groups.length)],
    year: years[Math.floor(Math.random() * years.length)]
  }))
  .map((el) => {
    const firstCut = Math.random()
    const secondCut = Math.random()
    if (firstCut < T(el.group)) {
      if (secondCut < T(el.group)) {
        return ({
          ...el,
          response: responses[0]
        })
      }
      return ({
        ...el,
        response: responses[1]
      })
    }
    if (secondCut < T(el.group)) {
      return ({
        ...el,
        response: responses[2]
      })
    }
    return ({
      ...el,
      response: responses[3]
    })
  })

console.log(fakeData)


//Example 1: Vertical Segments

const frameVert = d3.select(".vertical-segment")
const frameVertWidth = parseFloat(frameVert.style("width"))
const frameVertHeight = parseFloat(frameVert.style("height"))
const svgVert = frameVert
  .append("svg")
    .attr("width", frameVertWidth)
    .attr("height", frameVertHeight)
const segmentVert = new VerticalSegmentViz({
  data: fakeData,
  responses: [['tiny'], ['small'], ['big'], ['gargantuan']],
  groups: [['a','b'],['c']], //this illustrates how we can consolidate groups
  responseKey: "response",
  groupKey: "group",
  margin: {top: 10, right: 50, bottom: 10, left: 50},
  segmentWidth: 100,
  segmentVerticalPadding: 20,
  vizWidth: frameVertWidth,
  vizHeight: frameVertHeight
})

svgVert.selectAll("circle")
  .data(fakeData)
  .join("circle")
    .attr("class", d => d.group)
    .attr("cx", d => segmentVert.X(d.group).xLeft + Math.random()*(segmentVert.X(d.group).xRight - segmentVert.X(d.group).xLeft))
    .attr("cy", d => segmentVert.Y(d.group, d.response).yTop + Math.random()*(segmentVert.Y(d.group, d.response).yBottom - segmentVert.Y(d.group, d.response).yTop))


//Example 2: Horizontal Segments

const frameHoriz = d3.select(".horizontal-segment")
const frameHorizWidth = parseFloat(frameHoriz.style("width"))
const frameHorizHeight = parseFloat(frameHoriz.style("height"))
const svgHoriz = frameHoriz
  .append("svg")
    .attr("width", frameHorizWidth)
    .attr("height", frameHorizHeight)
const segmentHoriz = new HorizontalSegmentViz({
  data: fakeData,
  responses: [['tiny','small'], ['big','gargantuan']],//this illustrates how we can consolidate responses
  groups: [['a'],['b'],['c']], //this illustrates how we can separate out the groups
  responseKey: "response",
  groupKey: "group",
  margin: {top: 50, right: 10, bottom: 50, left: 10},
  segmentHeight: 50,
  segmentHorizontalPadding: 20,
  vizWidth: frameHorizWidth,
  vizHeight: frameHorizHeight
})

svgHoriz.selectAll("circle")
  .data(fakeData)
  .join("circle")
    .attr("class", d => d.group)
    .attr("cx", d => segmentHoriz.X(d.group, d.response).xLeft + Math.random()*(segmentHoriz.X(d.group, d.response).xRight - segmentHoriz.X(d.group, d.response).xLeft))
    .attr("cy", d => segmentHoriz.Y(d.group).yTop + Math.random()*(segmentHoriz.Y(d.group).yBottom - segmentHoriz.Y(d.group).yTop))
