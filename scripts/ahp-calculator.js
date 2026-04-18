#!/usr/bin/env node

/**
 * AHP (Analytic Hierarchy Process) Calculator
 * Usage: node ahp-calculator.js <input.json>
 *
 * Input JSON format:
 * {
 *   "criteria": ["price", "quality", "convenience"],
 *   "criteriaMatrix": [[1, 3, 0.5], [0.33, 1, 0.25], [2, 4, 1]],
 *   "alternatives": ["Option A", "Option B", "Option C"],
 *   "alternativeMatrices": {
 *     "price": [[1, 2, 0.5], [0.5, 1, 0.33], [2, 3, 1]],
 *     "quality": [[1, 0.5, 3], [2, 1, 4], [0.33, 0.25, 1]],
 *     "convenience": [[1, 3, 2], [0.33, 1, 0.5], [0.5, 2, 1]]
 *   }
 * }
 */

const fs = require('fs');

const RI_TABLE = {
  1: 0, 2: 0, 3: 0.58, 4: 0.90, 5: 1.12,
  6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49
};

function normalizeMatrix(matrix) {
  const n = matrix.length;
  const colSums = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      colSums[j] += matrix[i][j];
    }
  }
  const normalized = matrix.map(row =>
    row.map((val, j) => val / colSums[j])
  );
  return normalized;
}

function calculateWeights(normalizedMatrix) {
  const n = normalizedMatrix.length;
  return normalizedMatrix.map(row => {
    const sum = row.reduce((a, b) => a + b, 0);
    return sum / n;
  });
}

function multiplyMatrixVector(matrix, vector) {
  return matrix.map(row =>
    row.reduce((sum, val, j) => sum + val * vector[j], 0)
  );
}

function calculateLambdaMax(matrix, weights) {
  const n = matrix.length;
  const weightedSums = multiplyMatrixVector(matrix, weights);
  let lambdaSum = 0;
  for (let i = 0; i < n; i++) {
    lambdaSum += weightedSums[i] / weights[i];
  }
  return lambdaSum / n;
}

function calculateConsistency(matrix, weights) {
  const n = matrix.length;
  if (n <= 2) return { ci: 0, cr: 0, consistent: true };

  const lambdaMax = calculateLambdaMax(matrix, weights);
  const ci = (lambdaMax - n) / (n - 1);
  const ri = RI_TABLE[n] || RI_TABLE[10];
  const cr = ri === 0 ? 0 : ci / ri;

  return {
    ci: parseFloat(ci.toFixed(4)),
    cr: parseFloat(cr.toFixed(4)),
    consistent: cr < 0.1
  };
}

function processAHP(data) {
  const { criteria, criteriaMatrix, alternatives, alternativeMatrices } = data;

  // Validate input
  if (!criteria || !criteriaMatrix || !alternatives || !alternativeMatrices) {
    throw new Error('Missing required fields in input');
  }

  const nCriteria = criteria.length;
  const nAlternatives = alternatives.length;

  // Validate matrix dimensions
  if (criteriaMatrix.length !== nCriteria || criteriaMatrix.some(r => r.length !== nCriteria)) {
    throw new Error(`Criteria matrix must be ${nCriteria}x${nCriteria}`);
  }

  for (const [key, matrix] of Object.entries(alternativeMatrices)) {
    if (matrix.length !== nAlternatives || matrix.some(r => r.length !== nAlternatives)) {
      throw new Error(`Alternative matrix for "${key}" must be ${nAlternatives}x${nAlternatives}`);
    }
  }

  // Calculate criteria weights
  const normalizedCriteria = normalizeMatrix(criteriaMatrix);
  const criteriaWeights = calculateWeights(normalizedCriteria);
  const criteriaConsistency = calculateConsistency(criteriaMatrix, criteriaWeights);

  // Calculate alternative weights for each criterion
  const alternativeWeights = {};
  const alternativeConsistencies = {};

  for (const criterion of criteria) {
    const matrix = alternativeMatrices[criterion];
    const normalized = normalizeMatrix(matrix);
    const weights = calculateWeights(normalized);
    alternativeWeights[criterion] = weights;
    alternativeConsistencies[criterion] = calculateConsistency(matrix, weights);
  }

  // Calculate overall scores
  const overallScores = alternatives.map((alt, i) => {
    let score = 0;
    for (let j = 0; j < nCriteria; j++) {
      const criterion = criteria[j];
      score += criteriaWeights[j] * alternativeWeights[criterion][i];
    }
    return {
      alternative: alt,
      score: parseFloat(score.toFixed(6)),
      rank: 0
    };
  });

  // Rank alternatives
  overallScores.sort((a, b) => b.score - a.score);
  overallScores.forEach((item, index) => {
    item.rank = index + 1;
  });

  return {
    criteriaWeights: criteria.map((c, i) => ({
      criterion: c,
      weight: parseFloat(criteriaWeights[i].toFixed(6))
    })),
    criteriaConsistency,
    alternativeDetails: criteria.map(c => ({
      criterion: c,
      weights: alternatives.map((a, i) => ({
        alternative: a,
        weight: parseFloat(alternativeWeights[c][i].toFixed(6))
      })),
      consistency: alternativeConsistencies[c]
    })),
    overallScores,
    recommendation: overallScores[0].alternative
  };
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: node ahp-calculator.js <input.json>');
    process.exit(1);
  }

  const inputPath = args[0];
  let data;
  try {
    data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  } catch (err) {
    console.error(`Error reading input file: ${err.message}`);
    process.exit(1);
  }

  try {
    const result = processAHP(data);
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error(`AHP calculation error: ${err.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { processAHP };
