import * as chai from 'chai';

import { sendGetRequest, sendPostRequest } from "../_helpers.test";

import { AppDataSource } from "../../data-source";
import { DataSource } from "typeorm";
import test from "ava";

let dataSource: DataSource;
let accessToken: string;

test.beforeEach('create test-db connection', async () => {
  dataSource = AppDataSource;
  if (!dataSource.isInitialized) {
    await dataSource.initialize();

    // Create a user and login to obtain an access token
    const signupData = { email: 'tradeuser@example.com', password: 'securepassword' };
    await sendPostRequest('auth/signup', signupData);

    const loginData = { email: 'tradeuser@example.com', password: 'securepassword' };
    const res = await sendPostRequest('auth/login', loginData);
    accessToken = res.body.accessToken;
  }
});

test.afterEach.always('close test-db connection', async () => {
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }
});

test.serial('POST /trades should create a new trade', async (t) => {
  const data = {
    type: 'buy',
    user_id: 1,
    symbol: 'AAPL',
    shares: 50,
    price: 150.5,
  };

  const res = await sendPostRequest('trades', data, { Authorization: `Bearer ${accessToken}` });

  t.is(res.status, 201);
  chai.expect(res.body.type).to.eql('buy');
  chai.expect(res.body.symbol).to.eql('AAPL');
});

test.serial('POST /trades should fail with invalid number of shares', async (t) => {
  const data = {
    type: 'buy',
    user_id: 1,
    symbol: 'LIQ',
    shares: 200,
    price: 150.5,
  };

  const res = await sendPostRequest('trades', data, { Authorization: `Bearer ${accessToken}` });

  t.is(res.status, 400);
  chai.expect(res.body.message).to.contain('shares must not be greater than 100');
});

test.serial('POST /trades should fail with invalid type', async (t) => {
  const data = {
    type: 'invalid',
    user_id: 1,
    symbol: 'LIQ',
    shares: 100,
    price: 150.5,
  };

  const res = await sendPostRequest('trades', data, { Authorization: `Bearer ${accessToken}` });

  t.is(res.status, 400);
  chai.expect(res.body.message).to.contain('type must be either buy or sell');
});

test.serial('GET /trades should retrieve all trades', async (t) => {
  const res = await sendGetRequest('trades', { Authorization: `Bearer ${accessToken}` });

  t.is(res.status, 200);
  chai.expect(res.body).to.be.an('array');
});

test.serial('GET /trades/:id should return 404 if there is no trade', async (t) => {
  const res = await sendGetRequest('trades/420', { Authorization: `Bearer ${accessToken}` });

  t.is(res.status, 404);
  chai.expect(res.body).to.have.property('message');
});