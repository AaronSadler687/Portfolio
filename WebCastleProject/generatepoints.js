//*******************************************************************************
//* Program: generatepoints.js
//* Authors: Aaron Sadler
//*          Wesley
//* Vertex definition information for Project Four
//*
//* NOTE:     Some borrowed and modified from Dr. Li's ortho.js
//*           and surfaceRevolution.js
//*           Each primitive function requires that you pass in the source array
//*           from which to choose the vertices rather than using a certain array.
//*           This file is also based off of the charleshavin example given in
//*           class.
//*
//*           This is mostly a mess just because of the sheer number of vertex
//*           definitions, but it's all mostly straightforward.
//*           Vertex definitions -> generate objects
//*             (ex. objPoints -> generateObj).
//*******************************************************************************

function GeneratePoints()
{
    // See project4.js for the Scene definition.
    Scene.objects["cube"] = new Scene.SceneObject(points.length, 36, gl.TRIANGLES);
    quad( cubePoints, 1, 0, 3, 2, 9);
    quad( cubePoints, 2, 3, 7, 6, 9);
    quad( cubePoints, 3, 0, 4, 7, 9);
    quad( cubePoints, 6, 5, 1, 2, 9);
    quad( cubePoints, 4, 5, 6, 7, 9);
    quad( cubePoints, 5, 4, 0, 1, 9);

    Scene.objects["cylinder"] = new Scene.SceneObject(points.length, 1014, gl.TRIANGLES);
    generateCylinder();

    Scene.objects["cone"] = new Scene.SceneObject(points.length, 1014, gl.TRIANGLES);
    generateCone();

    Scene.objects["keeproof"] = new Scene.SceneObject(points.length, 43, gl.TRIANGLES);
    generateKeepRoof();

    Scene.objects["stairPoly"] =new Scene.SceneObject(points.length, 36, gl.TRIANGLES);
    generateStairPoly();

    Scene.objects["battlement"] = new Scene.SceneObject(points.length, 36, gl.TRIANGLES);
    quad( cubePoints, 1, 0, 3, 2, 11);
    quad( cubePoints, 2, 3, 7, 6, 11);
    quad( cubePoints, 3, 0, 4, 7, 11);
    quad( cubePoints, 6, 5, 1, 2, 11);
    quad( cubePoints, 4, 5, 6, 7, 11);
    quad( cubePoints, 5, 4, 0, 1, 11);

    Scene.objects["water"] = new Scene.SceneObject(points.length, 36, gl.TRIANGLES);
    quad( cubePoints, 1, 0, 3, 2, 3);
    quad( cubePoints, 2, 3, 7, 6, 3);
    quad( cubePoints, 3, 0, 4, 7, 3);
    quad( cubePoints, 6, 5, 1, 2, 3);
    quad( cubePoints, 4, 5, 6, 7, 3);
    quad( cubePoints, 5, 4, 0, 1, 3);



    Scene.objects["banner"] = new Scene.SceneObject(points.length, 52, gl.TRIANGLES);
    generateBanner();

    Scene.objects["flagpole"] = new Scene.SceneObject(points.length, 1014, gl.TRIANGLES);
    generateFlagpole();

    Scene.objects["stable"] =new Scene.SceneObject(points.length, 36, gl.TRIANGLES);
    generateStable();


    Scene.objects["darkcube"] = new Scene.SceneObject(points.length, 36, gl.TRIANGLES);
    quad( cubePoints, 1, 0, 3, 2, 12);
    quad( cubePoints, 2, 3, 7, 6, 12);
    quad( cubePoints, 3, 0, 4, 7, 12);
    quad( cubePoints, 6, 5, 1, 2, 12);
    quad( cubePoints, 4, 5, 6, 7, 12);
    quad( cubePoints, 5, 4, 0, 1, 12);

    Scene.objects["woodcube"] = new Scene.SceneObject(points.length, 36, gl.TRIANGLES);
    quad( cubePoints, 1, 0, 3, 2, 10);
    quad( cubePoints, 2, 3, 7, 6, 10);
    quad( cubePoints, 3, 0, 4, 7, 10);
    quad( cubePoints, 6, 5, 1, 2, 10);
    quad( cubePoints, 4, 5, 6, 7, 10);
    quad( cubePoints, 5, 4, 0, 1, 10);
}

