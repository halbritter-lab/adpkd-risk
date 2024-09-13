export default class Patient {
  constructor(
    patientId = '',
    age = null,
    height = null,
    sex = '',
    familyHistory = '',
    ethnicity = '',
    kidneyVolume = null
  ) {
    this.patientId = patientId;
    this.age = age;
    this.height = height;
    this.sex = sex;
    this.familyHistory = familyHistory;
    this.ethnicity = ethnicity;
    this.kidneyVolume = kidneyVolume;

    // Kidney dimensions for ellipsoid calculations
    this.kidneyLeft = { sagittal: null, coronal: null, width: null, depth: null };
    this.kidneyRight = { sagittal: null, coronal: null, width: null, depth: null };

    // PROPKD related fields
    this.mutationClass = null;
    this.hypertension = false;
    this.firstUrologicalEvent = false;

    // Calculated properties
    this.mayoScore = 1;
    this.propkdScore = 0;
    this.mayoClass = 'low';
  }

  // Method to calculate HtTKV
  calculateHtTKV(mayoClassCalculator) {
    let totalVolume = this.kidneyVolume;

    // Check if we need to calculate total volume from kidney dimensions
    if (!totalVolume) {
      if (
        this.kidneyRight.sagittal &&
        this.kidneyRight.coronal &&
        this.kidneyRight.width &&
        this.kidneyRight.depth &&
        this.kidneyLeft.sagittal &&
        this.kidneyLeft.coronal &&
        this.kidneyLeft.width &&
        this.kidneyLeft.depth
      ) {
        const rightVolume =
          (Math.PI / 6) *
          ((this.kidneyRight.sagittal + this.kidneyRight.coronal) / 2) *
          this.kidneyRight.width *
          this.kidneyRight.depth;
        const leftVolume =
          (Math.PI / 6) *
          ((this.kidneyLeft.sagittal + this.kidneyLeft.coronal) / 2) *
          this.kidneyLeft.width *
          this.kidneyLeft.depth;
        totalVolume = rightVolume + leftVolume;
      } else {
        throw new Error('Missing kidney dimensions for volume calculation.');
      }
    }

    if (!this.height) {
      throw new Error('Height is required for HtTKV calculation.');
    }

    // Calculate HtTKV
    const htAdjustedTKV = totalVolume / this.height;

    // Use the passed calculator function to determine Mayo class
    this.mayoClass = mayoClassCalculator(htAdjustedTKV);
    this.mayoScore = Math.min(Math.max(htAdjustedTKV, 1), 5); // Ensure Mayo Score is between 1 and 5

    return htAdjustedTKV; // Return the HtTKV value
  }

  // Method to calculate PROPKD score
  calculatePROPKDScore() {
    if (!this.sex || !this.mutationClass) {
      throw new Error('Sex and Mutation Class are required for PROPKD Score calculation.');
    }

    const sexScore = this.sex === 'Male' ? 1 : 0;
    const mutationScore =
      this.mutationClass === 'PKD2 mutation' ? 0 :
      this.mutationClass === 'Nontruncating PKD1 mutation' ? 2 : 4;
    const hypertensionScore = this.hypertension ? 2 : 0;
    const urologicalEventScore = this.firstUrologicalEvent ? 2 : 0;

    this.propkdScore = sexScore + mutationScore + hypertensionScore + urologicalEventScore;
  }

  // Convert the patient data to JSON
  toJSON() {
    return JSON.stringify(this);
  }

  // Load patient data from JSON
  static fromJSON(jsonString) {
    const data = JSON.parse(jsonString);
    const patient = new Patient();
    Object.assign(patient, data);

    // Ensure nested objects like kidneyLeft and kidneyRight are properly initialized
    patient.kidneyLeft = data.kidneyLeft || { sagittal: null, coronal: null, width: null, depth: null };
    patient.kidneyRight = data.kidneyRight || { sagittal: null, coronal: null, width: null, depth: null };

    return patient;
  }
}
