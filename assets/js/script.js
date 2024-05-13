'use strict';

var scenarioVector = [1, 0, 0, 0, 0]; // Default to excellent self-rated health scenario

function selectScenario(scenario) {
  switch (scenario) {
    case 'excellent':
      scenarioVector = [1, 0, 0, 0, 0];
      break;
    case 'verygood':
      scenarioVector = [0, 1, 0, 0, 0];
      break;
    case 'good':
      scenarioVector = [0, 0, 1, 0, 0];
      break;
    case 'fair':
      scenarioVector = [0, 0, 0, 1, 0];
      break;
    case 'poor':
      scenarioVector = [0, 0, 0, 0, 1];
      break;
    default:
      scenarioVector = [1, 0, 0, 0, 0];
  }
}

function calculateMortalityRisk() {
  const beta = [0, .29266961, .63127178, 1.0919233, 2.010895]; // Beta coefficients for excellent, very good, good, fair, poor
  const s0 = [.9999999, .9949034, .9844462, .9792454]; // Survival probabilities at timepoints 0, 5, 12, 15
  const timePoints = [0, 5, 12, 15];
  const logHR = beta.reduce((acc, curr, index) => acc + (curr * scenarioVector[index]), 0);
  const f0 = s0.map(s => (1 - s) * 100);
  const f1 = f0.map((f, index) => f * Math.exp(logHR));
  const riskResults = timePoints.map((time, index) => `Risk at ${time} years: ${f1[index].toFixed(2)}%`);
  document.getElementById("mortality-risk-results").innerText = riskResults.join('\n');
}

document.getElementById("calculate-risk-button").addEventListener("click", calculateMortalityRisk);

// Add event listener to the dropdown to update the scenarioVector
document.getElementById("scenario-dropdown").addEventListener("change", function() {
  selectScenario(this.value);
});
