//*******************************************************************************
//* Program: project4.js
//* Authors: Aaron Sadler
//*          Wesley Anderson
//* Main project file for 4250 Project Four.
//* FOR CLASS: Since the last project requires audio, here's a page with a way
//*            to do it that's very easy:
//*              https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement
//*            which inherits from:
//*              https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
//*
//* NOTE:     This works best in Chrome. For some reason some camera controls may
//*           be reversed on a mac.
//*******************************************************************************
var walls = 1;
var castle = 1;
var modelViewMatrix=mat4(); // identity
var modelViewMatrixLoc;
var projectionMatrix;
var projectionMatrixLoc;
var modelViewStack=[];

// Variables that control the orthographic projection bounds.
var y_max = 5;
var y_min = -5;
var x_max = 8;
var x_min = -8;
var near = -50;
var far = 50;

// Camera
var eye = vec3(0, 0, 0);
const at = vec3(0, 0, 0);
const up = vec3(0, 1, 0);

var points=[];
var colors=[];
var normals=[];
var textureCoordsArray = [];  // textures array

// TODO: Set a single scene light (handled in scene?)
//       and give each object its own material (in scene).
var lightPosition = vec4(-4, 3, 4, 0.0 );
var lightAmbient = vec4(.8, 0.8, 0.8, 1.0 );
var lightDiffuse = vec4( .5, .5, .5, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 0.1, 0.1, 0.1, 1.0 );
var materialDiffuse = vec4( 0.1, 0.1, 0.1, 1.0);
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 4.0;

var ambientColor, diffuseColor, specularColor;

var program;
var textures = [
  vec2(0,0),
  vec2(0,1),
  vec2(1,0),
  vec2(1,1)
];

var sounds = [];


//*******************************************************************************
//* Scene namespace. Contains the object which holds all SceneObjects along with
//* its definition. Also contains the function to draw SceneObjects.
//*******************************************************************************
var Scene = {

    // Holds all of the objects in a scene, defined in SceneObject.
    objects : {},

    SceneObject : function (start, length, type, translate, rotate, scale) {
        this.start = start;
        this.length = length;
        this.type = type;
        this.translate = translate || vec3(0, 0, 0);
        this.scale = scale || vec3(1, 1, 1);
        this.rotate = rotate || vec4(0, 1.0, 0, 0);
    },

    // TODO: Add the transformations to each object and add
    //       a way to set them (ex. objects["this"].setTranslate(x, y, z)).
    DrawObject : function (objectName) {
        var obj = Scene.objects[objectName];

        //modelViewStack.push(modelViewMatrix);

        //modelViewMatrix = mult(modelViewMatrix, obj.translate);
        //modelViewMatrix = mult(modelViewMatrix, obj.rotate);
        //modelViewMatrix = mult(modelViewMatrix, obj.scale);
        //gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

        gl.drawArrays(obj.type, obj.start, obj.length);
        //modelViewMatrix = modelViewStack.pop();
    }
};
//*******************************************************************************
//* End Scene namespace
//*******************************************************************************

//*******************************************************************************
//* PFour namespace - contains information about the current project.
//*******************************************************************************
var PFour = {


      // Target animation control variables.
      animating : false,
      targetDir : 'R',
      currTargetTrans : 0,
      targetStepSize : 0.005,

      currentStep : 0,

      // Camera pan control variables.
      zoomFactor : 2,
      translateX : 0,
      translateY : 0,

      // Camera rotate control variables.
      phi : 1,
      theta : 0.5,
      radius : 1,
      dr : 5.0 * Math.PI/180.0,

      // Mouse control variables - check AttachHandlers() to see how they're used.
      mouseDownRight : false,
      mouseDownLeft : false,

      mousePosOnClickX : 0,
      mousePosOnClickY : 0

  };

  // Load a new texture
  function loadNewTexture(whichTex){
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

      gl.activeTexture(gl.TEXTURE0 + whichTex);
      gl.bindTexture(gl.TEXTURE_2D, textures[whichTex]);

      gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, textures[whichTex].image );
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
  }


  // Setup the new image object prior to loading to the shaders
  function openNewTexture(imageSRC){
      var i = textures.length;
  	textures[i] = gl.createTexture();
      textures[i].image = new Image();

      textures[i].image.onload = function() {
          loadNewTexture(i);
      }
      textures[i].image.crossOrigin = "Anonymous"; // Added to prevent the cross-origin issue
      textures[i].image.src=imageSRC;
  }


