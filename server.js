const http = require('http');

function calculate_risk(json_str) {

  const age = JSON.parse(json_str).age;
  const dependents = JSON.parse(json_str).dependents;
  const house = JSON.parse(json_str).house;
  const income = JSON.parse(json_str).income;
  const marital_status = JSON.parse(json_str).marital_status;
  const risk_questions = JSON.parse(json_str).risk_questions;
  const vehicle = JSON.parse(json_str).vehicle;
  const base_score = risk_questions.reduce((x, y) => { return x + y }, 0);
  const date = new Date();

  let auto = base_score;
  let disability = base_score;
  let home = base_score;
  let life = base_score;

  if (age > 60) {
    disability = -8;
    life = -8;
  } else if (age < 30) {
    auto -= 2;
    disability -= 2;
    home -= 2;
    life -= 2;
  } else if (age < 40) {
    auto -= 1;
    disability -= 1;
    home -= 1;
    life -= 1;
  }

  if (income < 200000) {
    auto -= 1;
    disability -= 1;
    home -= 1;
    life -= 1;
  }
  if (income == 0) {
    disability = -8
  }

  if (house != undefined) {
    if (house.ownership_status === "mortgaged") {
      home += 1;
      disability += 1;
    }
  } else {
    home = -8;
  }

  if (dependents > 0) {
    disability += 1;
    life += 1;
  }

  if (marital_status === "married") {
    disability -= 1;
    life += 1;
  }

  if (vehicle != undefined) {
    if (date.getFullYear() - vehicle.year < 5) {
      auto += 1;
    }
  } else {
    auto = -8;
  }

  const evaluation = (score) => {
    let res = "";
    if (score == -8) {
      res = "inelegible";
    } else if (score < 1) {
      res = "economic";
    } else if (score < 3) {
      res = "regular";
    } else {
      res = "responsible"
    }
    return res;
  }

  return JSON.stringify({ 
      auto: evaluation(auto),
      disability: evaluation(disability),
      home: evaluation(home),
      life: evaluation(life) 
    });
}


const server = http.createServer((req, res) => {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  })
  req.on('end', () => {
    res.setHeader('Content-Type', 'application/json');
    res.end(calculate_risk(data));
  })
})

server.listen(3000);