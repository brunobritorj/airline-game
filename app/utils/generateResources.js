import { ObjectId } from "mongodb";

export default function generateAircrafts(number, priceModifier = null) {

  const availablePriceModifiers = [];
  for (let i = 95; i <= 105; i++) { availablePriceModifiers.push(i); }

  // Set the available models
  const availableModels = [
    { pn: "P", range: 3000, passengers: 100, basePrice: 50000000 },
    { pn: "M", range: 6000, passengers: 150, basePrice: 100000000 },
    { pn: "G", range: 9000, passengers: 200, basePrice: 150000000 },
    { pn: "X", range: 12000, passengers: 250, basePrice: 200000000 }
  ]
  
  // Initialize an empty array
  let aircrafts = []  

  // Loop through the number of aircrafts
  for (let i = 0; i < number; i++) {

    // Pick a random model
    let model = availableModels[Math.floor(Math.random() * availableModels.length)]

    // Generate a random ID for the aircraft
    let id = new ObjectId()

    // If no priceModifier is supplied, a random number beteen 95(%) and 105(%) will be selected
    let price;
    if (priceModifier === null) {
      let randomNumber = availablePriceModifiers[Math.floor(Math.random() * availablePriceModifiers.length)]
      price = model.basePrice * randomNumber / 100;
      console.log(randomNumber);
    } else {
      price = model.basePrice * priceModifier / 100;
    }

    // Generate the aircraft registration based on the letter of the model + last 4 digits of the ID
    let registration = model.pn[0] + '-' + id.toString().slice(-4)
    
    // Add the aircraft to the array
    aircrafts.push({
      _id: id,
      model: model.pn,
      registration: registration.toUpperCase(),
      range: model.range,
      passengers: model.passengers,
      price: price,
      airline: null
    })

  }
  return aircrafts;
}
