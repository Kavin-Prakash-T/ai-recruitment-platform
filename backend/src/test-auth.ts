import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { AuthService } from './services/AuthService';
import { User } from './models/User';

async function runTests() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hireflow-test';
  console.log(`Connecting to database: ${uri}`);
  try {
    await mongoose.connect(uri);
    console.log('Database connected successfully.');

    // Clear test user
    await User.deleteMany({ email: /test.*@example\.com/ });
    console.log('Cleared previous test users.');

    const authService = new AuthService();

    // 1. Candidate registration works
    console.log('\n--- 1. Testing Candidate Registration ---');
    const cand = await authService.registerUser({
      name: 'Candidate Test',
      email: 'test-cand@example.com',
      password: 'Password123',
      role: 'CANDIDATE',
    });
    console.log('Candidate registered:', cand.email, cand.role, 'isEmailVerified:', cand.isEmailVerified);
    if ((cand as any).password) throw new Error('Password was returned in register response');

    // 2. Recruiter registration works
    console.log('\n--- 2. Testing Recruiter Registration ---');
    const rec = await authService.registerUser({
      name: 'Recruiter Test',
      email: 'test-rec@example.com',
      password: 'Password123',
      role: 'RECRUITER',
    });
    console.log('Recruiter registered:', rec.email, rec.role);

    // 3. Duplicate email is rejected
    console.log('\n--- 3. Testing Duplicate Email rejection ---');
    try {
      await authService.registerUser({
        name: 'Cand Dup',
        email: 'test-cand@example.com',
        password: 'Password123',
        role: 'CANDIDATE',
      });
      throw new Error('Allowed duplicate email!');
    } catch (err: any) {
      console.log('Duplicate email rejected correctly:', err.message);
    }

    // 4. Login with valid credentials works
    console.log('\n--- 4. Testing Login with valid credentials ---');
    const loginResult = await authService.loginUser('test-cand@example.com', 'Password123');
    console.log('Login success! User:', loginResult.user.email, 'Token exists:', !!loginResult.token);
    if ((loginResult.user as any).password) throw new Error('Password returned in login response');

    // 5. Login with invalid credentials fails
    console.log('\n--- 5. Testing Login with invalid credentials ---');
    try {
      await authService.loginUser('test-cand@example.com', 'WrongPassword123');
      throw new Error('Allowed login with wrong password!');
    } catch (err: any) {
      console.log('Wrong password login rejected correctly:', err.message);
    }

    // 6. Token verification works
    console.log('\n--- 6. Testing Token verification ---');
    const decoded = authService.verifyToken(loginResult.token);
    console.log('Decoded Token ID matches user ID:', decoded.id === (loginResult.user._id as any).toString());
    console.log('Decoded Role:', decoded.role);

    // 7. Inactive user fails login
    console.log('\n--- 7. Testing Inactive user login rejection ---');
    await User.updateOne({ email: 'test-cand@example.com' }, { isActive: false });
    try {
      await authService.loginUser('test-cand@example.com', 'Password123');
      throw new Error('Allowed login for inactive user!');
    } catch (err: any) {
      console.log('Inactive user rejected correctly:', err.message);
    }

    // Clean up
    await User.deleteMany({ email: /test.*@example\.com/ });
    console.log('\nDatabase cleaned up.');
  } catch (error) {
    console.error('Test run failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
}

runTests();
