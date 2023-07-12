"use strict";

const counntyUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const educationUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let countyData;
let educationData;

const canvas = d3.select("#canvas");
const tooltip = d3.select("#tooltip");

const drawMap = () => {
  canvas
    .selectAll("path")
    .data(countyData)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("fill", (countyDataItem) => {
      let id = countyDataItem["id"];
      let county = educationData.find((item) => item["fips"] === id);
      let percentage = county["bachelorsOrHigher"];
      switch (true) {
        case percentage <= 15:
          return "tomato";
        case percentage <= 30:
          return "orange";
        case percentage <= 45:
          return "lightgreen";
        default:
          return "limegreen";
      }
    })
    .attr("data-fips", (countyDataItem) => countyDataItem["id"])
    .attr("data-education", (countyDataItem) => {
      let id = countyDataItem["id"];
      let county = educationData.find((item) => item["fips"] === id);
      return county["bachelorsOrHigher"];
    })
    .on("mouseover", (event, countyDataItem) => {
      tooltip.transition().style("visibility", "visible");

      let id = countyDataItem["id"];
      let county = educationData.find((item) => item["fips"] === id);

      tooltip
        .text(
          `${county["fips"]} - ${county["area_name"]}, ${county["state"]} : ${county["bachelorsOrHigher"]}%`
        )
        .attr("data-education", county["bachelorsOrHigher"]);
    })
    .on("mouseout", (event, countyDataItem) => {
      tooltip.transition().style("visibility", "hidden");
    });
};

d3.json(counntyUrl).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    countyData = topojson.feature(data, data.objects.counties).features;

    d3.json(educationUrl).then((data, error) => {
      if (error) {
        console.log(error);
      } else {
        educationData = data;
        console.log(educationData);
        drawMap();
      }
    });
  }
});
