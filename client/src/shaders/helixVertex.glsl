attribute float phase;
attribute float amplitude;
varying vec3 vPosition;
varying float vPhase;
varying float vAmplitude;

uniform float time;
uniform float angularValue;
uniform float microShift;

void main() {
    vPosition = position;
    vPhase = phase;
    vAmplitude = amplitude;
    
    vec3 pos = position;
    
    // Apply helical transformation
    float helixAngle = pos.y * 0.5 + time * 0.5 + phase;
    float radius = length(pos.xz);
    
    // Calculate micro-shift influence
    float microInfluence = microShift * 1000000.0;
    float shiftFactor = sin(time * 10.0 + phase) * microInfluence * 0.1;
    
    // Apply angular value influence
    float angularInfluence = sin(radians(angularValue) + time + phase) * 0.1;
    
    // Modify position based on helix and influences
    pos.x = cos(helixAngle) * (radius + shiftFactor + angularInfluence);
    pos.z = sin(helixAngle) * (radius + shiftFactor + angularInfluence);
    pos.y += sin(time * 2.0 + phase) * amplitude * 0.1;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
