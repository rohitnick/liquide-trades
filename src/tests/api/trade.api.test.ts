import * as chai from 'chai';

import { sendGetRequest, sendPostRequest } from "../_helpers.test";

import { AppDataSource } from "../../data-source";
import { DataSource } from "typeorm";
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

// Faiure Scenarios
test.serial('POST /trades should fail with invalid shares', async (t) => {
  const data = {
    type: 'buy',
    user_id: 1,
    symbol: 'AAPL',
    shares: 200, // Invalid shares
    price: 150.5,
  };

  const res = await sendPostRequest('api/trades', data);

  t.is(res.status, 400);
  chai.expect(res.body.message).to.contain('shares must not be greater than 100');
});

test.serial('POST /trades should fail with invalid type', async (t) => {
  const data = {
    type: 'invalid',
    user_id: 1,
    symbol: 'AAPL',
    shares: 100,
    price: 150.5,
  };

  const res = await sendPostRequest('api/trades', data);

  t.is(res.status, 400);
  chai.expect(res.body.message).to.contain('type must be either buy or sell');
});

test.serial('GET /trades should retrieve all trades', async (t) => {
  const res = await sendGetRequest('trades');

  t.is(res.status, 200);
  chai.expect(res.body).to.be.an('array');
});

test.serial('GET /trades/:id should return 404 if there is no trade', async (t) => {
  const res = await sendGetRequest('trades/420');

  t.is(res.status, 404);
  chai.expect(res.body).to.have.property('message');
});