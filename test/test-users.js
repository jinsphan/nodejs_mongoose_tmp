const test    = require("tape");
const request = require('supertest');
const app     = require("../server");
const agent   = request.agent(app);
require('tap-spec-integrated');


let token_user1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwiZnVsbG5hbWUiOiJ1c2VyMSIsImF2YXRhciI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMS9pbWFnZXMvYXZhdGFycy9kZWFmdWx0X2F2YXRhci5wbmciLCJyb2xlIjoyLCJfaWQiOiI1YjQ0ODNiMTY0YTQ3YjdkNjExNzc3ZGMiLCJleHAiOjE1MzE0NTY5MzU5MDYsImlhdCI6MTUzMTM3MDUzNX0.lyYJuzV4LHbXlUjjtBTujI3jyNiGzjzsME2yowY6F2M"
let token_admin = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZnVsbG5hbWUiOiJhZG1pbiIsImF2YXRhciI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMS9pbWFnZXMvYXZhdGFycy9hdmF0YXItMTUzMTI5MjA5MzIxNS5wbmciLCJyb2xlIjoxLCJfaWQiOiI1YjQ1YTliZDM0MDk5MzUxZjEyM2QwYjIiLCJleHAiOjE1MzE0NTY5OTMxMDYsImlhdCI6MTUzMTM3MDU5M30.SN-JRQSe3u4qgFe-mdQVKBTpdIbHBklH6i3avFHXEGg"
const resErrorAuthen = {
  errors: 'No authorization token was found',
  success: 0
}

test('POST api/user/login - body data incorrect format', t => {
  request(app)
  .post('/api/user/login')
  .send({
    // username: 'user1',
  })
  .expect(400)
  .end(er => {
    t.iferror(er, "No error, expect 400");
    t.end();
  })
})

test('POST api/user/login - username and password incorrect', t => {
  request(app)
  .post('/api/user/login')
  .send({
    username: 'user1',
    password: '133'
  })
  .expect(401)
  .end(er => {
    t.iferror(er, "No error, expect 401, message is Unauthorized!");
    t.end();
  })
})

test('POST /api/user/login - username and password correct', function(t) {
  request(app)
  .post('/api/user/login')
  .send({
    username: 'user1',
    password: '123'
  })
  .expect('Content-Type', /json/)
  .expect(200)
  .end((er, res) => {
    t.iferror(er, "No error, expect 200");
    t.notEqual(res.body.data.token, null, "Has return token for client.");
    t.end();
  })
})

test('GET api/user - get all user but dont set token', t => {
  request(app)
  .get('/api/user')
  .expect('Content-Type', /json/)
  .expect(500)
  .end((er, res) => {
    t.same(res.body, resErrorAuthen, "Message: " + resErrorAuthen.errors);
    t.iferror(er, "no error, expect 500");
    t.end();
  });
})

test('GET api/user - get all user but not admin', t => {
  request(app)
  .get('/api/user')
  .set('Authorization', 'Bearer ' + token_user1)
  .expect(500)
  .end(er => {
    t.iferror(er, "No error, expect 500");
    t.end();
  });
})

test('Get api/user - get all user by admin', t => {
  request(app)
  .get('/api/user')
  .set('Authorization', 'Bearer ' + token_admin)
  .expect(200)
  .end(er => {
    t.iferror(er, "Not error, expect 200");
    t.end();
  });
})

test('DONE', t => {
  t.end();
  process.exit(0);
});
