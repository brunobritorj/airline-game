function calcOperationalCost(flightDistance, aircraftRange, aircraftCostBasePricePerKm) {

    if (flightDistance > aircraftRange) {
        return "Error: flight distance is greater than aircraft range"
    }

    // Calcula a distância relativa em relação à capacidade máxima da aeronave
    const distanceRatio = flightDistance / aircraftRange;
  
    // Ajusta o fator de curvatura (para tornar a relação não linear)
    const curvatureFactor = 5;
  
    // Calcula o custo operacional por KM com base na distância relativa
    const costPerKm = aircraftCostBasePricePerKm * (1 + curvatureFactor - Math.pow(distanceRatio, curvatureFactor));

    const aircraftInitialCost = aircraftCostBasePricePerKm * 10000
  
    // Calcula o custo operacional total
    const totalCost = aircraftInitialCost + costPerKm * flightDistance;
  
    return Number(totalCost.toFixed(2));
}
  
function calcTicketPrice(valueSrcAirport, valueDstAirport, flightDistance, availableSeats){

    demmand = (valueSrcAirport + valueDstAirport) / 1000000;
    ratio = demmand / availableSeats;
    ticketPrice = (flightDistance / 10) * ratio * 3;

    return Number(ticketPrice.toFixed(2));
}

function calcMonthlyFlightProfit(
    totalPassengers=50,
    flightDistance=1000,
    aircraftRange=1000,
    aircraftCostBasePricePerKm=1
    ){

    const ticketPrice = calcTicketPrice(valueSrcAirport=300000000, valueDstAirport=300000000, distance=flightDistance, availableSeats=totalPassengers);
    const operationalCost = calcOperationalCost(flightDistance=flightDistance, aircraftRange=aircraftRange, aircraftCostBasePricePerKm=aircraftCostBasePricePerKm);

    console.log(`Preco do ticket: ${ticketPrice}`);
    console.log(`Faturamento do voo: ${totalPassengers * ticketPrice}`);
    console.log(`Custo do voo: ${operationalCost}`);

    flightProfit = (totalPassengers * ticketPrice) - operationalCost;

    console.log(`Lucro do voo: ${flightProfit}`);

    montlyFlightProfit = flightProfit * 30

    return Number(montlyFlightProfit.toFixed(2));
}

console.log(calcMonthlyFlightProfit());