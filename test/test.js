const request = require('supertest');
const server = require('../server');

test("Risk Test", async () => {
  const response = await request(server)
    .post('/')
    .send({
      age: 35,
      dependents: 2,
      house: { ownership_status: "owned" },
      income: 0,
      marital_status: "married",
      risk_questions: [0, 1, 0],
      vehicle: { year: 2018 }
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(response => {
      expect(response.body).toEqual({
        'auto': 'economic',
        'disability': 'ineligible',
        'home': 'economic',
        'life': 'regular'
      })
    });
});

test("No house Test", async () => {
  const response = await request(server)
    .post('/')
    .send({
      age: 35,
      dependents: 2,
      house: { },
      income: 0,
      marital_status: "married",
      risk_questions: [0, 1, 0],
      vehicle: { year: 2018 }
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(response => {
      expect(response.body).toEqual({
        'auto': 'economic',
        'disability': 'ineligible',
        'home': 'ineligible',
        'life': 'regular'
      })
    });
});

test("No vehicle Test", async () => {
  const response = await request(server)
    .post('/')
    .send({
      age: 35,
      dependents: 2,
      house: { ownership_status: "owned" },
      income: 0,
      marital_status: "married",
      risk_questions: [0, 1, 0],
      vehicle: { }
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(response => {
      expect(response.body).toEqual({
        'auto': 'ineligible',
        'disability': 'ineligible',
        'home': 'economic',
        'life': 'regular'
      })
    });
});

test("Old vehicle Test", async () => {
  const response = await request(server)
    .post('/')
    .send({
      age: 35,
      dependents: 2,
      house: { ownership_status: "owned" },
      income: 0,
      marital_status: "married",
      risk_questions: [0, 1, 0],
      vehicle: { year: 2010 }
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(response => {
      expect(response.body).toEqual({
        'auto': 'economic',
        'disability': 'ineligible',
        'home': 'economic',
        'life': 'regular'
      })
    });
});

test("60+ years old Test", async () => {
  const response = await request(server)
    .post('/')
    .send({
      age: 65,
      dependents: 2,
      house: { ownership_status: "owned" },
      income: 0,
      marital_status: "married",
      risk_questions: [0, 1, 0],
      vehicle: { year: 2018 }
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(response => {
      expect(response.body).toEqual({
        'auto': 'regular',
        'disability': 'ineligible',
        'home': 'economic',
        'life': 'ineligible'
      })
    });
});
