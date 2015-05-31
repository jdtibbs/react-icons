
var React = require('react')
var H2 = require('./H2.jsx')
var H3 = require('./H3.jsx')
var Cog = require('../Cog')
var Highlight = require('./Highlight.jsx')

var Square = require('./examples/Square.jsx')
var Polygon = require('./examples/Polygon.jsx')
var SunBurst = require('./examples/SunBurst.jsx')
var FlatTeeth = require('./examples/FlatTeeth.jsx')
var Splayed = require('./examples/Splayed.jsx')

var Tutorial = React.createClass({

  render: function() {
    return (
      <div className="prose">
        <p>
          While traditional graphics software applications like Adobe Illustrator work well for certain tasks,
          they fall short when attempting to create pixel perfect, mathematically derived graphics.
          Anyone who’s attempted to create data visualizations with such software might better understand these limitations,
          and JavaScript libraries like D3 have helped out tremendously.
          Certain types of illustrations and icons can also be difficult to create,
          and Illustrator leaves a lot of room for error.
        </p>
        <Cog />
        <p>
          Take a settings cog icon as an example.
          It relies on radial symmetry and is based on three concentric circles,
          where lines from each tooth must intersect at points not easily determined within a two dimensional grid.
          Creating something like this in graphics software
          would require using transformations every time an adjustment is made.
          Luckily, some basic math can help out,
          and JavaScript excels at making these sorts of calculations.
        </p>
        <p>
          Using a library like React allows coupling between
          the math involved and the resulting svg markup,
          and it provides an easy way to render static markup.
          This tutorial focuses on using React as a stand-alone exploratory design tool,
          rather than a way to implement SVG icons within a React application.
        </p>

        <H2>Making a Cog Icon</H2>
        <Cog />
        <pre>replace with sketch</pre>
        <p>
          Looking at this sketch, there are some properties that can be handled with JavaScript variables:
        </p>
        <ul>
          <li>Overall dimensions</li>
          <li>Three concentric with three different radii</li>
          <li>The number of flat-edged, splayed teeth around the outside</li>
          <li>Fill color for the SVG</li>
        </ul>

        <H2>Initial Setup</H2>
        <p>
          To get started, you should have <a href="https://nodejs.org/" target="_blank">Node.js</a> installed as well as a basic understanding of using npm and JavaScript modules.
          Initialize a new npm package and install react and react-tools
        </p>
        <Highlight code="npm init" />
        <Highlight code="npm i --save-dev react react-tools" />
        <p>
          Now create a <code>build.js</code> script which will be used to render the static SVG.
        </p>
        <Highlight code={this.props.code.build1} />
        <p>
          This build script imports the Cog component, renders it to static markup, and saves the file in the <code>icons</code> folder.
        </p>
        <p>
          Next create a <code>src</code> folder and a new <code>Cog.jsx</code> file.
        </p>
        <Highlight code={this.props.code.svgComponent1} />
        <p>
          Next add some scripts to <code>package.json</code>.
        </p>

        <Highlight code={this.props.code.packageScripts} />
        <Highlight code="npm run jsx" />
        <Highlight code="npm run build" />

        <H3>The xmlns Attribute in React</H3>
        <p>
          At the time of this writing, React strips the xmlns attribute from the SVG.
          When using the SVG inline in HTML, this shouldn’t be a problem,
          but when using it as an image, the attribute is needed.
          To get around this limitation, add a wrapping SVG tag in <code>build.js</code>.
        </p>
        <Highlight code={this.props.code.build2} />
        <H3>Watching Changes</H3>
        <p>
          To watch changes as the icon is developed run the watch:jsx command to transpile the jsx file to js.
        </p>
        <Highlight code="npm run watch:jsx" />
        <p>
          Make a folder called <code>icons</code> and run <code>npm run build</code> to save a new SVG.
          Open the SVG file in a browser to see the icon as it progresses.
          At this point, it should appear blank.
          Open web inspector to ensure that the SVG wrapper is there.
        </p>

        <H2>Default Props</H2>
        <p>
          To allow for adjustments to be made from the build script, the icon will use React props.
          Define some defaults in <code>Cog.jsx</code>.
        </p>
        <Highlight code={this.props.code.defaultProps} />
        <p>
          The width and height of the square-shaped icon will be handled with <code>size</code>.
          The diameters <code>d1</code>, <code>d2</code>, and <code>d3</code> represent ratios
          of the size for each concentric circle.
          The number of teeth on the cog will be handled with the <code>teeth</code> prop.
          The <code>splay</code> prop represents the angle for the side of each tooth and will be explained later.
          And the <code>fill</code> is set to <code>currentcolor</code> to inherit color when used inline in HTML.
        </p>


        <H2>Defining Radii and Other Values</H2>
        <p>
          Within the render function, use these props to define other values that will be used to create the icon.
        </p>
        <Highlight code={this.props.code.renderVariables} />
        <p>
          The center of the icon is defined as <code>c</code>. The angle for each tooth is calculated based on the number of teeth. <code>offset</code> is used to rotate the icon 90° to ensure that the first tooth is at the top. 
        </p>

        <H2>Path Data</H2>
        <p>
          The <code>pathData</code> variable will be used for the path element’s <code>d</code> attribute.
          The value for this attribute is a string of commands used to draw a line.
          Letters represent different commands and numbers represent position in the x/y coordinate system.
          Uppercase letters are used for absolute coordinates, while lowercase is used for relative coordinates.
          This tutorial only uses absolute coordinates, so each letter must be uppercase.
          Only three commands will be used to create the icon: Move <code>M</code>, Line To <code>L</code>, and Arc <code>A</code>.
          To read more about the SVG path element, see this <a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths" target="_blank">MDN Tutorial</a>.
        </p>
        <p>
          The <code>pathData</code> variable is constructed with an array followed by the <code>.join()</code> method.
          This is to more easily combine path commands and numbers and ensure that the values have a space between each one.
        </p>
        <p>
          To demonstrate how the path commands work, the following should create a rectangle based on the coordinates given.
        </p>
        <div className="center">
          <Square />
        </div>
        <Highlight code={this.props.code.pathSquare} />

        <H2>Building Teeth</H2>
        <p>
          To create teeth around the outer circle based on the number given in the <code>teeth</code> prop,
          create a function that returns values for the points.
          To calculate the x/y coordinates for each point around the outer circle, add the following functions.
        </p>
        <Highlight code={this.props.code.rxRy} />
        <p>
          The <code>rad</code> function converts degrees to radians for convenience and since the <code>Math.cos</code>, <code>Math.sin</code>, and <code>Math.tan</code> functions all require radians.
          The <code>rx</code> and <code>ry</code> functions respectively calculate the x and y coordinates based on the radius and angle.
        </p>
        <pre>circle x/y diagram</pre>
        <p>
          Start with a polygon to see how the <code>teeth</code> prop can be adjusted to create different numbers of points.
        </p>
        <Highlight code={this.props.code.drawPolygon} />
        <div className="center">
          <Polygon />
          <Polygon teeth={7} />
          <Polygon teeth={6} />
          <Polygon teeth={5} />
        </div>
        <p>
          Passing the number of teeth to the <code>drawTeeth</code> function, it loops through and calculates each angle with the offset defined above.
          Using a ternary operator, it either moves to the first point or draws a line to subsequent points.
          The x and y coordinates are calculated with the <code>rx</code> and <code>ry</code> functions.
          Then each command is pushed to the <code>d</code> array, and it is return as a string.
        </p>
        <p>
          Since Math functions are calculating numbers that are being converted to strings for the <code>d</code> attribute,
          JavaScript will convert extremely small numbers to scientific notation.
          To prevent this from happening, the <code>num</code> function is used to return <code>0</code> for small numbers.
        </p>

        <H3>Shaping the Teeth</H3>
        <p>
          Now that the function to loop through the number of teeth is set up,
          change the commands in the <code>line</code> array to draw lines to the middle circle of the cog.
        </p>
        <div className="center">
          <SunBurst />
        </div>
        <Highlight code={this.props.code.sunBurst} />
        <p>
          This function arbitrarily adds and subtracts 6° to the angle to create the teeth.
          Add the following to the render function to calculate the angles based on the number of teeth.
        </p>
        <Highlight code={this.props.code.flatTeeth} />
        <p>
          The tooth angle <code>ta</code> is one-fourth of the angle for each tooth.
          The tooth width <code>tw</code> is based on that angle.
          The <code>tx</code> and <code>ty</code> functions are used to calculate the x and y coordinates based on angle and distance.
          These functions and values are added to the line array to offset points for the corners of the teeth and the points at which they intersect the middle circle.
        </p>
        <pre>right triangle diagram</pre>
        <div className="center">
          <FlatTeeth />
        </div>

        <H3>Splayed Teeth</H3>
        <p>
          The icon is starting to take shape, but the sides of each tooth are based on angles from the center.
          To splay the sides of the teeth in the other direction, make edits and add the following.
        </p>
        <Highlight code={this.props.code.splay} />
        <p>
          Splay, defined earlier in default props, represents a ratio of the tooth angle.
          Since it’s a prop, adjustments to this angle can be made from the build script.
          For the tooth width, the splay angle is subtracted from the tooth angle.
        </p>
        <p>
          For the <code>drawTeeth</code> function,
          splay is added and subtracted from the angles at which the side of the tooth should intersect the middle circle.
        </p>
        <Highlight code={this.props.code.splayDraw} />
        <div className="center">
          <Splayed />
        </div>

        <H2>Adding a Hole</H2>
        <p>
        </p>
        



        <H2>Live Demo</H2>
        <p>size, middle, inner, teeth, splay</p>

      </div>
    )
  }

})

module.exports = Tutorial
