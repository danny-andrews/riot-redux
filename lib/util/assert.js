export default function(thingToBeTruthy, message) {
  if(!thingToBeTruthy) {
    throw new Error(message);
  }
}