//*******************************************************************************
//* Called when the window is loaded. Sets up WebGL, generates the points
//* (see generatepoints.js), and starts the update loop.
//*******************************************************************************
window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // See generatepoints.js for function definition.
    GeneratePoints();
  //  Initialize_Textures();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.3, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //*******************************************************************************
    //* Create the shader program and set up the variables in the shaders and
    //* on the buffers.
    //*******************************************************************************
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    // Textures
  	var textureBuffer = gl.createBuffer();
  	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
  	gl.bufferData(gl.ARRAY_BUFFER, flatten(textureCoordsArray), gl.STATIC_DRAW);

  	var vTextureCoord = gl.getAttribLocation( program, "vTextureCoord" );
    gl.vertexAttribPointer( vTextureCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTextureCoord );



    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc= gl.getUniformLocation(program, "projectionMatrix");

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
       flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
       flatten(lightPosition) );

    gl.uniform1f(gl.getUniformLocation(program,
       "shininess"),materialShininess);

    //*******************************************************************************
    //* End shader program setup
    //*******************************************************************************
    // Load Textures.
      openNewTexture("grass.jpg");
  	  openNewTexture("Shingles.jpg");
      openNewTexture("stonewall1.jpg");
      openNewTexture("wood.jpg");
  // Attach the handlers to the document/canvas.
  AttachHandlers();

    Update();
}

//*******************************************************************************
//* This is constantly called and
//*******************************************************************************
function Update() {

    // Animates the target.
    if(PFour.animating) {

        if(PFour.targetDir == 'R'){
            if(PFour.currTargetTrans < .5)
                PFour.currTargetTrans += PFour.targetStepSize;
            else{
                PFour.currTargetTrans -= PFour.targetStepSize;
                PFour.targetDir = 'L';
            }
        }
        else{
            if(PFour.currTargetTrans > -1)
                PFour.currTargetTrans -= PFour.targetStepSize;
            else{
                PFour.currTargetTrans += PFour.targetStepSize;
                PFour.targetDir = 'R';
            }
        }
    }

    Render();
    requestAnimFrame(Update);
}


//*******************************************************************************
//* Call the functions we need to draw each object in the scene.
//*******************************************************************************
function Render() {
  var x = -3.5;
  var z = -2.5;

    gl.clear( gl.COLOR_BUFFER_BIT );

    // Setup the projection matrix.
    projectionMatrix = ortho( x_min*PFour.zoomFactor - PFour.translateX,
                              x_max*PFour.zoomFactor - PFour.translateX,
                              y_min*PFour.zoomFactor - PFour.translateY,
                              y_max*PFour.zoomFactor - PFour.translateY,
                              near, far);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    // Setup the initial model-view matrix.
    eye = vec3( PFour.radius*Math.cos(PFour.phi),
                PFour.radius*Math.sin(PFour.theta),
                PFour.radius*Math.sin(PFour.phi));
    modelViewMatrix = lookAt(eye, at, up);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));



  // ROOM
//gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
    DrawGround();

   // Make the walls of the keep
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0, -2, 6));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawWall();
    modelViewMatrix = modelViewStack.pop();

//gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);

    // Draw Keep Gate
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0, PFour.currTargetTrans - 2.15, 5.5));
    modelViewMatrix = mult(modelViewMatrix, scale4(1, 1.6, .1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("woodcube");
    modelViewMatrix = modelViewStack.pop()

    // Draw Keep DrawBanners
    DrawBanners();

    // Draw Front Keep Battlements
    for(var i = 0; i < 8; i++)
    {
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(x, 0, 5.7));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .1, .1))
    DrawBattlements();
    modelViewMatrix = modelViewStack.pop()
    x++;
    }

    // Draw Right Keep Battlements
    for(var i = 0; i < 8; i++)
    {
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(4.7, 0, z));
    modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 1, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .1, .1))
    DrawBattlements();
    modelViewMatrix = modelViewStack.pop()
    z++;
    }

    // Draw Left Keep Battlements
    for(var i = 0; i < 8; i++)
    {
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-4.7, 0, z - 1));
    modelViewMatrix = mult(modelViewMatrix, rotate(-90, 0, 1, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .1, .1))
    DrawBattlements();
    modelViewMatrix = modelViewStack.pop()
    z--;
    }

    // Draw Rear Keep Battlements
    for(var i = 0; i < 8; i++)
    {
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(x - 1, 0, -3.7));
    modelViewMatrix = mult(modelViewMatrix, rotate(180, 0, 1, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .1, .1))
    DrawBattlements();
    modelViewMatrix = modelViewStack.pop()
    x--;
    }

    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-1,0,-1.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawCastle();
    modelViewMatrix = modelViewStack.pop()


    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-1, -3.25, .25));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    DrawStairs();
    modelViewMatrix = modelViewStack.pop();

   modelViewStack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, translate(5, 4, -4));
   modelViewMatrix = mult(modelViewMatrix, rotate(180,180,0,0));
   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
   Scene.DrawObject("flagpole");
   modelViewMatrix = modelViewStack.pop();

   modelViewStack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, translate(-5, 4, -4));
   modelViewMatrix = mult(modelViewMatrix, rotate(180,180,0,0));
   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
   Scene.DrawObject("flagpole");
   modelViewMatrix = modelViewStack.pop();

   modelViewStack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, translate(5, 4, 6));
   modelViewMatrix = mult(modelViewMatrix, rotate(180,180,0,0));
   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
   Scene.DrawObject("flagpole");
   modelViewMatrix = modelViewStack.pop();

   modelViewStack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, translate(-5, 4, 6));
   modelViewMatrix = mult(modelViewMatrix, rotate(180,180,0,0));
   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
   Scene.DrawObject("flagpole");
   modelViewMatrix = modelViewStack.pop();

   modelViewStack.push(modelViewMatrix);
  // modelViewMatrix = mult(modelViewMatrix, rotate(0, 0, 0, 0));
   modelViewMatrix = mult(modelViewMatrix, translate(2.6,-3.25,-3.5));
   modelViewMatrix = mult(modelViewMatrix, rotate(180,0,1,1));
   modelViewMatrix = mult(modelViewMatrix, scale4(.5, .5, .5))
   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
   Scene.DrawObject("stable");
   modelViewMatrix = modelViewStack.pop();

   modelViewStack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, translate(2.6,-3.5,-3.0));
   modelViewMatrix = mult(modelViewMatrix, scale4(1.95, .5, 2));
   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
   Scene.DrawObject("woodcube");
   modelViewMatrix = modelViewStack.pop();



}

