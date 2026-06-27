varying vec3 vPosition;
varying float vPhase;
varying float vAmplitude;

uniform float time;
uniform float angularValue;
uniform float microShift;
uniform vec3 baseColor;

void main() {
    // Calculate distance from center for radial effects
    float distance = length(vPosition.xz);
    
    // Create pulsing effect based on phase
    float pulse = sin(time * 3.0 + vPhase) * 0.5 + 0.5;
    
    // Micro-shift color influence
    float microInfluence = microShift * 1000000.0;
    vec3 microColor = vec3(microInfluence * 0.5, 0.0, microInfluence * 0.3);
    
    // Angular value color influence
    float angularInfluence = sin(radians(angularValue) + time) * 0.5 + 0.5;
    vec3 angularColor = vec3(angularInfluence * 0.3, angularInfluence * 0.6, 1.0);
    
    // Combine colors
    vec3 finalColor = baseColor + microColor + angularColor * 0.5;
    finalColor *= pulse * vAmplitude;
    
    // Add transparency based on distance and phase
    float alpha = (1.0 - distance * 0.3) * (pulse * 0.5 + 0.5);
    
    gl_FragColor = vec4(finalColor, alpha);
}
