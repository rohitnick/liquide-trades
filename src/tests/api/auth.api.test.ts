import * as chai from 'chai';

import { AppDataSource } from "../../data-source";
import { DataSource } from "typeorm";
import { sendPostRequest } from "../_helpers.test";
import test from "ava";

let dataSource: DataSource;

test.beforeEach('create test-db connection', async () => {
    dataSource = AppDataSource;
    if (!dataSource.isInitialized) {
        await dataSource.initialize();
    }
});

test.afterEach.always('close test-db connection', async () => {
    if (dataSource.isInitialized) {
        await dataSource.destroy();
    }
});

test.serial('POST /auth/signup should create a new user', async (t) => {
    const data = { email: 'test2@example.com', password: 'securepassword' };
    const res = await sendPostRequest('auth/signup', data);
    
    t.is(res.status, 201);
    chai.expect(res.body.message).to.eql('User created successfully');
});

test.serial('POST /auth/signup should fail with invalid email', async (t) => {
    const data = { email: 'invalid-email', password: 'securepassword' };
    const res = await sendPostRequest('auth/signup', data);
    
    t.is(res.status, 400);
    chai.expect(res.body.message).to.contain('must be an email');
});

test.serial('POST /auth/login should authenticate with valid credentials', async (t) => {
    const signupData = { email: 'login@example.com', password: 'securepassword' };
    await sendPostRequest('auth/signup', signupData);
    
    const loginData = { email: 'login@example.com', password: 'securepassword' };
    const res = await sendPostRequest('auth/login', loginData);
    
    t.is(res.status, 200);
    chai.expect(res.body).to.have.property('accessToken');
    chai.expect(res.body).to.have.property('refreshToken');
});

test.serial('POST /auth/login should fail with invalid credentials', async (t) => {
    const loginData = { email: 'nonexistent@example.com', password: 'wrongpassword' };
    const res = await sendPostRequest('auth/login', loginData);
    
    t.is(res.status, 401);
    chai.expect(res.body.message).to.eql('Invalid credentials');
});