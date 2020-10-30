
module.exports = class risk {

  constructor() { }

  calculate_risk(json_str) {

    const { age, dependents, income, marital_status, risk_questions, house, vehicle } = JSON.parse(json_str);
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
    if (income === 0) {
      disability = -8
    }

    if (house.ownership_status != undefined) {
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

    if (vehicle.year != undefined) {
      if (date.getFullYear() - vehicle.year < 5) {
        auto += 1;
      }
    } else {
      auto = -8;
    }

    const evaluation = (score) => {
      let res = "";

      if (score > 2) {
        res = "responsible";
      } else if (score > 0) {
        res = "regular";
      } else if (score > -7) {
        res = "economic";
      } else {
        res = "ineligible";
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
}