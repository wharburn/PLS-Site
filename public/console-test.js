// Browser Console Test Script for PLS Site
// Open http://localhost:3000 and paste this into the browser console

console.log('🧪 Running PLS Site Console Tests...\n');

const tests = {
  'Page Structure': [
    { name: 'Home section', selector: '#home' },
    { name: 'Services section', selector: '#services' },
    { name: 'Partners section', selector: '#partners' },
    { name: 'About section', selector: '#about' },
    { name: 'Translation section', selector: '#translation' },
    { name: 'Analysis section', selector: '#analysis' },
    { name: 'AI Advice section', selector: '#ai-advice' },
    { name: 'Contact section', selector: '#contact' },
    { name: 'Footer', selector: 'footer' },
  ],
  'Interactive Elements': [
    { name: 'Language switcher', text: 'EN/PT' },
    { name: 'NoVo AI button', text: 'Ask NoVo' },
    { name: 'Service cards', text: 'Legal Services' },
    { name: 'Partner logos', text: 'Montague' },
  ],
  'Images': [
    { name: 'PLS Logo', src: '/images/pls-logo.png' },
    { name: 'ACCA Logo', src: '/images/partners/acca-logo.png' },
    { name: 'Montague Logo', src: '/images/partners/montague-logo.png' },
    { name: 'NoVo Avatar', src: '/images/services/avatar.png' },
  ],
};

let passed = 0;
let failed = 0;

// Test by selector
function testSelector(test) {
  const element = document.querySelector(test.selector);
  if (element) {
    console.log(`✅ ${test.name}`);
    passed++;
    return true;
  } else {
    console.log(`❌ ${test.name} - Element not found: ${test.selector}`);
    failed++;
    return false;
  }
}

// Test by text content
function testText(test) {
  const bodyText = document.body.innerText;
  if (bodyText.includes(test.text)) {
    console.log(`✅ ${test.name}`);
    passed++;
    return true;
  } else {
    console.log(`❌ ${test.name} - Text not found: "${test.text}"`);
    failed++;
    return false;
  }
}

// Test image loading
function testImage(test) {
  const images = Array.from(document.querySelectorAll('img'));
  const found = images.some((img) => img.src.includes(test.src));
  if (found) {
    console.log(`✅ ${test.name}`);
    passed++;
    return true;
  } else {
    console.log(`❌ ${test.name} - Image not found: ${test.src}`);
    failed++;
    return false;
  }
}

// Run all tests
console.log('📋 Page Structure Tests:');
tests['Page Structure'].forEach(testSelector);

console.log('\n🎯 Interactive Elements Tests:');
tests['Interactive Elements'].forEach(testText);

console.log('\n🖼️ Image Loading Tests:');
tests['Images'].forEach(testImage);

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('🎉 All tests passed!\n');
} else {
  console.log('⚠️ Some tests failed. Check the details above.\n');
}

// Return summary
({
  total: passed + failed,
  passed,
  failed,
  success: failed === 0,
});

