var sum_to_n_a = function (n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

var sum_to_n_b = function (n) {
  if (n == 1) {
    return 1;
  }
  return n + sum_to_n_b(n - 1);
};

var sum_to_n_c = function (n) {
  return (n * (n + 1)) / 2;
};

function main() {
  const numberToSum = 100;
  console.log(
    `Incremently summing from 1 to ${numberToSum} we get, ${sum_to_n_a(
      numberToSum
    )}`
  );
  console.log(
    `Recursively summing from 1 to ${numberToSum} we get, ${sum_to_n_b(
      numberToSum
    )}`
  );
  console.log(
    `Using formula summing from 1 to ${numberToSum} we get, ${sum_to_n_c(
      numberToSum
    )}`
  );
}

main();
