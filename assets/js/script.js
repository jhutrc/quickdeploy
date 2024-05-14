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
      scenarioVector = [0, 0, 1, 0, 0]; // Set default to 'good'
  }
}

function calculateMortalityRisk() {
  const beta = [0, .29266961, .63127178, 1.0919233, 2.010895]; // Beta coefficients for excellent, very good, good, fair, poor
  const s0 = [.9999999, .96281503, .91558171, .87179276, .82403985]; // Survival probabilities at timepoints 0, 5, 10, 15, 20
  const timePoints = [0, 5, 10, 15, 20];
  const logHR = beta.reduce((acc, curr, index) => acc + (curr * scenarioVector[index]), 0);
  const f0 = s0.map(s => (1 - s) * 100);
  const f1 = f0.map((f, index) => f * Math.exp(logHR));
  const riskResults = timePoints.map((time, index) => `Risk at ${time} years: ${f1[index].toFixed(2)}%`);

  // Draw graph
  const ctx = document.getElementById('mortality-risk-graph').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: timePoints.map(String),
      datasets: [{
        label: 'Mortality Risk',
        data: f1,
        steppedLine: 'before',
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Timepoints (years)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Mortality Risk (%)'
          },
          suggestedMin: 0,
          suggestedMax: 80
        }
      }
    }
  });

  document.getElementById("mortality-risk-results").innerText = riskResults.join('\n');
}

document.getElementById("calculate-risk-button").addEventListener("click", calculateMortalityRisk);

// Add event listener to the dropdown to update the scenarioVector
document.getElementById("scenario-dropdown").addEventListener("change", function() {
  selectScenario(this.value);
});
