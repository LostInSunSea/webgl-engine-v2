#version 300 es
precision mediump float;

in vec4 vPosition;
uniform vec3 uLightPosition;

void main()
{
    float bias = 0.0001;
    gl_FragDepth = gl_FragCoord.z + bias;
}
