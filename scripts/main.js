import { newResponsiveSVG } from "./blw-dataviz-lib.js"


//make the fake data we'll use in all the examples
const fakeResponses = ["A", "B", "C", "D"]
const fakeGroups = ["L", "M", "R"]
const fakeYears = new Array(20).fill(1).map((el,idx) => 1971 + idx)
const groupYearCutoffs = {
  L: (year) => ({
    t1: 0.5 - 0.4*(year-1971)/20,
    t2: 0.5 + 0.3*(year-1971)/20
  }),
  M: (year) => ({
    t1: 0.85 + 0.1*(year-1971)/20,
    t2: 0.15 + 0.6*(year-1971)/20
  }),
  R: (year) => ({
    t1: 0.33 + 0.3*(year-1971)/20,
    t2: 0.33 + 0.3*(year-1971)/20
  })
}
let fakeData = new Array(1000).fill(1).map((el) => ({
  group: fakeGroups[Math.floor(Math.random()*fakeGroups.length)],
  year: fakeYears[Math.floor(Math.random()*fakeYears.length)]
}))
.map((el) => {
  let response = ""
  if (Math.random() < groupYearCutoffs[el["group"]](el.year).t1){
    if (Math.random() < groupYearCutoffs[el["group"]](el.year).t2) {
      response = fakeResponses[0]
    }else {
      response = fakeResponses[1]
    }
  }else {
    if (Math.random() < groupYearCutoffs[el.group](el.year).t2) {
      response = fakeResponses[2]
    }else {
      response = fakeResponses[3]
    }
  }
  return({
    ...el,
    response: response
  })
})


/*EXAMPLE 1: Make a Responsive SVG with newResponsiveSVG*/


/*
newResposiveSVG takes an object with properties maxXCoord, maxYCoord, containerId
maxXCoord and maxYCoord must be positive numbers.  They establish the aspect ratio 
of the new svg as width:height = maxXCoord:maxYCoord.   No matter how the window resizes,
the svg will maintain that aspect ratio.

Also, maxXCoord and maxYCoord establish the coordinate system of the SVG.  No matter
the window size (and no matter the resulting size of the SVG), the coordinates of 
the four corners of the svg will be (0,0), (maxXCoord,0), (maxXCoord,maxYCoord),
(0,maxYCoord).

This means that within the svg's coordinate systme, the apparent width and height
of the SVG (even as the actual width and height as rendered in the browser changes)
will be maxXCoord and maxYCoord

The containerId property must be a string.  There must be an element in the document
with that string as its id attribute.  newResponsiveSVG will append an svg to the document
as the last child of that element. It will set an event listener on window resize events.
Whenever that listener fires, the listener will dipatch to a handler that resizes
the svg to fit exactly within the width of the content area of its parent, while maintaining
the aspect ratio you set with maxXCoord and maxYCoord.
*/
const example1SVGConfig = {
  maxXCoord: 1000,
  maxYCoord: 800,
  containerId: "frame-example-1"
}
const example1SVGId = newResponsiveSVG(example1SVGConfig)

//If newResponsivSVG returns null, something went wrong, and you can expect
//that thigs won't work out as you would hope.  So:
if (!example1SVGId) {
  console.log("Something is wrong with example 1. newResponsiveSVG returned null.")
} else {
  //Knowing that the returned id is not null, we can now start putting stuff in our SVG!
  
  //use d3 to select the newly-attached svg...remembering to pre-pend the id string
  //in the selector! (d3 is loaded in a script tag in index.html just before this script,
  //so you can just use d3.)
  const example1SVGSelection = d3.select("#" + example1SVGId)
  
  //now do the stuff you already know how to do.  For instance:
  const example1Margin = {top: 10, right: 10, bottom: 10, left: 10}
  const example1XScale = d3.scaleLinear(
    [0,1], 
    [example1Margin.left, example1SVGConfig.maxXCoord - example1Margin.left ]
  )
  const example1YScale = d3.scaleLinear(
    [0,1],
    [example1SVGConfig.maxYCoord-example1Margin.bottom, example1Margin.top]
  )
  example1SVGSelection.selectAll("circle")
    .data(new Array(1000).fill(1))
    .join("circle")
      .attr("cx", d => example1XScale(Math.random(0,1)))
      .attr("cy", d => example1YScale(Math.random(0,1)))
      .attr("r", "10")
}

