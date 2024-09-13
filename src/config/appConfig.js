export default {
    // Ethnicity options
    ethnicityOptions: ['AA', 'O'],
  
    // Mutation classes for PROPKD
    mutationClasses: [
      'PKD2 mutation',
      'Nontruncating PKD1 mutation',
      'Truncating PKD1 mutation',
    ],
  
    // Input methods for volume calculation
    inputMethods: ['Ellipsoid Equation', 'Stereology Method'],
  
    // Validation colors for icons
    validationIconColors: {
      valid: 'green',
      invalid: 'red',
    },
  
    // Height configuration for patient input
    height: {
      min: 1.4,  // Minimum height in meters
      max: 2.4,  // Maximum height in meters
      step: 0.01,  // Step value for height input
    },
  
    // Age rules for validation
    age: {
      min: 20,
      max: 80,
      rules: [
        v => !!v || 'Age is required',  // Ensure age is provided
        v => (v >= 20 && v <= 80) || 'Age must be between 20 and 80',  // Age validation rule
      ],
    },
  
    // Chart configuration for Mayo and PROPKD chart
    chartConfig: {
      dataset: {
        borderColor: 'rgb(75, 192, 192)',  // Border color for chart
        backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Background color for chart
        pointRadius: 5,  // Point radius for chart markers
      },
    },
  
    // Modals configuration
    modals: {
      disclaimerAcknowledged: {
        show: !localStorage.getItem('disclaimerAcknowledged'),
        acknowledged: !!localStorage.getItem('disclaimerAcknowledged'),
        acknowledgmentTime: localStorage.getItem('acknowledgmentTime') || null,
      },
      faq: {
        show: false,
      },
    },
  
    // Button styles
    buttonStyles: {
      primary: {
        backgroundColor: '#0056b3',  // Default button background color
        hoverBackgroundColor: '#004085',  // Button hover background color
      },
    },
  
    // Last commit hash (for display purposes)
    lastCommitHash: {
      default: 'loading...',  // Default value before fetching
    },
  };
  