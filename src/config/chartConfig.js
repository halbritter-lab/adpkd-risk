// src/config/chartConfig.js
export default {
    lineChart: {
      classificationData: [
        {
          label: 'Class 1A',
          data: [{ x: 15, y: 100 }, { x: 80, y: 100 }],
          borderColor: 'black',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderWidth: 2,
          fill: 'origin',
          showLine: true,
          pointRadius: 0,
          hoverRadius: 0,
        },
        {
          label: 'Class 1B',
          data: [{ x: 15, y: 187.535 }, { x: 80, y: 493.599 }],
          borderColor: '#FF5E00',
          backgroundColor: 'rgba(0, 176, 80, 0.2)',
          borderWidth: 2,
          fill: '1',
          showLine: true,
          pointRadius: 0,
          hoverRadius: 0,
        },
        {
          label: 'Class 1C',
          data: [{ x: 15, y: 233.695 }, { x: 80, y: 1596.134 }],
          borderColor: '#ccff99',
          backgroundColor: 'rgba(204, 255, 153, 0.2)',
          borderWidth: 2,
          fill: '1',
          showLine: true,
          pointRadius: 0,
          hoverRadius: 0,
        },
        {
          label: 'Class 1D',
          data: [{ x: 15, y: 290.292 }, { x: 80, y: 5074.514 }],
          borderColor: '#ffc000',
          backgroundColor: 'rgba(255, 192, 0, 0.2)',
          borderWidth: 2,
          fill: '1',
          showLine: true,
          pointRadius: 0,
          hoverRadius: 0,
        },
        {
          label: 'Class 1E',
          data: [{ x: 15, y: 359.484 }, { x: 80, y: 15869.399 }],
          borderColor: '#ff6600',
          backgroundColor: 'rgba(255, 102, 0, 0.2)',
          borderWidth: 2,
          fill: '1',
          showLine: true,
          pointRadius: 0,
          hoverRadius: 0,
        },
      ],
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            min: 20,
            max: 80,
            title: {
              display: true,
              text: 'Patient Age (Years)',
            },
          },
          y: {
            type: 'logarithmic',
            min: 100,
            max: 20000,
            title: {
              display: true,
              text: 'HtTKV (mL/m)',
            },
            ticks: {
              callback: function (value) {
                return value;
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const point = context.raw;
                return `Patient ID: ${point.patientId}, Age: ${point.x}, HtTKV: ${point.y}, Mayo: ${point.mayoClass}`;
              },
            },
            mode: 'nearest',
            intersect: true,
          },
        },
      },
    },
    // Placeholder for other chart types, like barChart, pieChart, etc.
    barChart: {
      options: {
        // Bar chart-specific options here
      },
      datasets: [
        // Example bar chart datasets
      ],
    },
  };
  