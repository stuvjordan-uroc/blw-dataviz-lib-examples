import { newResponsiveSVG, VerticalSegmentViz } from "./blw-dataviz-lib.js"


//make the fake data we'll use in all the examples
const fakeResponses = ["A", "B", "C", "D"]
const fakeGroups = ["L", "M", "R"]
const fakeYears = new Array(20).fill(1).map((el, idx) => 1971 + idx)
const groupYearCutoffs = {
  L: (year) => ({
    t1: 0.5 - 0.4 * (year - 1971) / 20,
    t2: 0.5 + 0.3 * (year - 1971) / 20
  }),
  M: (year) => ({
    t1: 0.85 + 0.1 * (year - 1971) / 20,
    t2: 0.15 + 0.6 * (year - 1971) / 20
  }),
  R: (year) => ({
    t1: 0.33 + 0.3 * (year - 1971) / 20,
    t2: 0.33 + 0.3 * (year - 1971) / 20
  })
}
let fakeData = new Array(1000).fill(1).map((el) => ({
  group: fakeGroups[Math.floor(Math.random() * fakeGroups.length)],
  year: fakeYears[Math.floor(Math.random() * fakeYears.length)]
}))
  .map((el) => {
    let response = ""
    if (Math.random() < groupYearCutoffs[el["group"]](el.year).t1) {
      if (Math.random() < groupYearCutoffs[el["group"]](el.year).t2) {
        response = fakeResponses[0]
      } else {
        response = fakeResponses[1]
      }
    } else {
      if (Math.random() < groupYearCutoffs[el.group](el.year).t2) {
        response = fakeResponses[2]
      } else {
        response = fakeResponses[3]
      }
    }
    return ({
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
  const example1Margin = { top: 10, right: 10, bottom: 10, left: 10 }
  const example1XScale = d3.scaleLinear(
    [0, 1],
    [example1Margin.left, example1SVGConfig.maxXCoord - example1Margin.left]
  )
  const example1YScale = d3.scaleLinear(
    [0, 1],
    [example1SVGConfig.maxYCoord - example1Margin.bottom, example1Margin.top]
  )
  example1SVGSelection.selectAll("circle")
    .data(new Array(1000).fill(1))
    .join("circle")
    .attr("cx", d => example1XScale(Math.random(0, 1)))
    .attr("cy", d => example1YScale(Math.random(0, 1)))
    .attr("r", "10")
}

/*EXAMPLE 2: Basic Vertical Segments with VerticalSegmentViz*/


/*
First of all, VerticalSegmentViz is a class, so you have to call it like this:

  new VerticalSegmentViz(...arguments go here...)

It returns an instance of the class, which you use to determine coordinates.

We'll get into the details below, but first let's set up our svg
*/
const example2SVGConfig = {
  maxXCoord: 1000,
  maxYCoord: 1200,
  containerId: "frame-example-2"
}
const example2SVGId = newResponsiveSVG(example2SVGConfig)


/*
OK, now let's start using VerticalSegmentViz.  When you call `new VerticalSegmentViz`
you have to pass it an object.  The object you pass has a whole bunch of properties
you must include.  It's a big list of properties, so hold on to your butt:

+ data:  This is the data you want to plot in your segments.
It must be an array of objects, or bad things will happen.

+ groups: This is an array of arrays.  It specifies the groups for which you want to make
segements.  For instance, if you do...

  groups: [["Democrat"], ["Independent"], ["Republican"]]

...your saying you want three columns of segments, one for the rows in the data
that have "Democrat", one for the rows that have "Independent", one for the rows
that have "Republican".

What is it an array of arrays?  So you can do things like this:

  groups: [["Democrat", "Independent"], ["Republican"]]

This would make a plot with two columns of segments.  One column would show the
distribution of responses among demorats and independents, the other among republicans.
Pretty cool, yes?

The columns are always going to be left-to-right in the order of the groups array.
for instance [["Independent"],["Republican"]] would put independents on the left
and republicans on the right, [["Republican"],["Independent"]] would do the opposite

The groups must be mutually exclusive.  So...

  groups[["Democrat", "Independent"],["Independent","Republican"]]

...will fail.

+ responses:  This is an array of arrays that tells you what responses you want in
each column, how those responses should be grouped and ordered.  Here's an example:

  responses: [["Fully"], ["Mostly"], ["Partly"], ["Not at all"]]

This will create 4 segments in each column, with the heights proportional to the
proportion of the members of the groups in that column who gave the relevant response.
Segments will be orderd top to bottom as they are listed left-to-right in the 
responses array.  So in this example, the top segment for each group will represent the
proportion of each group that responded "Fully".

Just like with groups, we can make segments that combine multiple responses, like this:

  responses: [["Fully","Mostly"],["Partly","Not at all"]]

This would give us two segments in each column.  The top segment representing people who
said "Fully" OR "Mostly", the bottom segment representing people who said "Partly" OR
"Not at all".

The response arrays have to be mutually exclusive.  So, for instance, this will throw
an error

  responses: [["Fully", "Mostly", "Partly"], ["Partly", "Not at all"]]

The response arrays together have to include ALL the responses in the data.  So if you
write...

  responses: [["Fully"], ["Mostly"], ["Partly"], ["Not at all"]]

...But the data you pass to the data propoerty has some rows that have "NaN" in
the relevant column, an error will be thrown.

+ groupKey:  This is a string that gives the key used to access which group 
each row belongs to in the data you passed to the data property.  For instance,
if each object in your data array is like this...

  {
    bidenWinner: "some string",
    pid3: "some string",
    someOtherProp: "some string"
  }

and you want the columns to represent groups that are keyed by pid3, you would do:

  groupKey: "pid3"


+ responseKey: This string gives the key used to access which response each row
belongs to in the data you passed to the data property.  For instance, if your
data looked like the above example, and you wanted the segment heights to represent
responses to bidenWinner, you would do:

  responseKey: "bidenWinner"


+ margin:  this is a standard margin object, such as

  margin: {top: 10, right: 10, bottom: 10, left: 10}

HOWEVER, you probably want to pass a DIFFERENT margin object than the one you're using
for the svg as a whole.  VerticalSegmentViz will lay things out so that the left-most
column of segments will sit with it's left side exactly at the 'left' property of
margin you pass.  So you want a big enough left margin to accomodate labels, etc.

Similarly, the right-most segment will sit with it's right side right up against
margin.right.

+ vizWidth:  This is the total width of the vizualization.  If you're just putting
one segment plot in your svg and nothing else, you probably want to use the maximum
x Coordinate for this.  On the other hand, if you 
*/


const someArray = new Array(10)

const example2VSVConfig = {
  data: fakeData,
  groups: [["L", "M"], ["R"]],
  responses: [["A"], ["B"], ["C"], ["D"]],
  groupKey: "group",
  responseKey: "response",
  margin: { top: 50, left: 300, bottom: 50, right: 300 },
  vizWidth: example2SVGConfig.maxXCoord,
  vizHeight: example2SVGConfig.maxYCoord,
  segmentWidth: 150,
  segmentVerticalPadding: 20
}
const example2VSV = new VerticalSegmentViz(example2VSVConfig)

/* this gives the right and left boundary of the column of segments for a given group */
example2VSV.X("L")
/* what's returned from the line above is an object like this:
  {
    xLeft: Some coordinate (a number),
    xRight: Some coordinate (a number)
  }

*/

/* this gives the top and bottom boundaries of the segment for a given group and response */
example2VSV.Y("M", "B")
/* what's returned from the line above is an object like this:
  {
    yTop: Some coordinate (a number),
    yBottom: Some coordinate (a number)
  }
*/

/* this gives the proprotions by group and response */
example2VSV.P("M", "B")
/*
returns a number that is the proprtion in the group to which "L" belongs who gave response "B"
*/

if (!example2SVGId) {
  console.log("Something is wrong with example 1. newResponsiveSVG returned null.")
} else {
  //Knowing that the returned id is not null, we can now start putting stuff in our SVG!

  //use d3 to select the newly-attached svg...remembering to pre-pend the id string
  //in the selector! (d3 is loaded in a script tag in index.html just before this script,
  //so you can just use d3.)
  const example2SVGSelection = d3.select("#" + example2SVGId)

  //let's just outline the rectangles

  example2SVGSelection.append("rect")
    .attr("x", example2VSV.X("L").xLeft)
    .attr("y", example2VSV.Y("L", "A").yTop)
    .attr("width", example2VSV.X("L").xRight - example2VSV.X("L").xLeft)
    .attr("height", example2VSV.Y("L", "A").yBottom - example2VSV.Y("L", "A").yTop)
    .attr("stroke-width", "5")
    .attr("stroke", "gray")
    .attr("fill", "none")

  Array("A", "B", "C", "D").forEach((response) => {
    example2SVGSelection.append("rect")
      .attr("x", example2VSV.X("L").xLeft)
      .attr("y", example2VSV.Y("L", response).yTop)
      .attr("width", example2VSV.X("L").xRight - example2VSV.X("L").xLeft)
      .attr("height", example2VSV.Y("L", response).yBottom - example2VSV.Y("L", response).yTop)
      .attr("stroke-width", "5")
      .attr("stroke", "gray")
      .attr("fill", "none")

    example2SVGSelection.append("rect")
      .attr("x", example2VSV.X("R").xLeft)
      .attr("y", example2VSV.Y("R", response).yTop)
      .attr("width", example2VSV.X("R").xRight - example2VSV.X("R").xLeft)
      .attr("height", example2VSV.Y("R", response).yBottom - example2VSV.Y("R", response).yTop)
      .attr("stroke-width", "5")
      .attr("stroke", "gray")
      .attr("fill", "none")
  })
}