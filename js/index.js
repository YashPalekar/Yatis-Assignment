// --------------------------------------
const api = "https://api.yatis.io/api/getBatteryInfo";

const accessToken = "put access key";

let data = ""; // data for scatterplot

// device ID : FM357544373242888
//-------------------------------------

//
//Event Listener on fetch button
//
document.getElementById("fetch-data").addEventListener("click", function () {
  const deviceId = document.getElementById("device-id").value;
  const startDate = new Date(document.getElementById("start-date").value)
    .toLocaleDateString()
    .replace("/", "-");

  const endDate = new Date(document.getElementById("end-date").value)
    .toLocaleDateString()
    .replace("/", "-");

  const str = `${api}/?deviceId=${deviceId}&api_access_token=${accessToken}&startDate=${startDate}&endDate=${endDate}`;

  data = fetchData(str);

  // console.log({ startDate, endDate });
});


//
//Function to fetch data from api and store the required data
//
async function fetchData(apiEndpoint) {
  const response = await fetch(apiEndpoint);
  const tempData = await response.json();
  data = await tempData.batteryInfo.map((obj) => {
    return [obj.dts, obj.ebv];
  });
  console.log(data);
  plotGraph(data);
}

// -------------------------
// D3 Scatterplot
//

// setting margin
function plotGraph(graphData) {
  const svg = d3.select("svg");
  const margin = 200;
  const width = svg.attr("width") - margin;
  const height = svg.attr("height") - margin;

  // setting scale
  const xScale = d3
    .scaleTime()
    .domain([
      new Date(graphData[0][0] - 3000),
      new Date(graphData[graphData.length - 1][0]),
    ])
    .range([0, width]);
  const yScale = d3.scaleLinear().domain([10000, 15000]).range([height, 0]);
  const g = svg
    .append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")");

  // adding title
  svg
    .append("text")
    .attr("x", width / 2 + 100)
    .attr("y", 100)
    .attr("text-anchor", "middle")
    .style("font-size", 20)
    .text("Voltage vs Time");

  // X label
  svg
    .append("text")
    .attr("x", width / 2 + 100)
    .attr("y", height - 15 + 150)
    .attr("text-anchor", "middle")
    .style("font-size", 12)
    .text("Time");

  // y label
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(50," + (height - 100) + ")rotate(-90)")
    .style("font-size", 12)
    .text("Voltage");

  // adding axis
  g.append("g")
    .attr("transform", "translate(0, " + height + ")")
    .call(d3.axisBottom(xScale));
  g.append("g").call(d3.axisLeft(yScale));

  // scattering dots
  svg
    .append("g")
    .selectAll("dot")
    .data(graphData)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d[0]))
    .attr("cy", (d) => yScale(d[1]))
    .attr("r", 7)
    .attr("transform", "translate(" + 100 + "," + 100 + ")")
    .style("fill", "#cc000050");
}
