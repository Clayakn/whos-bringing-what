const CreatorSpecificEvent = require('./CreatorSpecificEvent/CreatorSpecificEvent');


const testRead = require('');
const request = require('supertest');


const newItem = {
    name: 'soda'
}

const url = 'http://localhost:4000/api/post_requestedItem';

describe('Car tests', () => {
    test('test post', () => {
        
    })
})



const app = require('../server/index');

const { readUser } = require('../server/index');


describe('user check', () => {
    test('check readUser response', function(){
        request(app).get('/api/user-data').then((response) => {
            expect(response.statusCode).toEqual(200)
        })
    })
})