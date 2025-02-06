const calculateChange = (amount) => {
  let hold = `$${amount} ==> `;
  if (amount > 100) {
    hold += "Error: the number is too large";
  } else if (amount < 0.01) {
    hold += "Error: the number is too small";
  } else {
    let com = "";
    amount = Math.floor(amount * 100.0);
    if (amount >= 100) {
      hold += `${Math.floor(amount / 100)} dollars`;
      amount %= 100;
      com = ",";
    }
    if (amount / 25 >= 1) {
      hold += `${com} ${Math.floor(amount / 25)} quarters`;
      amount %= 25;
      com = ",";
    }
    if (amount / 10 >= 1) {
      hold += `${com} ${Math.floor(amount / 10)} dime`;
      amount %= 10;
      com = ",";
    }

    if (amount / 5 >= 1) {
      hold += `${com} ${Math.floor(amount / 5)} nickel`;
      amount %= 5;
      com = ",";
    }
    if (amount >= 1) {
      hold += `${com} ${amount} pennies`;
    }
  }
  return hold;
};
// Sample test cases
console.log(calculateChange(4.62));
// $4.62 ==> 4 dollars, 2 quarters, 1 dime, 2 pennies
console.log(calculateChange(0.16));
// $0.16 ==> 1 dime, 1 nickel, 1 penny
console.log(calculateChange(150.11));
// $150.11 ==> Error: the number is too large
console.log(calculateChange(22.11));
console.log(calculateChange(1.01));
// Add additional test cases here
