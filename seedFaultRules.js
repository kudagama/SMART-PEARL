/**
 * Root executable script for seeding Fault Triage Rules
 * Usage: node seedFaultRules.js [--dry-run]
 */
module.exports = require('./src/scripts/seedFaultRules');

if (require.main === module) {
  const { seedRules } = require('./src/scripts/seedFaultRules');
  seedRules().catch((err) => {
    console.error('Fatal seeder error:', err.message);
    process.exit(1);
  });
}
