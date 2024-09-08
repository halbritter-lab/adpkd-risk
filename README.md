# ADPKD Risk Calculator

## Overview

The **ADPKD Risk Calculator** is a web-based tool developed to estimate the progression risk for patients with Autosomal Dominant Polycystic Kidney Disease (ADPKD) by combining two major scoring systems: the **Mayo Imaging Classification** (MIC) and the **PROPKD Score**. 

This application enables clinicians and researchers to assess both kidney volume and genetic/clinical risk factors, helping to stratify patients based on the severity of their disease.

## Features

- **Patient Data Input**: Enter essential details like Patient ID, Age, Height, and Sex.
- **Mayo Imaging Classification Calculation**: Choose between **Ellipsoid Equation** (based on kidney dimensions) or **Stereology Method** (using total kidney volume).
- **PROPKD Score Calculation**: Based on genotype, early-onset hypertension, and urological events.
- **Visualization**: Dynamic charts and scatter plots to show patient-specific risk assessments.

## Project Structure

```bash
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── LineChart.vue
│   │   ├── MayoVsPROPKDChart.vue
│   │   ├── PROPKDChart.vue
│   ├── views/
│   │   └── Home.vue
│   ├── App.vue
│   ├── main.js
│   ├── router.js
│   └── store.js
├── .gitignore
├── index.html
└── vite.config.js
```

## Usage

### Enter Patient Data
In the first step, input basic patient information like ID, age, height, and sex.

### Calculate Mayo Score
Choose a calculation method:
- **Ellipsoid Equation** (based on kidney measurements) or
- **Stereology Method** (if the total kidney volume is known).

Click "Calculate" to compute the Mayo Score.

### Calculate PROPKD Score
Input data regarding genotype, early hypertension, and urological history to compute the PROPKD Score.

### Visualize Risk
Use the tabs to switch between visualizations that compare the Mayo score and PROPKD score, or view detailed charts tracking kidney volume.

## Risk Stratification

### Mayo Imaging Classification (MIC)
- **Low Risk**: Mayo Class 1A-B
- **Intermediate Risk**: Mayo Class 1C
- **High Risk**: Mayo Class 1D-E

### PROPKD Score
- **Low Risk**: 0-3 points
- **Intermediate Risk**: 4-6 points
- **High Risk**: 7-9 points

### Combined Risk Categories

The combined risk categories provide a deeper insight into the patient's condition by merging the Mayo Imaging Classification with the PROPKD Score.

| Mayo Risk      | PROPKD Risk    | Combined Risk Category  |
|----------------|----------------|-------------------------|
| Low            | Low            | Low-Low                 |
| Low            | Intermediate    | Low-Intermediate         |
| Low            | High           | Low-High                |
| Intermediate   | Intermediate    | Intermediate-Intermediate |
| Intermediate   | High           | Intermediate-High       |
| High           | High           | High-High               |

For more information about the methodology, refer to the papers and publications linked below.

## Visualizations

- **LineChart**: Plots kidney volume over age, stratified by Mayo class.
- **MayoVsPROPKDChart**: A scatter plot comparing Mayo score against PROPKD score, helping to identify patients at higher risk.

## Authors

**Bernt Popp**

- <https://github.com/berntpopp>
- <https://orcid.org/0000-0002-3679-1081>
- <https://scholar.google.com/citations?user=Uvhu3t0AAAAJ>

**Constantin Aaron Wolff**

- <https://github.com/ConstantinWolff>
- <https://orcid.org/0000-0002-3277-4559>

**Jan Halbritter**

- <https://github.com/halbrijp>
- <https://orcid.org/0000-0002-1377-9880>
- <https://scholar.google.com/citations?user=Jt1S5fkAAAAJ>

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

