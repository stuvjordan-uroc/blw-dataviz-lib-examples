import { newResponsiveSVG, VerticalSegmentViz, HorizontalSegmentViz } from "./blw-dataviz-lib.js"


//make the fake data we'll use in (some of) the examples
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
let fakeData = new Array(10000).fill(1).map((el) => ({
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
  }).map((el) => ({
    ...el,
    year: el.year.toString(10)  //note: the segment viz tools in the library require that all the data values be strings.
  }))

  console.log(fakeData)


/*EXAMPLE 1: Make a Responsive SVG with newResponsiveSVG*/


/*
newResposiveSVG takes an object with properties maxXCoord, maxYCoord, and containerId.
maxXCoord and maxYCoord must be positive numbers.  They establish the aspect ratio 
of the new svg as width:height = maxXCoord:maxYCoord.   No matter how the window resizes,
the svg will maintain that aspect ratio.

Also, maxXCoord and maxYCoord establish the coordinate system of the SVG.  No matter
the window size (and no matter the resulting size of the SVG), the coordinates of 
the four corners of the svg will be, staring at the top-left and moving clockwise from 
there, (0,0), (maxXCoord,0), (maxXCoord,maxYCoord), (0,maxYCoord).

This means that within the svg's coordinate systme, the apparent width and height
of the SVG to you as the programmer will be maxXCoord and maxYCoord, even as the 
*actual width and height as rendered in the browser* changes.


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
//that things won't work out as you would hope.  So:
if (!example1SVGId) {
  console.log("Something is wrong with example 1. newResponsiveSVG returned null.")
} else {
  //Knowing that the returned id is not null, we can now start putting stuff in our SVG!

  //use d3 to select the newly-attached svg...remembering to pre-pend "#" to the id string
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

We'll get into the details below, but first let's set up our svg using 
newResponsiveSVG
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
you must include.  It's a big list of properties, so hold on to your butt...this 
will be a grind:

+ data:  This is the data you want to plot in your segments.
It must be an array of objects, or bad things will happen.

+ groups: This is an array of arrays.  It specifies the groups for which you want to make
segements.  For instance, if you do...

  groups: [["Democrat"], ["Independent"], ["Republican"]]

...you're saying you want three columns of segments, one for the rows in the data
that have "Democrat", one for the rows that have "Independent", one for the rows
that have "Republican".

Why is it an array of arrays and not just an array of stings?  So you can do things like this:

  groups: [["Democrat", "Independent"], ["Republican"]]

That would make a plot with two columns of segments.  One column would show the
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
proportion of each group that responded "Fully" and the bottom will represent the proportion
that responded "Not at all".

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

...but the data you pass to the data propoerty has some rows that have "NaN" in
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
column of segments will sit with its left side exactly at the 'left' property of
margin you pass.  So you want a big enough left margin to accomodate labels, etc.

Similarly, the right-most segment will sit with it's right side right up against
margin.right.

+ vizWidth:  This is the total width of the vizualization.  If you're just putting
one segment plot in your svg and nothing else, you probably want to use the maximum
x Coordinate for this.  On the other hand, you can create a tiny little segment
viz that can take up just one little portion of your svg, by setting this to some small number

+ vizHeight: The viz height.  All the stuff I said above about vizWidth applies...just rotate it 90 degrees.

+ segmentWidth: This is the width of each column of segments

+ segmentVerticalPadding: the height of the vertial gap between segments

One more thing about margin, vizHeight, segmentWidth, and segmentVerticalPadding 
before we write code:  They have to allow for enough space in each dimension.  For instance,
suppose you set vizWidth to 100 and segmentWidth to 40.  If you have 3 groups, this won't work,
because 40*3 = 120, and so your asking for segments that will together be wider than the vizWidth.
Anyway, if you call new VerticalSegmentViz with numbers that don't make sense in that way,
nothing will get rendered to the browser, and you'll get a helpful error message in the console.

OK, here we go
*/




const example2VSVConfig = {
  data: fakeData,                                        //we want a segment viz of the data in fakeData
  groups: [["L", "M"], ["R"]],                           //two columns of segments -- one for the persons in groups L or M, one for the persons in group R
  responses: [["A"], ["B"], ["C"], ["D"]],               //four segments in each column, one segment for each of the four possible responses.
  groupKey: "group",                                     //In fakedata, the "L", "M", "R" values are at the "group" key
  responseKey: "response",                               //In fakedata, the "A", "B", "C", "D" values are at the "response" key
  margin: { top: 50, left: 300, bottom: 50, right: 300 }, //margin of the viz
  vizWidth: example2SVGConfig.maxXCoord,                  //We set the viz to take up the full width of the svg
  vizHeight: example2SVGConfig.maxYCoord,                 //We set the viz to take up the full height of the svg
  segmentWidth: 150,                                      //Each column of segments should be 150 coordinates wide
  segmentVerticalPadding: 20                              //There should be 20 coordinates of vertial padding between each segment.
}
const example2VSV = new VerticalSegmentViz(example2VSVConfig) //pass the config to the constructor.  Out pops and instance of VerticalSegmentVis

/*
A VerticalSegmentViz instance, like the one stored in the variable example2VSV in the code above, 
has three methods:

+ P
+ X
+ Y

### P 

P takes a value of the property at groupKey, a value of the property at responseKey, and returns the proportion of the
group to which the groupKey value belongs who gave the value at responseKey.  For instance, using the code
above, example2VSV.P("L", "A") would return the proportion of persons in the ["L","M"] group who responded "A". In effect
P gives you the proportions that determine the heights of the segments.  You can use it (for instance) to set the content
of labels or hover popups that tell your user the relevant group percentages represented by each segment.


### X

X takes a value of the property at groupKey, and returns an object like this:

  {
    xLeft: ...some coordinate...,
    xRight: ...some coordinate...
  }

The two coordinates in this object tell you the left-most and right-most x coordinates of the column representing responses
by persons with that value on the groupKey.  For instance, example2VSV.X("L").xLeft is the left-most x-coordinate of the
column of segments representing the group ["L", "M"], and example2VSV.X("L").xRight is the right-most x-coordinate of 
that same column.

### Y

Y takes a value of the property at groupKey, a value of the property at responseKey, and returns an object like this:

  {
    yTop: ...some coordinate...,
    yBottom: ...some coordinate...
  }

The two coordinates in this object tell you the top-most and bottom-most y coordinates of the segment representing responses
by persons with that value on the groupKey and that value in the responseKey.  For instance, example2VSV.Y("L", "A").yTop is the l
top-most y-coordinate of the segment representing persons in the the group ["L", "M"] who gave the response "A", and
example2VSV.Y("L","A").yBottom is the bottom y coordinate of that same segment.


*/

//With those three methods -- P, X, and Y, in hand -- its "easy"  (ok, maybe not __easy__)...
// its much easiER than writing all the code directly to draw the stuff that 
// makes up a segment plot.

//For example:

if (!example2SVGId) {
  console.log("Something is wrong with example 1. newResponsiveSVG returned null.")
} else {
  //Knowing that the returned id is not null, we can now start putting stuff in our SVG!

  //use d3 to select the newly-attached svg...remembering to pre-pend "#" to the id string
  //in the selector!
  const example2SVGSelection = d3.select("#" + example2SVGId)

  //First let's just outline the segments with rectangles

  
  Array("A", "B", "C", "D").forEach((response) => {  //step through the responses
    example2SVGSelection.append("rect")  //first do the rectangle for the ["L", "M"] group segment
      .attr("x", example2VSV.X("L").xLeft)  //get the left coordinate of the segment, and set the left edge of the rect there
      .attr("y", example2VSV.Y("L", response).yTop) //get the top coordinate of the segment, and set the top edge of the rect there
      .attr("width", example2VSVConfig.segmentWidth) //segment width was set in the config, so we can just use it directly!
      .attr("height", example2VSV.Y("L", response).yBottom - example2VSV.Y("L", response).yTop) //use the Y method to get the height of the segment
      .attr("stroke-width", "3") //you already understand the rest!
      .attr("stroke", "gray")
      .attr("fill", "none")

    example2SVGSelection.append("rect") //now do the rectangle for the ["R"] group segment
      .attr("x", example2VSV.X("R").xLeft)
      .attr("y", example2VSV.Y("R", response).yTop)
      .attr("width", example2VSV.X("R").xRight - example2VSV.X("R").xLeft)
      .attr("height", example2VSV.Y("R", response).yBottom - example2VSV.Y("R", response).yTop)
      .attr("stroke-width", "3")
      .attr("stroke", "gray")
      .attr("fill", "none")
  })
  
  //Now let's jitter the individual datapoints as circles across the relevant segments !

  example2SVGSelection.selectAll("circle")
    .data(fakeData)
    .join("circle")
    .attr("cx", d => (  //on the x-axis, jitter from the left edge of the relevant segment, across the segment width
      example2VSV.X(d[example2VSVConfig.groupKey]).xLeft + Math.random() * (example2VSVConfig.segmentWidth)  
    ))
    .attr("cy", d => (  //on the y-axis, jitter from the top edge of the relevant segment, across the relevent segment height.
      example2VSV.Y(d[example2VSVConfig.groupKey], d[example2VSVConfig.responseKey]).yTop +
      Math.random() * (
        example2VSV.Y(d[example2VSVConfig.groupKey], d[example2VSVConfig.responseKey]).yBottom -
        example2VSV.Y(d[example2VSVConfig.groupKey], d[example2VSVConfig.responseKey]).yTop)
    ))
    .attr("r", 10)  //you already understand the rest!
    .attr("stroke-width", 1)

}

/*EXAMPLE 3 Horizontal Segment Viz */


const example3SVGConfig = {
  maxXCoord: 1000,
  maxYCoord: 1500,
  containerId: "frame-example-3"
}
const example3SVGId = newResponsiveSVG(example3SVGConfig)

/* 
The HorizontalSegmentViz produces the exact same sort of plot as VerticalSegmentViz,
just rotated 90 degrees. 

I'll go ahead and set it up in code, and then explain how it works.
*/



const example3HSVConfig = {
  data: fakeData,                                           //as in the previous example, we're working with the fake data
  groups: [["L"], ["M"], ["R"]],                           //three groups in this one.  Since this is a horizontal viz, that means we'll have 3 _rows_ of horizontal segments (instead of columns of segments as we would in a vertical segment viz)
  responses: [["A","B"], ["C","D"]],                       //lets create two groups of responses (A OR B and C OR D). that means each row of segments will contain 2 segments
  groupKey: "group",                                        //hopefully you get what this is doing by now.
  responseKey: "response",                                 //same.
  margin: { top: 200, left: 50, bottom: 200, right: 50 },    //The top row of segments will have it's top edge at margin.top.  The bottom row will have its bottom edge at vizHeight-margin.bottom.
  vizWidth: example3SVGConfig.maxXCoord,                    //total width of the viz set to the full y extent of the coordinate system
  vizHeight: example3SVGConfig.maxYCoord,                   //total height of the viz set the full x extent of the coordinate system.  
  segmentHeight: 300,                                        //height of each row of segments.  Make sure there enough vertical space!  Must have vizHeight - margin.top - margin.bottom - (number of groups)*segmentHeight > 0
  segmentHorizontalPadding: 50                              //horizontal padding between each segment.  Make sure there is enough horizontal space!  Must have vizWidth - margin.left - margin.right - (number of response groups - 1)*segmentHorizontalPadding > 0
}
const example3HSV = new HorizontalSegmentViz(example3HSVConfig)

/*
What you should notice in the above code is...

+ what was segmentWidth in the config for VerticalSegmentViz is segmentHeight in the HorizontalSegmentViz

+ what was verticalSegmentPadding in the configfor VerticalSegmentViz is 
horizontalSegmentPadding in the config for HorizontalSegmentViz.  

+ Otherwise, everything is the same (although the effect is to lay out the segments horizontally instead of vertially, of course.)
*/

if (!example3SVGId) {
  console.log("Something is wrong with example 3. newResponsiveSVG returned null.")
} else {
  //Knowing that the returned id is not null, we can now start putting stuff in our SVG!

  //use d3 to select the newly-attached svg...remembering to pre-pend "#" to the id string
  //in the selector! (d3 is loaded in a script tag in index.html just before this script,
  //so you can just use d3.)
  const example3SVGSelection = d3.select("#" + example3SVGId)

  example3SVGSelection.selectAll("circle")
    .data(fakeData)
    .join("circle")
    .attr("cx", d => (  //jitter the cx coordiante from the left edge of the relevant segment across the width of the relevant segment
      example3HSV.X(d[example3HSVConfig.groupKey], d[example3HSVConfig.responseKey]).xLeft + Math.random() * (
        example3HSV.X(d[example3HSVConfig.groupKey], d[example3HSVConfig.responseKey]).xRight - 
        example3HSV.X(d[example3HSVConfig.groupKey], d[example3HSVConfig.responseKey]).xLeft
      )
    ))
    .attr("cy", d => (  //jitter the cy coordinate from the top edge of the relevant row of segments across the segmentHeight
      example3HSV.Y(d[example3HSVConfig.groupKey]).yTop +
      Math.random() * (example3HSVConfig.segmentHeight)
    ))
    .attr("r", 5)
    .attr("stroke-width", 1)

}



/*EXAMPLE 4: Breaking things out over many time periods. */

//remember, each row in the data has a "year" property.  There are 20 years in the data
//ranging from 1971 to 1991.  We're going to break the distribution of responses out by year
//with years on the vertical axis.  thus we want a horizontal segment plot.

const example4SVGConfig = {
  maxXCoord: 1000,
  maxYCoord: 2000,  //notice that we make this plot twice as long as it is wide, because we'll have 20 rows of segments!
  containerId: "frame-example-4"
}
const example4SVGId = newResponsiveSVG(example4SVGConfig)

//let's grab the div that we just put that svg into, and limit it's height
//then will set the overflow-y style on it so we can scroll through the segments
d3.select("#" + "frame-example-4")
  .style("max-height", "1000px")
  .style("overflow-y", "scroll") //let it scroll baby, let it scroll.


//OK, now we need to build an array of array representing our groups
//Our groups are the years, and we want each year broken out separately.
//So we need a thing like this: [["1971"],["1972"],["1973"], ...etc... , ["1991"]]

const yearGroups = fakeYears.map(el => el.toString()) //VerticalSegmentViz and HorizontalSegmentViz require all values to be strings!!!!
  .map(el => Array(el))
console.log(yearGroups)

//yearGroups now holds an array of arrays like this:
// [["1971"],["1972"],["1973"], ...etc... , ["1991"]]


const example4HSVConfig = {
  data: fakeData,                                           
  groups: yearGroups,                           
  responses: [["A","B"], ["C","D"]],          //there's going to be a lot going on in this viz.  So let's simplyfy things by putting the responses into just two groups.             
  groupKey: "year",  //note the groups are in the "year" key!                                        
  responseKey: "response",                                 
  margin: { top: 100, left: 50, bottom: 100, right: 50 },   
  vizWidth: example4SVGConfig.maxXCoord,  //um...ok, so we have 2000 y coordinates to work with, and we set margin.top and margin.bottom to 100.  So we have 1800 y coordinates left    
  vizHeight: example4SVGConfig.maxYCoord,                   
  segmentHeight: 40,                     //there are going to be 20 rows of segments.  1800/20 = 90.  So at most segmentHeight can be 90.  But we want some space between the segments.                  
  segmentHorizontalPadding: 50                              
}
const example4HSV = new HorizontalSegmentViz(example4HSVConfig)

//make sure that we actually have the svg we need in the doc before we go any further
if (!example4SVGId) {
  console.log("Something is wrong with example 4. newResponsiveSVG returned null.")
} else {
  //Knowing that the returned id is not null, we can now start putting stuff in our SVG!

  //use d3 to select the newly-attached svg...remembering to pre-pend "#" to the id string
  //in the selector! (d3 is loaded in a script tag in index.html just before this script,
  //so you can just use d3.)
  const example4SVGSelection = d3.select("#" + example4SVGId)
  //let's give this svg a background to make its independent scrolling context clear
  example4SVGSelection.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", example4SVGConfig.maxXCoord)
    .attr("height", example4SVGConfig.maxYCoord)
    .attr("fill", "#d0eef2")

  example4SVGSelection.selectAll("circle")
    .data(fakeData)
    .join("circle")
    .attr("cx", d => (  //jitter the cx coordiante from the left edge of the relevant segment across the width of the relevant segment
      example4HSV.X(d[example4HSVConfig.groupKey], d[example4HSVConfig.responseKey]).xLeft + Math.random() * (
        example4HSV.X(d[example4HSVConfig.groupKey], d[example4HSVConfig.responseKey]).xRight - 
        example4HSV.X(d[example4HSVConfig.groupKey], d[example4HSVConfig.responseKey]).xLeft
      )
    ))
    .attr("cy", d => (  //jitter the cy coordinate from the top edge of the relevant row of segments across the segmentHeight
      example4HSV.Y(d[example4HSVConfig.groupKey]).yTop +
      Math.random() * (example4HSVConfig.segmentHeight)
    ))
    .attr("r", 5)
    .attr("stroke-width", 1)

}




