#version 300 es
precision mediump float;
in vec4 vPosition;

out vec4 frag_color;

const float PI = 3.14159265359;

uniform sampler2D colorTex; //color texture - rgb: color | a: metalness
uniform sampler2D normalTex; //normal texture - rgb: normal | a: Empty
uniform sampler2D posTex; //position texture - rgb: position | a: roughness

uniform samplerCube shadowCube;

//world space camera position, to get view vector
uniform vec3 cameraPos;
uniform vec3 uLightColor;
uniform vec3 uLightPosition;
uniform vec3 uLightDirection;
uniform float uLightRange;
uniform float uLightSize;
uniform vec2 uScreenSize;
uniform mat4 uShadow_Matrix;

uniform float uFarDepth;

float GGX_Visibility(float dotProduct, float k) {
	//return 2.0 / (dotProduct + sqrt(k*k + (1.0 - k*k)*dotProduct*dotProduct)); //More accurate, but slower version

	k=k/2.0;
	return 1.0 / (dotProduct * (1.0 - k) + k);
}

float GGX_D(float dotNH, float a) {
	a = clamp(a, 0.001, 1.0); //prevent a (and a2) from being too close to zero
	float a2 = a*a;
	float bot = (dotNH * dotNH * (a2 - 1.0) + 1.0);
	return (a2) / (PI * bot * bot);
}

vec3 SpecularBRDF(vec3 lightColor, vec3 normal, vec3 view, vec3 lightDir, float a, vec3 F0, float d) {
		vec3 halfVec = normalize(view + lightDir);
		
		float dotNL = clamp(dot(normal, lightDir), 0.0, 1.0);

		float dotNV = clamp(dot(normal, view), 0.0, 1.0);
		float dotLH = clamp(dot(lightDir, halfVec), 0.0, 1.0);

		vec3 F = F0 + (vec3(1.0,1.0,1.0)-F0) * pow(1.0-dotLH, 5.0);

		float k = clamp(a+.36, 0.0, 1.0);
		float G = GGX_Visibility(dotNV, k) * GGX_Visibility(dotNL, k);

		return F * lightColor * (G * dotNL);
}

const vec2 poissonDisk[4] = vec2[](
   vec2( -0.94201624, -0.39906216 ),
   vec2( 0.94558609, -0.76890725 ),
   vec2( -0.094184101, -0.92938870 ),
   vec2( 0.34495938, 0.29387760 )
 );


//Method from https://gamedev.stackexchange.com/questions/56897/glsl-light-attenuation-color-and-intensity-formula
float pointAttenuation(float distance) {
    float ratio = (distance / uLightRange);
    //TODO should inner value be squared?
    float retVal = clamp(1.0 - ratio * ratio, 0.0, 1.0);
    return retVal * retVal;
}


float textureShadowCube(float posZ, vec3 dir) {
    float shadowDist = texture(shadowCube, normalize(dir)).r;
    return step(posZ, shadowDist);
}

void main () {
  vec2 screenTexCoord = gl_FragCoord.xy / uScreenSize;
  vec4 albedo = texture(colorTex, screenTexCoord);
  if(albedo.xyz == vec3(0.0)) discard; //TODO does this actually provide a performance boost?
  vec4 pos = texture(posTex, screenTexCoord);
  vec4 normal = texture(normalTex, screenTexCoord);
  vec3 mat = vec3(albedo.a, pos.w, normal.w);

  normal.xyz = normal.xyz * 2.0 - 1.0;

  vec3 view = normalize(cameraPos - pos.xyz);


  mat.y += 0.0001; //there seem to be issues with roughness = 0 due to visibility
  float a = sqrt(mat.y);// squaring it makes everything shiny, sqrting it looks like linear roughness

  //F0 is essentially specular color, as well as Fresnel term
  vec3 F0 = vec3(1,1,1) * 0.02777777777;//pow((1.0 - IOR) / (1.0 + IOR), 2.0);
  F0 = mix(F0, albedo.rgb, mat.r); //interpolate Fresnel with the color as metalness increases (with metalness=1, color => reflection color)
  F0 = mix(vec3(1,1,1) * dot(vec3(.33,.33,.33),F0), F0, mat.r); //my own improvement - could be wrong : desaturates Fresnel as metalness decreases

	  vec3 lightDir;
	  float lightDist;
	  float shadow = 1.0;
      lightDir = uLightPosition - pos.xyz;
      lightDist = length(lightDir);

      float ldist = lightDist/uFarDepth;
      ldist -= max(0.01 * (1.0 - clamp(dot(normal.xyz, lightDir), 0.0, 1.0)), 0.01);
      //ldist = min(ldist, 0.9999);

      shadow = 1.0;
/*	  for(int i = 0; i < 4; i++) {
        vec3 offset = vec3(poissonDisk[i] * (ldist * uFarDepth / 2000.0), 0.0);
        vec3 dir = normalize(-lightDir);
        vec3 right = cross((dir + vec3(0.001, 0, 0)), vec3(0,1,0));
        vec3 up = cross(right, dir);

        int x =0; int y = 0;
        vec3 uv = dir + right * (offset.x + float(x)/100.0) + up * (offset.y + float(y) / 100.0);

        shadow += textureShadowCube(ldist,  uv );
      }
      shadow /= 4.0;
*/

      frag_color = vec4(uLightColor, 1.0);
      return;
}