// Definitions for different colors.
var vertexColors = [
  vec4( 1.0, 0.0, 0.0, 1.0 ),  // red 0
  vec4( 0.5, 0.5, 0.0, 1.0 ),  // yellow 1
  vec4( 0.0, 1.0, 0.0, 1.0 ),  // green 2
  vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue 3
  vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta 4
  vec4( 97/255, 66/255, 0, 1.0 ),  // brownish 5
  vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan 6
  vec4( 0.0, 0.0, 0.0, 1.0 ),  // black 7
  vec4( 166/255, 166/255, 166/255, 1.0 ), // grey 8
  vec4( 89/255, 89/255, 89/255, 1.0 ), // dark grey 9
  vec4( 56/255, 38/255, 0, 1.0 ),  // brownish 10
  vec4( .55, 0.0, 0.0, 1.0 ),  // dark red 11
  vec4( 0.0, 0.6, 0.0, 1.0 ),  // Grass Green 12
];

// Calculate the normals for the indices in sourceArray.

function Newell(sourceArray, indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];

       x += (sourceArray[index][1] - sourceArray[nextIndex][1])*
            (sourceArray[index][2] + sourceArray[nextIndex][2]);
       y += (sourceArray[index][2] - sourceArray[nextIndex][2])*
            (sourceArray[index][0] + sourceArray[nextIndex][0]);
       z += (sourceArray[index][0] - sourceArray[nextIndex][0])*
            (sourceArray[index][1] + sourceArray[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}


function SurfaceRevolution(pointsArray, colorIndex) {
  var tempVertices = [];

  var len = pointsArray.length;

  for (var i = 0; i<len; i++) {
        tempVertices.push( vec4(pointsArray[i][0],
                                pointsArray[i][1],
                                pointsArray[i][2], 1) );
  }

  var r;
  var t=Math.PI/6;

  for (var j = 0; j < len-1; j++) {
    var angle = (j+1)*t;

    // for each sweeping step, generate 25 new points corresponding to the original points
    for(var i = 0; i < 14 ; i++ ) {
        r = tempVertices[i][0];
        tempVertices.push( vec4(r*Math.cos(angle),
                           tempVertices[i][1],
                           -r*Math.sin(angle), 1) );
    }
  }

  // quad strips are formed slice by slice (not layer by layer)
  for (var i = 0; i < len-1; i++) {
    for (var j = 0; j < len-1; j++) {
      quad( tempVertices,
            i*len+j,
            (i+1)*len+j,
            (i+1)*len+(j+1),
            i*len+(j+1),
            colorIndex);
    }
  }
}

function quad(sourceArray, a, b, c, d, colorIndex) {

  var indices=[a, b, c, d];
  var normal = Newell(sourceArray, indices);

  points.push(sourceArray[a]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
    textureCoordsArray.push(textures[0]);
  points.push(sourceArray[b]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
    textureCoordsArray.push(textures[1]);
  points.push(sourceArray[c]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
    textureCoordsArray.push(textures[2]);
  points.push(sourceArray[a]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
    textureCoordsArray.push(textures[0]);
  points.push(sourceArray[c]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
    textureCoordsArray.push(textures[2]);
  points.push(sourceArray[d]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
    textureCoordsArray.push(textures[3]);
}

// General triangle generation
function triangle(sourceArray, a, b, c, colorIndex) {

  var indices=[a, b, c];
  var normal = Newell(sourceArray, indices);

  points.push(sourceArray[a]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
    textureCoordsArray.push(textures[0]);

  points.push(sourceArray[b]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
    textureCoordsArray.push(textures[1]);

  points.push(sourceArray[c]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
    textureCoordsArray.push(textures[2]);
}

// General shape
function generalShape(sourceArray, vertGroup, center, colorGroup) {
  var colorIndex = 0;
  for(var i = 0; i < vertGroup.length-1; i++) {
    var indices=[vertGroup[i], center, vertGroup[i+1]];
    var normal = Newell(sourceArray, indices);

    points.push(sourceArray[vertGroup[i]]);
      colors.push(vertexColors[colorGroup[colorIndex]]);
      normals.push(normal);
    points.push(sourceArray[center]);
      colors.push(vertexColors[colorGroup[colorIndex]]);
      normals.push(normal);
    points.push(sourceArray[vertGroup[i+1]]);
      colors.push(vertexColors[colorGroup[colorIndex]]);
      normals.push(normal);
    if(colorIndex < colorGroup.length-1)
      colorIndex++;
  }
}

// Form an octagon shape
// 24 points
function octagon(sourceArray, a, b, c, d, e, f, g, h, center, colorIndex) {

  var indices=[a, b, c, d, e, f, g, h];
  var normal = Newell(sourceArray, indices);

  points.push(sourceArray[a]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
  points.push(sourceArray[center]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
  points.push(sourceArray[b]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);

  points.push(sourceArray[b]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
  points.push(sourceArray[center]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
  points.push(sourceArray[c]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);


  points.push(sourceArray[c]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
  points.push(sourceArray[center]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
  points.push(sourceArray[d]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);

  points.push(sourceArray[d]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
  points.push(sourceArray[center]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
  points.push(sourceArray[e]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);


  points.push(sourceArray[e]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
  points.push(sourceArray[center]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
  points.push(sourceArray[f]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);

  points.push(sourceArray[f]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
  points.push(sourceArray[center]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
  points.push(sourceArray[g]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);


  points.push(sourceArray[g]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
  points.push(sourceArray[center]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
  points.push(sourceArray[h]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);

  points.push(sourceArray[h]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
  points.push(sourceArray[center]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
  points.push(sourceArray[a]);
    colors.push(vertexColors[colorIndex]);
    normals.push(normal);
}

var keepRoofPoints = [
  // Front
  vec4(-1,  -0.5,  1, 1.0 ), // A      0
  vec4(-.5,  .5,  0.25, 1.0 ), // B    1
  vec4(.5, .5,  0.25, 1.0 ), // C        2
  vec4(1, -0.5,  1, 1.0 ), // D      3

  // Back
  vec4(1,  -0.5,  -.5, 1.0 ), // E      4
  vec4(.5,  .5,  0.25, 1.0 ), // F    5
  vec4(-.5, .5,  0.25, 1.0 ), // G        6
  vec4(-1, -0.5, -.5, 1.0 ), // H      7

  // Windows
  vec4(0,  0,  0, 1.0 ), // J      8
  vec4(0,  0,  .5, 1.0 ), // K    9
  vec4(.3, .3,  .65, 1.0 ), // L        10
  vec4(.3, .3, -.15, 1.0 ), // M      11

  vec4(.6,  0,  0, 1.0 ), // J      12
  vec4(.6,  0,  .5, 1.0 ), // K    13

  vec4(0,  0,  0, 1.0 ), // J      14
  vec4(0,  0,  .5, 1.0 ), // K    15
  vec4(-.3, .3,  .65, 1.0 ), // L        16
  vec4(-.3, .3, -.15, 1.0 ), // M      17

  vec4(-.6,  0,  0, 1.0 ), // J      18
  vec4(-.6,  0,  .5, 1.0 ), // K    19
];


var cylinderPoints = [
  vec4(.53, 0, 0, 1.0),
  vec4(.53, .1, 0, 1.0),
  vec4(.53, .125, 0, 1.0),
  vec4(.53, .2, 0, 1.0),
  vec4(.53, .25, 0, 1.0),
  vec4(.53, .28, 0, 1.0),
  vec4(.53, .32, 0, 1.0),
  vec4(.53, .45, 0, 1.0),
  vec4(.53, .52, 0, 1.0),
  vec4(.53, .6, 0, 1.0),
  vec4(.53, .75, 0, 1.0),
  vec4(.53, .875, 0, 1.0),
  vec4(.53, .875, 0, 1.0),
  vec4(0, .875, 0, 1.0),
];

var conePoints = [
  vec4(.53, 1, 0, 1.0),
  vec4(.53, 1, 0, 1.0),
  vec4(.53, 1, 0, 1.0),
  vec4(.53, 1, 0, 1.0),
  vec4(.53, 1, 0, 1.0),
  vec4(.53, 1, 0, 1.0),
  vec4(.53, 1, 0, 1.0),
  vec4(.53, 1, 0, 1.0),
  vec4(.53, 1, 0, 1.0),
  vec4(.53, 1, 0, 1.0),
  vec4(.53, 1, 0, 1.0),
  vec4(.53, 1, 0, 1.0),
  vec4(.53, 1, 0, 1.0),
  vec4(0, 1.4, 0, 1.0),
];

var cubePoints = [
  vec4( -0.5, -0.5,  0.5, 1.0 ),
  vec4( -0.5,  0.5,  0.5, 1.0 ),
  vec4( 0.5,  0.5,  0.5, 1.0 ),
  vec4( 0.5, -0.5,  0.5, 1.0 ),
  vec4( -0.5, -0.5, -0.5, 1.0 ),
  vec4( -0.5,  0.5, -0.5, 1.0 ),
  vec4( 0.5,  0.5, -0.5, 1.0 ),
  vec4( 0.5, -0.5, -0.5, 1.0 ),
];

var stairPolyPoints = [
    vec4( -.25, -0.75,  1.5, 1.0 ),
    vec4( -.25,  0.35,  .15, 1.0 ),
    vec4( .25,  0.35,  .15, 1.0 ),
    vec4( .25, -0.75,  1.5, 1.0 ),
    vec4( -.25, -0.75, -.25, 1.0 ),
    vec4( -0.25,  0.35, -.25, 1.0 ),
    vec4( 0.25,  0.35, -.25, 1.0 ),
    vec4( 0.25, -0.75, -.25, 1.0 ),

];

var bannerPoints = [
  vec4(.5,  .5,  1, 1.0 ), // A      0
  vec4(-.5,  .5,  1, 1.0 ), // B    1
  vec4(-.5, -.5,  1, 1.0 ), // C        2
  vec4(.5, -0.5,  1, 1.0 ), // D      3
  vec4(0, -1,  1, 1.0 ), // E      4
];
stable_vertices = [
             vec4(-2,0,-1,1),
             vec4(-2,0,0,1),
             vec4(1,0,1,1),
             vec4(2,0,0,1),
             vec4(2,0,-1,1),
                ];


var flagpolePoints = [
	vec4(0.005, .07, 0.0, 1),
	vec4(.018, .096, 0.0, 1),
	vec4(.031, .122, 0.0, 1),
	vec4(.044, .148, 0.0, 1),
  vec4(.058, .197, 0.0, 1),
	vec4(.041, .238, 0.0, 1),
	vec4(.033, .245, 0.0, 1),
	vec4(.044, .266, 0.0, 1),
	vec4(.034, .287, 0.0, 1),
	vec4(.025, .306, 0.0, 1),
	vec4(.025, .510, 0.0, 1),
	vec4(.025, .625, 0.0, 1),
	vec4(.025, .695, 0.0, 1),
	vec4(0.025, 1.0, 0.0, 1),
];


function generateFlagpole()
{
  SurfaceRevolution(flagpolePoints, 9);
}


function generateCylinder(){
  SurfaceRevolution(cylinderPoints, 8);
}

function generateCone(){
  SurfaceRevolution(conePoints, 11);
}
function generateStairPoly(){
  quad( stairPolyPoints, 1, 0, 3, 2, 9);
  quad( stairPolyPoints, 2, 3, 7, 6, 9);
  quad( stairPolyPoints, 3, 0, 4, 7, 9);
  quad( stairPolyPoints, 6, 5, 1, 2, 9);
  quad( stairPolyPoints, 4, 5, 6, 7, 9);
  quad( stairPolyPoints, 5, 4, 0, 1, 9);


};

function generateKeepRoof(){
  // Front
  quad( keepRoofPoints, 0, 1, 2, 3, 7);  //  1
  // Back
  quad( keepRoofPoints, 4, 5, 6, 7, 7);  //  2
  // Side 1
  triangle( keepRoofPoints, 3, 2, 4, 7);  //  3
  // Side 2
  triangle( keepRoofPoints, 0, 1, 7, 7);  //  4

  // Window 1
  quad( keepRoofPoints, 8, 9, 10, 11, 7);  //  5
  quad( keepRoofPoints, 12, 13, 10, 11, 7);  //  6
  // Window 2
  quad( keepRoofPoints, 14, 15, 16, 17, 7);  //  7
  quad( keepRoofPoints, 18, 19, 16, 17, 7);  //  8

}

function generateBanner(){
  quad(bannerPoints, 0,1,2,3, 1);
  triangle(bannerPoints, 2,3,4, 1);
}

function generateStable()
{
    var height=3;

    N=N_Triangle = stable_vertices.length;

    // add the second set of points
    for (var i=0; i<N; i++)
    {
        stable_vertices.push(vec4(stable_vertices[i][0], stable_vertices[i][1]+height, stable_vertices[i][2], 1));
    }

    quad(stable_vertices, 0,5,6,1,10);
    quad(stable_vertices,1,6,7,2,11);
    quad(stable_vertices,2,7,8,3,11);
    quad(stable_vertices,3,8,9,4,10);
    quad(stable_vertices,4,9,5,0,10);
}
