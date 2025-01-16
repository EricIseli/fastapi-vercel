import React from "react";
import { VegaLite } from "react-vega";
import PropTypes from "prop-types";

const Chart = ({ data }) => {
  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "Temperatur und Niederschlagsmenge über sieben Tage",
    width: 450,
    height: 350,
    data: {
      values: data,
    },
    encoding: {
      x: {
        field: "Datum",
        type: "temporal",
        title: "Datum",
        axis: {
          labelAngle: -45,
          format: "%d.%m.%Y",
        },
      },
    },
    layer: [
      {
        mark: { type: "line", point: true, color: "red" },
        encoding: {
          y: {
            field: "T",
            type: "quantitative",
            title: "Temperatur (°C)",
            axis: {
              titleColor: "red",
              labelColor: "red",
            },
          },
        },
      },
      {
        mark: { type: "line", point: true, color: "blue" },
        encoding: {
          y: {
            field: "RainDur",
            type: "quantitative",
            title: "Niederschlagsdauer (min)",
            axis: {
              titleColor: "blue",
              labelColor: "blue",
            },
          },
        },
      },
    ],
    resolve: { scale: { y: "independent" } },
  };

  return (
    <div className="chart-container">
      {data.length > 0 ? (
        <VegaLite spec={spec} />
      ) : (
        <p>Keine Daten verfügbar.</p>
      )}
    </div>
  );
};

Chart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      Datum: PropTypes.string.isRequired,
      T: PropTypes.number.isRequired,
      RainDur: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Chart;
