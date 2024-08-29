import {
  quickCreateWebGLProgram,
  updateUniformTime,
  enableMouseEvents,
  updateUniformResolution,
  enableCanvasWindowResizeEvents,
} from "./scripts/webgl.js";
import {
  stars_fragment_shader,
  vertex_shader_source,
  // fragment_shader_source,
} from "./scripts/shaders.js";

async function run() {
  // Create WebGL program & context
  const [canvas, gl, program] = quickCreateWebGLProgram(
    "canvas",
    vertex_shader_source,
    // fragment_shader_source,
    stars_fragment_shader,
  );
  // Quit if something went wrong
  if (!canvas || !gl || !program) {
    return null;
  }

  // Initialize Uniforms
  updateUniforms(gl, program);

  // Enable listeners
  enableListeners(gl, program);

  // Kick off the render
  renderLoop(gl, program);
}

// Convenience function, groups all uniforms together
function updateUniforms(gl, program) {
  updateUniformTime(gl, program);
  updateUniformResolution(gl, program);
}

function enableListeners(gl, program) {
  // Initialize key event handlers
  enableKeyboardEvents();
  // Sets a uniform that moves the light with the mouse
  enableMouseEvents(gl, program);
  // Reset the view, canvas size, and perform the call back on resize
  enableCanvasWindowResizeEvents(gl, program, "resolution", () => {
    draw(gl);
  });
}

function enableKeyboardEvents() {
  window.addEventListener("keydown", onKeyDown);
}

// Handles keyboard input
let onKeyDown = function (event) {
  if (event.key == " ") {
    paused = !paused;
  }
};

let paused = false;
// Timestamp of when the simulation began
let start_time = Date.now();
function renderLoop(gl, program) {
  let current_time = Date.now();
  let time_elapsed = current_time - start_time;
  updateUniformTime(gl, program, time_elapsed);

  updateUniformResolution(gl, program);

  // Redraw the frame
  draw(gl);

  // Call ourselves again
  requestAnimationFrame(() => {
    renderLoop(gl, program);
  });
}

function draw(gl) {
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

// Let the show begin!
run();