//*******************************************************************************
//* Sets all of the event handlers onto the document/canvas.
//*******************************************************************************
function AttachHandlers() {

    // Create a new Audio object for the sound effect
    const sound = new Audio('sound-effect.mp3');
    // Set a flag to track the sound effect state
    let isPlaying = false;
    // These four just set the handlers for the buttons.
    document.getElementById("thetaup").addEventListener("click", function(e) {
        PFour.theta += PFour.dr;
    });
    document.getElementById("thetadown").addEventListener("click", function(e) {
        PFour.theta -= PFour.dr;
    });
    document.getElementById("phiup").addEventListener("click", function(e) {
        PFour.phi += PFour.dr;
    });
    document.getElementById("phidown").addEventListener("click", function(e) {
        PFour.phi -= PFour.dr;
    });

    // Set the scroll wheel to change the zoom factor.
    document.getElementById("gl-canvas").addEventListener("wheel", function(e) {
        if (e.wheelDelta > 0) {
            PFour.zoomFactor = Math.max(0.1, PFour.zoomFactor - 0.3);
        } else {
            PFour.zoomFactor += 0.3;
        }
    });

    //************************************************************************************
    //* When you click a mouse button, set it so that only that button is seen as
    //* pressed in PFour. Then set the position. The idea behind this and the mousemove
    //* event handler's functionality is that each update we see how much the mouse moved
    //* and adjust the camera value by that amount.
    //************************************************************************************
    document.getElementById("gl-canvas").addEventListener("mousedown", function(e) {
        if (e.which == 1) {
            PFour.mouseDownLeft = true;
            PFour.mouseDownRight = false;
            PFour.mousePosOnClickY = e.y;
            PFour.mousePosOnClickX = e.x;
        } else if (e.which == 3) {
            PFour.mouseDownRight = true;
            PFour.mouseDownLeft = false;
            PFour.mousePosOnClickY = e.y;
            PFour.mousePosOnClickX = e.x;
        }
    });

    document.addEventListener("mouseup", function(e) {
        PFour.mouseDownLeft = false;
        PFour.mouseDownRight = false;
    });
    window.addEventListener("keydown", function(){
      var key = String.fromCharCode(event.keyCode)
        if(key == 'w'){
          if(walls == 1){
            walls = 0;
            }
            else {
              walls = 1;
            }
            render();
      }
    });
    window.addEventListener("keydown", function(){
      var key = String.fromCharCode(event.keyCode)
      if(key == 'c'){
        if (castle == 1){
        castle = 0;
        }
        else {
        castle = 1;
        }
        render();
      }
    });

    document.addEventListener("mousemove", function(e) {
        if (PFour.mouseDownRight) {
            PFour.translateX += (e.x - PFour.mousePosOnClickX)/30;
            PFour.mousePosOnClickX = e.x;

            PFour.translateY -= (e.y - PFour.mousePosOnClickY)/30;
            PFour.mousePosOnClickY = e.y;
        } else if (PFour.mouseDownLeft) {
            PFour.phi += (e.x - PFour.mousePosOnClickX)/100;
            PFour.mousePosOnClickX = e.x;

            PFour.theta += (e.y - PFour.mousePosOnClickY)/100;
            PFour.mousePosOnClickY = e.y;
        }
    });
    // If you press 'a', start or end animation.
        document.addEventListener("keypress", function(e) {
            if (e.keyCode == 97 || e.keyCode == 65) {
                PFour.animating = !PFour.animating;
                if (isPlaying) {
                  // Stop the sound effect if it was playing
                  sound.pause();
                } else {
                  // Play the sound effect if it was not playing
                  sound.play();
                }
                // Update the flag to track the new sound effect state
                isPlaying = !isPlaying;
            }
        });
        // Listen for a keypress event on the document
        document.addEventListener("keypress", function(e) {
        // If the pressed key is "B", reset the scene to the original viewing angle and position
        if (e.keyCode == 98 || e.keyCode == 66 ) {
        PFour.translateX = 0;
        PFour.translateY = 0;
        PFour.zoomFactor = 2;
        PFour.translateFactorX = 0.2;
        PFour.translateFactorY = 0.2;
        PFour.phi = 1;
        PFour.theta = 0.5;
        PFour.radius = 1;
        }
        });

    // If you press 'a', start or end animation.
  /*  document.addEventListener("keypress", function(e) {
        if (e.keyCode == 97) {
            PFour.animating = !PFour.animating;
        }
    });*/
}

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}

