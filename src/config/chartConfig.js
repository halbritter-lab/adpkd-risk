// src/config/chartConfig.js
export default {
    lineChart: {
      classificationData: [
        {
          label: 'Class 1A',
          data: [{ x: 15, y: 100 }, { x: 80, y: 100 }],
          borderColor: 'black',
          backgroundColor: 'rgba(196, 214, 145, 0.5)', // Adjusted color with a higher alpha for visibility
          borderWidth: 2,
          fill: '+1',
          showLine: true,
          pointRadius: 0,
          hoverRadius: 0,
        },
        {
          label: 'Class 1B',
          data: [{ x: 15, y: 187.535 }, { x: 80, y: 493.599 }],
          borderColor: '#7aaa12',
          backgroundColor: 'rgba(216, 253, 131, 0.5)', // Adjusted fill color for Class 1B
          borderWidth: 2,
          fill: '+1',
          showLine: true,
          pointRadius: 0,
          hoverRadius: 0,
        },
        {
          label: 'Class 1C',
          data: [{ x: 15, y: 233.695 }, { x: 80, y: 1596.134 }],
          borderColor: '#abdb6b',
          backgroundColor: 'rgba(255, 217, 163, 0.5)', // Adjusted fill color for Class 1C
          borderWidth: 2,
          fill: '+1',
          showLine: true,
          pointRadius: 0,
          hoverRadius: 0,
        },
        {
          label: 'Class 1D',
          data: [{ x: 15, y: 290.292 }, { x: 80, y: 5074.514 }],
          borderColor: '#ffc000',
          backgroundColor: 'rgba(255, 187, 153, 0.5)', // Adjusted fill color for Class 1D
          borderWidth: 2,
          fill: '+1',
          showLine: true,
          pointRadius: 0,
          hoverRadius: 0,
        },
        {
          label: 'Class 1E',
          data: [{ x: 15, y: 359.484 }, { x: 80, y: 15869.399 }],
          borderColor: '#ff6600',
          backgroundColor: 'rgba(252, 139, 136, 0.5)', // Adjusted fill color for Class 1E
          borderWidth: 2,
          fill: '+1',  // Fills above the Class 1E line
          showLine: true,
          pointRadius: 0,
          hoverRadius: 0,
        },
        // Invisible 'Ceiling' dataset to fill the area above Class 1E
        {
          label: 'Ceiling',
          data: Array.from({ length: 61 }, (_, i) => ({ x: 20 + i, y: 20000 })), // Adjust y to the maximum expected value
          borderColor: 'transparent',
          borderWidth: 0,
          showLine: true,
          pointRadius: 0,
          fill: '+1',
          backgroundColor: 'rgba(252, 139, 136, 0.5)', // Fill color for the area above Class 1E
        },
      ],
      propkdRiskSchemes: {
        default: {
          class1A: { backgroundColor: 'rgba(196, 214, 145, 0.5)', borderColor: 'black' },
          class1B: { backgroundColor: 'rgba(216, 253, 131, 0.5)', borderColor: '#7aaa12' },
          class1C: { backgroundColor: 'rgba(255, 217, 163, 0.5)', borderColor: '#abdb6b' },
          class1D: { backgroundColor: 'rgba(255, 187, 153, 0.5)', borderColor: '#ffc000' },
          class1E: { backgroundColor: 'rgba(252, 139, 136, 0.5)', borderColor: '#ff6600' },
        },
        lowRisk: {
          class1A: { backgroundColor: 'rgba(145, 204, 133, 0.5)', borderColor: 'black' },
          class1B: { backgroundColor: 'rgba(196, 214, 145, 0.5)', borderColor: '#1da81d' },
          class1C: { backgroundColor: 'rgba(216, 253, 131, 0.5)', borderColor: '#7aaa12' },
          class1D: { backgroundColor: 'rgba(255, 217, 163, 0.5)', borderColor: '#abdb6b' },
          class1E: { backgroundColor: 'rgba(255, 187, 153, 0.5)', borderColor: '#ffc000' },
        },
        highRisk: {
          class1A: { backgroundColor: 'rgba(216, 253, 131, 0.5)', borderColor: 'black' },
          class1B: { backgroundColor: 'rgba(255, 217, 163, 0.5)', borderColor: '#abdb6b' },
          class1C: { backgroundColor: 'rgba(255, 187, 153, 0.5)', borderColor: '#ffc000' },
          class1D: { backgroundColor: 'rgba(252, 139, 136, 0.5)', borderColor: '#ff6600' },
          class1E: { backgroundColor: 'rgba(250, 80, 80, 0.5)', borderColor: '#e82d07' },
        },
      },
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
    mayoVsPropkdChart: {
      riskColors: [
        ['#E0F0DD', '#CDEBEC', '#CBE4E9'], // Row for low PROPKD
        ['#CDEBEC', '#F9F6CE', '#FCECD8'], // Row for intermediate PROPKD
        ['#CBE4E9', '#FCECD8', '#FBCAC8'], // Row for high PROPKD
      ],
      pointColor: 'black',
      pointRadius: 10,
      axisLabels: {
        x: 'Mayo Risk',
        y: 'PROPKD Risk',
      },
      ticks: {
        xTicks: ['Low', 'Intermediate', 'High'],
        yTicks: ['Low', 'Intermediate', 'High'],
      },
      mayoClassMap: {
        class1A: 'low',
        class1B: 'low',
        class1C: 'intermediate',
        class1D: 'high',
        class1E: 'high',
      },
      propkdScoreMap: {
        low: [0, 3],
        intermediate: [4, 6],
        high: [7, 9],
      },
      grid: {
        drawOnChartArea: true, // Show the grid for both axes
        drawTicks: false, // Hide the small tick marks
        color: 'rgba(0, 0, 0, 0.1)', // Grid color
      },
    },
    propkdChart: {
      lowRiskColor: {
        backgroundColor: '#ffe599',
        borderColor: '#ccc',
        borderWidth: '1px',
      },
      intermediateRiskColor: {
        backgroundColor: '#f4b183',
        borderColor: '#ccc',
        borderWidth: '1px',
      },
      highRiskColor: {
        backgroundColor: '#e06666',
        borderColor: '#ccc',
        color: 'white',
        borderWidth: '1px',
      },
      highlightColor: {
        backgroundColor: '#ffeb3b',
        borderColor: '#000',
        color: '#000',
        borderWidth: '2px',
        fontWeight: 'bold',
      },
      gridCellMaxWidth: '100px',
      // Refactor scoreGrid to move it here
      scoreGrid: [
        { value: 0, label: 'LOW', description: '70.6 median age for ESRD onset' },
        { value: 1, label: 'LOW', description: '70.6 median age for ESRD onset' },
        { value: 2, label: 'LOW', description: '70.6 median age for ESRD onset' },
        { value: 3, label: 'LOW', description: '70.6 median age for ESRD onset' },
        { value: 4, label: 'INTERMEDIATE', description: '56.9 median age for ESRD onset' },
        { value: 5, label: 'INTERMEDIATE', description: '56.9 median age for ESRD onset' },
        { value: 6, label: 'INTERMEDIATE', description: '56.9 median age for ESRD onset' },
        { value: 7, label: 'HIGH', description: '49 median age for ESRD onset' },
        { value: 8, label: 'HIGH', description: '49 median age for ESRD onset' },
        { value: 9, label: 'HIGH', description: '49 median age for ESRD onset' },
      ],
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
  