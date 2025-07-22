// Simple test to verify hooks are working
// Run this with: node test-hooks.js

const { exec } = require('child_process');

console.log('🧪 Testing if hooks are properly loaded...');

// Check if the hook files exist and are valid JavaScript
const fs = require('fs');
const path = require('path');

const subscriptionHookPath = path.join(__dirname, 'src/collections/hooks/createCustomerOnSubscription.ts');
const transactionHookPath = path.join(__dirname, 'src/collections/hooks/createCustomerOnTransaction.ts');

console.log('📁 Checking hook files...');

if (fs.existsSync(subscriptionHookPath)) {
    console.log('✅ Subscription hook file exists');
    const content = fs.readFileSync(subscriptionHookPath, 'utf8');
    if (content.includes('createCustomerOnSubscription')) {
        console.log('✅ Subscription hook export found');
    } else {
        console.log('❌ Subscription hook export NOT found');
    }
} else {
    console.log('❌ Subscription hook file does NOT exist');
}

if (fs.existsSync(transactionHookPath)) {
    console.log('✅ Transaction hook file exists');
    const content = fs.readFileSync(transactionHookPath, 'utf8');
    if (content.includes('createCustomerOnTransaction')) {
        console.log('✅ Transaction hook export found');
    } else {
        console.log('❌ Transaction hook export NOT found');
    }
} else {
    console.log('❌ Transaction hook file does NOT exist');
}

// Check if the hooks are properly imported in collections
const subscriptionsPath = path.join(__dirname, 'src/collections/Subscriptions.ts');
const transactionsPath = path.join(__dirname, 'src/collections/Transactions.ts');

if (fs.existsSync(subscriptionsPath)) {
    const content = fs.readFileSync(subscriptionsPath, 'utf8');
    if (content.includes('createCustomerOnSubscription')) {
        console.log('✅ Subscription hook imported in Subscriptions.ts');
    } else {
        console.log('❌ Subscription hook NOT imported in Subscriptions.ts');
    }
    if (content.includes('afterChange: [createCustomerOnSubscription]')) {
        console.log('✅ Subscription hook registered in hooks.afterChange');
    } else {
        console.log('❌ Subscription hook NOT registered in hooks.afterChange');
    }
}

if (fs.existsSync(transactionsPath)) {
    const content = fs.readFileSync(transactionsPath, 'utf8');
    if (content.includes('createCustomerOnTransaction')) {
        console.log('✅ Transaction hook imported in Transactions.ts');
    } else {
        console.log('❌ Transaction hook NOT imported in Transactions.ts');
    }
    if (content.includes('afterChange: [createCustomerOnTransaction]')) {
        console.log('✅ Transaction hook registered in hooks.afterChange');
    } else {
        console.log('❌ Transaction hook NOT registered in hooks.afterChange');
    }
}

console.log('\n🎯 Summary:');
console.log('If all checks show ✅, the hooks should work after server restart.');
console.log('If any show ❌, there\'s a configuration issue.');
console.log('\nNext steps:');
console.log('1. Restart your development server');
console.log('2. Edit a subscription in the admin panel');
console.log('3. Watch server console for hook logs');
