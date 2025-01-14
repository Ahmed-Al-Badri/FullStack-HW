/** Exercise 01 - Fizzbuzz

Write a program that writes all the numbers from 1 to 100, with some exceptions: 
- For numbers divisible by 3, print “fizz” 
- For numbers divisible by 5 (but not 3), print “buzz” 
- For numbers divisible by 3 and 5, print “fizzbuzz”

Use console.log() to write the proper output to the command line.

**/

const fizzbuzz = () => {
  let b = "";
  for (let x = 1; x <= 100; x++) {
    b = "";
    if (x % 3 == 0) {
      b += "fizz";
    }
    if (x % 5 == 0) {
      b += "buzz";
    } else if (b == "") {
      b = `${x}`;
    }
    console.log(b);
  }
  // Add your code here
};

fizzbuzz();
// 1
// 2
// fizz
// 4
// buzz
// fizz
// 7
// 8
// fizz
// buzz
// 11
// fizz
// 13
// 14
// fizzbuzz
// ...
