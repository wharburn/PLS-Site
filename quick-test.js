// Quick diagnostic test for PLS site
// Run with: node quick-test.js

import http from 'http';

const tests = [
  { name: 'Site loads', url: 'http://localhost:3000' },
  { name: 'PLS Logo', url: 'http://localhost:3000/images/pls-logo.png' },
  { name: 'ACCA Logo', url: 'http://localhost:3000/images/partners/acca-logo.png' },
  { name: 'Montague Logo', url: 'http://localhost:3000/images/partners/montague-logo.png' },
  { name: 'AQ Archers Logo', url: 'http://localhost:3000/images/partners/aq-archers-logo.png' },
  { name: 'CIOL Logo', url: 'http://localhost:3000/images/partners/CIOL-logo.png' },
  { name: 'Pedro Photo', url: 'http://localhost:3000/images/team/pedro.jpg' },
  { name: 'NoVo Avatar', url: 'http://localhost:3000/images/services/avatar.png' },
  { name: 'NoVo Avatar Talking', url: 'http://localhost:3000/images/services/avatar_speak.gif' },
];

let passed = 0;
let failed = 0;

console.log('\n🧪 Running PLS Site Quick Tests...\n');

async function testURL(test) {
  return new Promise((resolve) => {
    http
      .get(test.url, (res) => {
        if (res.statusCode === 200) {
          console.log(`✅ ${test.name}`);
          passed++;
        } else {
          console.log(`❌ ${test.name} - HTTP ${res.statusCode}`);
          failed++;
        }
        resolve();
      })
      .on('error', (err) => {
        console.log(`❌ ${test.name} - ${err.message}`);
        failed++;
        resolve();
      });
  });
}

async function runTests() {
  for (const test of tests) {
    await testURL(test);
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

  if (failed === 0) {
    console.log('🎉 All tests passed!\n');
  } else {
    console.log(
      '⚠️  Some tests failed. Check your dev server is running on http://localhost:3000\n'
    );
  }
}

runTests();
