// Define the parameters for the sine wave
const amplitude = 1;  // Amplitude of the wave
const frequency = 1;  // Frequency of the wave (cycles per second)
const phaseShift = 0; // Phase shift (in radians)

// Function to calculate y(t)
function sineWave(t) {
    return amplitude * Math.sin(2 * Math.PI * frequency * t + phaseShift);
}

// Example usage
let time = 0; // Starting time
const interval = 100; // Interval in milliseconds (e.g., 100ms for 10 updates per second)

setInterval(() => {
    time += interval / 1000; // Convert milliseconds to seconds
    let value = sineWave(time);
    console.log(`Time: ${time} seconds, Value: ${value}`);
}, interval);