function DrawCastle(){
  // TEMPORARY KEEP PLACE HOLDER
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(0, -2, 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(3, 4, 3));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  Scene.DrawObject("cube");
  modelViewMatrix = modelViewStack.pop();

  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(0, 0.5, 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(2, 2, 1.5));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  Scene.DrawObject("cube");
  modelViewMatrix = modelViewStack.pop();

  // EXAMPLE OF KEEP ROOF MESH OBJECT
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(0, 2, 0.25));
  modelViewMatrix = mult(modelViewMatrix, rotate(180, 0, 1, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  Scene.DrawObject("keeproof");
  modelViewMatrix = modelViewStack.pop();



  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(1.6, -4, 1.6));
  modelViewMatrix = mult(modelViewMatrix, scale4(1, 7, 1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  Scene.DrawObject("cylinder");
  modelViewMatrix = modelViewStack.pop();

  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(1.6, -4, 1.6));
  modelViewMatrix = mult(modelViewMatrix, scale4(1.25, 6, 1.25));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
  Scene.DrawObject("cone");
  modelViewMatrix = modelViewStack.pop();

  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(-1.6, -4, 1.6));
  modelViewMatrix = mult(modelViewMatrix, scale4(1, 7, 1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  Scene.DrawObject("cylinder");
  modelViewMatrix = modelViewStack.pop();

  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(-1.6, -4, 1.6));
  modelViewMatrix = mult(modelViewMatrix, scale4(1.25, 6, 1.25));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
  Scene.DrawObject("cone");
  modelViewMatrix = modelViewStack.pop();

  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(1.6, -4, -1.6));
  modelViewMatrix = mult(modelViewMatrix, scale4(1, 7, 1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  Scene.DrawObject("cylinder");
  modelViewMatrix = modelViewStack.pop();

  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(1.6, -4, -1.6));
  modelViewMatrix = mult(modelViewMatrix, scale4(1.25, 6, 1.25));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
  Scene.DrawObject("cone");
  modelViewMatrix = modelViewStack.pop();

  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(-1.6, -4, -1.6));
  modelViewMatrix = mult(modelViewMatrix, scale4(1, 7, 1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  Scene.DrawObject("cylinder");
  modelViewMatrix = modelViewStack.pop();

  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(-1.6, -4, -1.6));
  modelViewMatrix = mult(modelViewMatrix, scale4(1.25, 6, 1.25));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
  Scene.DrawObject("cone");
  modelViewMatrix = modelViewStack.pop();

};

function DrawStairs(){
  //First railing
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, scale4(-.15, 1.05, 1.05));
  modelViewMatrix = mult(modelViewMatrix, translate(-1.43, 0, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  Scene.DrawObject("stairPoly");
  modelViewMatrix = modelViewStack.pop();

  //actual stairs
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(0, -.04, -.014));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  Scene.DrawObject("stairPoly");
  modelViewMatrix = modelViewStack.pop();
  //second railing
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, scale4(-.15, 1.05, 1.05));
  modelViewMatrix = mult(modelViewMatrix, translate(1.43, 0, 0));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  Scene.DrawObject("stairPoly");
  modelViewMatrix = modelViewStack.pop();
}
function DrawBattlements()
{
  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(2.5, 0, 10));
  modelViewMatrix = mult(modelViewMatrix, scale4(3, 4, 1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  Scene.DrawObject("cube");
  modelViewMatrix = modelViewStack.pop();

  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(-2.5, 0, 10));
  modelViewMatrix = mult(modelViewMatrix, scale4(3, 4, 1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  Scene.DrawObject("cube");
  modelViewMatrix = modelViewStack.pop();

  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(0, -1, 10));
  modelViewMatrix = mult(modelViewMatrix, scale4(2, 2, 1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  Scene.DrawObject("battlement");
  modelViewMatrix = modelViewStack.pop();

  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(2.5, -1.5, 9));
  modelViewMatrix = mult(modelViewMatrix, rotate(90, 90, 1, 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(3, 2, 1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  Scene.DrawObject("cube");
  modelViewMatrix = modelViewStack.pop();

  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(-2.5, -1.5, 9));
  modelViewMatrix = mult(modelViewMatrix, rotate(90, 90, 1, 0));
  modelViewMatrix = mult(modelViewMatrix, scale4(3, 2, 1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  Scene.DrawObject("cube");
  modelViewMatrix = modelViewStack.pop();
}

function DrawWall(){
    // Main Walls
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(2.5, 0, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(4, 4, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("cube");
    modelViewMatrix = modelViewStack.pop();

    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-2.5, 0, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(4, 4, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("cube");
    modelViewMatrix = modelViewStack.pop();

    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0, .75, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(1, 2.5, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("cube");
    modelViewMatrix = modelViewStack.pop();

    // Other walls
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0, 0, -10));
    modelViewMatrix = mult(modelViewMatrix, scale4(12, 4, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("cube");
    modelViewMatrix = modelViewStack.pop();

    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-5, 0, -5));
    modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 1, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(12, 4, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("cube");
    modelViewMatrix = modelViewStack.pop();

    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(5, 0, -5));
    modelViewMatrix = mult(modelViewMatrix, rotate(90, 0, 1, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(12, 4, 1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("cube");
    modelViewMatrix = modelViewStack.pop();

    // Four Towers
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(5, -2, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(2.5, 6, 2.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("cylinder");
    modelViewMatrix = modelViewStack.pop();

    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(5, -2, -10));
    modelViewMatrix = mult(modelViewMatrix, scale4(2.5, 6, 2.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("cylinder");
    modelViewMatrix = modelViewStack.pop();

    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-5, -2, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(2.5, 6, 2.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("cylinder");
    modelViewMatrix = modelViewStack.pop();

    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-5, -2, -10));
    modelViewMatrix = mult(modelViewMatrix, scale4(2.5, 6, 2.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("cylinder");
    modelViewMatrix = modelViewStack.pop();

    // Tower Toppers
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-5, -2, -10));
    modelViewMatrix = mult(modelViewMatrix, scale4(3, 5, 3));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("cone");
    modelViewMatrix = modelViewStack.pop();

    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(5, -2, -10));
    modelViewMatrix = mult(modelViewMatrix, scale4(3, 5, 3));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("cone");
    modelViewMatrix = modelViewStack.pop();

    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(5, -2, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(3, 5, 3));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("cone");
    modelViewMatrix = modelViewStack.pop();

    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-5, -2, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(3, 5, 3));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("cone");
    modelViewMatrix = modelViewStack.pop();

    // Wall Gate
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(1, -1, .7));
    modelViewMatrix = mult(modelViewMatrix, scale4(1, 2, 2));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("cube");
    modelViewMatrix = modelViewStack.pop();

    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-1, -1, .7));
    modelViewMatrix = mult(modelViewMatrix, scale4(1, 2, 2));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("cube");
    modelViewMatrix = modelViewStack.pop()



}

function DrawGround(){
  // Main Grass Block
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0, -5.5, 1));
    modelViewMatrix = mult(modelViewMatrix, scale4(15, 3, 15));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("darkcube");
    modelViewMatrix = modelViewStack.pop();

    // Right Ground Mote
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(9, -5.5, 1));
    modelViewMatrix = mult(modelViewMatrix, scale4(3, .25, 15));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("water");
    modelViewMatrix = modelViewStack.pop();

    // Left Ground Mote
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-9, -5.5, 1));
    modelViewMatrix = mult(modelViewMatrix, scale4(3, .25, 15));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("water");
    modelViewMatrix = modelViewStack.pop();

    // Front Ground Mote
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0, -5.5, 10));
    modelViewMatrix = mult(modelViewMatrix, scale4(21, .25, 3));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("water");
    modelViewMatrix = modelViewStack.pop();

    // Rear Ground Mote
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0, -5.5, -7.5));
    modelViewMatrix = mult(modelViewMatrix, scale4(21, .25, 3));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("water");
    modelViewMatrix = modelViewStack.pop();

    // Front Grass Block
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0, -5.5, 14));
    modelViewMatrix = mult(modelViewMatrix, scale4(21, 3, 5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("darkcube");
    modelViewMatrix = modelViewStack.pop();

    // Rear Grass Block
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0, -5.5, -11.5));
    modelViewMatrix = mult(modelViewMatrix, scale4(21, 3, 5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("darkcube");
    modelViewMatrix = modelViewStack.pop();

    // Right Grass Block
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(13, -5.5, 1.25));
    modelViewMatrix = mult(modelViewMatrix, scale4(5, 3, 30.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("darkcube");
    modelViewMatrix = modelViewStack.pop()

    // Left Grass Block
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-13, -5.5, 1.25));
    modelViewMatrix = mult(modelViewMatrix, scale4(5, 3, 30.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("darkcube");
    modelViewMatrix = modelViewStack.pop()

    // Front Bridge
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0, -4, 10));
    modelViewMatrix = mult(modelViewMatrix, scale4(2, .1, 3.1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("woodcube");
    modelViewMatrix = modelViewStack.pop();

    // Bridge Left Rail

    // Bottom Rail Bar
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(1, -3.95, 10));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .1, 3.1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("woodcube");
    modelViewMatrix = modelViewStack.pop();

    // Top Rail Bar
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(1, -3.75, 10));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .1, 3.1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("woodcube");
    modelViewMatrix = modelViewStack.pop();

    // Rail Post
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(1, -3.75, 10));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .3, .1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("woodcube");
    modelViewMatrix = modelViewStack.pop();

    // Rail Post
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(1, -3.75, 11));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .3, .1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("woodcube");
    modelViewMatrix = modelViewStack.pop();

    // Rail Post
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(1, -3.75, 9));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .3, .1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("woodcube");
    modelViewMatrix = modelViewStack.pop();

    // Rail Post
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(1, -3.75, 11));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .3, .1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("woodcube");
    modelViewMatrix = modelViewStack.pop();

    // Rail Post
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(1, -3.75, 9));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .3, .1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("woodcube");
    modelViewMatrix = modelViewStack.pop();

    // Rail Post
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(1, -3.85, 11.6));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .5, .1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("woodcube");
    modelViewMatrix = modelViewStack.pop();

    // Rail Post
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(1, -3.85, 8.5));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .5, .1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("woodcube");
    modelViewMatrix = modelViewStack.pop();


    // Bridge Right Rail

    // Bottom Rail Bar
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-1, -3.95, 10));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .1, 3.1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("woodcube");
    modelViewMatrix = modelViewStack.pop();

    // Top Rail Bar
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-1, -3.75, 10));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .1, 3.1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("woodcube");
    modelViewMatrix = modelViewStack.pop();

    // Rail Post
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-1, -3.75, 10));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .3, .1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("woodcube");
    modelViewMatrix = modelViewStack.pop();

    // Rail Post
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-1, -3.75, 11));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .3, .1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("woodcube");
    modelViewMatrix = modelViewStack.pop();

    // Rail Post
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-1, -3.75, 9));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .3, .1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("woodcube");
    modelViewMatrix = modelViewStack.pop();

    // Rail Post
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-1, -3.75, 11));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .3, .1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("woodcube");
    modelViewMatrix = modelViewStack.pop();

    // Rail Post
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-1, -3.75, 9));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .3, .1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("woodcube");
    modelViewMatrix = modelViewStack.pop();

    // Rail Post
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-1, -3.85, 11.6));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .5, .1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("woodcube");
    modelViewMatrix = modelViewStack.pop();

    // Rail Post
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-1, -3.85, 8.5));
    modelViewMatrix = mult(modelViewMatrix, scale4(.1, .5, .1));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("woodcube");
    modelViewMatrix = modelViewStack.pop();

    // Bottom of Grass
    modelViewStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(0, -7, 1.25));
    modelViewMatrix = mult(modelViewMatrix, scale4(31, .25, 30.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    Scene.DrawObject("darkcube");
    modelViewMatrix = modelViewStack.pop();
}

function DrawBanners(){

  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(2, -1, 5.51));
  modelViewMatrix = mult(modelViewMatrix, scale4(.7, 1.7, 1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  Scene.DrawObject("banner");
  modelViewMatrix = modelViewStack.pop();

  modelViewStack.push(modelViewMatrix);
  modelViewMatrix = mult(modelViewMatrix, translate(-2, -1, 5.51));
  modelViewMatrix = mult(modelViewMatrix, scale4(.7, 1.7, 1));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  Scene.DrawObject("banner");
  modelViewMatrix = modelViewStack.pop();
}
