#!/usr/bin/env node

/**
 * JWT Token Generator Script for Admin User
 * This script generates a valid JWT token for the admin user without requiring login
 * Usage: node scripts/generate-admin-jwt.js
 */

const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const adminId = '62c119ea-abdd-4e1b-8c64-7979fdcfb29e';
const adminEmail = 'admin@example.com';
const adminRoles = ['ADMIN'];

try {
  const keyPath = path.join(__dirname, '..', 'keys', 'jwt.private.key');
  const privateKey = fs.readFileSync(keyPath, 'utf-8');

  const payload = {
    sub: adminId,
    email: adminEmail,
    roles: adminRoles,
    iat: Math.floor(Date.now() / 1000),
  };

  const token = jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '24h',
  });

  console.log('\n=================================');
  console.log('JWT Token for Admin User');
  console.log('=================================\n');
  console.log('Email: ' + adminEmail);
  console.log('Roles: ' + adminRoles.join(', '));
  console.log('\nToken:\n');
  console.log(token);
  console.log('\n=================================');
  console.log('Usage: Add this to Authorization header');
  console.log('Authorization: Bearer ' + token);
  console.log('=================================\n');
} catch (error) {
  console.error('Error generating token:', error.message);
  process.exit(1);
}
