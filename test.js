import moment from "moment-timezone";
import gnoment from "./gnoment.js";
import chalk from "chalk";

let inputs = [
  "2021-01-01",
  "2025-03-09T00:00:00Z",
  "2025-01-31",
  "2025-01-22T08:00:00",
  "2025-01-22 08:00:00",
];

let unixinputs = [
  1595007379, // 2020-07-17T13:36:19-04:00 DST
  1738330152, // 2020-07-17T13:36:19-04:00 No DST
];

let testEqual = (m, n) => {
  if (m !== n) {
    console.log(chalk.red("Failed"), m, "!=", n);
  } else {
    console.log(chalk.green("Passed"), m, "==", n);
  }
};

let testHeader = (h) => {
  console.log(chalk.cyan("\n" + h));
};

let test = () => {
  console.log(gnoment.utc("2023-07-18T18:00:00Z"));
  testHeader("moment(i)");
  for (let i of inputs) {
    testEqual(String(moment(i)), String(gnoment(i)));
  }
  testHeader("moment(i).format('YYYY')");
  for (let i of inputs) {
    testEqual(moment(i).format("YYYY"), gnoment(i).format("YYYY"));
  }
  testHeader("moment(i).format('MMM D, YYYY - h:mm a')");
  for (let i of inputs) {
    testEqual(
      moment(i).format("MMM D, YYYY - h:mm a"),
      gnoment(i).format("MMM D, YYYY - h:mm a")
    );
  }

  const tz = "America/Phoenix";
  testHeader("moment(i).format('MMM D, YYYY - h:mm a')");
  for (let i of inputs) {
    testEqual(String(moment(i).tz(tz)), String(gnoment(i).tz(tz)));
  }

  testHeader("moment(i).format('MMM D, YYYY - h:mm a')");
  for (let i of inputs) {
    testEqual(
      moment(i).tz(tz).format("MM/DD/YYYY hh:mm a z"),
      gnoment(i).tz(tz).format("MM/DD/YYYY hh:mm a z")
    );
  }

  const timezones = [
    "America/Los_Angeles",
    "Europe/Paris",
    "Asia/Tokyo",
    "UTC",
  ];
  for (let tz of timezones) {
    testHeader(`Testing timezone: ${tz}`);
    for (let i of inputs) {
      testEqual(String(moment.tz(i, tz)), String(gnoment.tz(i, tz)));
    }
  }

  testHeader("moment.unix(i).utc()");
  for (let i of unixinputs) {
    testEqual(String(moment.unix(i).utc()), String(gnoment.unix(i).utc()));
  }

  // Date Comparison Tests
  testHeader("Date Comparison Tests - isSame");
  testEqual(
    moment("2025-01-22T07:00:00Z").isSame(moment("2025-01-22T07:00:00Z")),
    gnoment("2025-01-22T07:00:00Z").isSame(gnoment("2025-01-22T07:00:00Z"))
  );

  testEqual(
    moment().isSame(moment("2025-01-22T07:00:00Z")),
    gnoment().isSame(gnoment("2025-01-22T07:00:00Z"))
  );

  testHeader("Date Comparison Tests - isSameOrBefore");
  testEqual(
    moment("2025-01-21T07:00:00Z").isSameOrBefore(
      moment("2025-01-22T07:00:00Z")
    ),
    gnoment("2025-01-21T07:00:00Z").isSameOrBefore(
      gnoment("2025-01-22T07:00:00Z")
    )
  );

  testHeader("Date Comparison Tests - isSameOrAfter");
  testEqual(
    moment("2025-01-23T07:00:00Z").isSameOrAfter(
      moment("2025-01-22T07:00:00Z")
    ),
    gnoment("2025-01-23T07:00:00Z").isSameOrAfter(
      gnoment("2025-01-22T07:00:00Z")
    )
  );

  testHeader("Date Comparison Tests - isAfter");
  testEqual(
    moment("2025-01-23T07:00:00Z").isAfter(moment("2025-01-22T07:00:00Z")),
    gnoment("2025-01-23T07:00:00Z").isAfter(gnoment("2025-01-22T07:00:00Z"))
  );

  testHeader("Date Arithmetic Tests - subtract");
  testEqual(
    String(moment("2025-01-23T07:00:00Z").subtract(1, "day")),
    String(gnoment("2025-01-23T07:00:00Z").subtract(1, "day"))
  );

  testHeader("Date Arithmetic Tests - add");
  testEqual(
    String(moment("2025-01-23T07:00:00Z").add(1, "day")),
    String(gnoment("2025-01-23T07:00:00Z").add(1, "day"))
  );

  testEqual(
    String(moment("2025-01-23T07:00:00Z").add(1, "year")),
    String(gnoment("2025-01-23T07:00:00Z").add(1, "year"))
  );

  testEqual(
    String(moment("2025-01-23T07:00:00Z").add(1, "month")),
    String(gnoment("2025-01-23T07:00:00Z").add(1, "month"))
  );

  testHeader("Date Arithmetic Tests - startOf");
  testEqual(
    String(moment("2025-01-23T07:00:00Z").startOf("year")),
    String(gnoment("2025-01-23T07:00:00Z").startOf("year"))
  );
  testEqual(
    String(moment("2025-01-23T07:00:00Z").startOf("month")),
    String(gnoment("2025-01-23T07:00:00Z").startOf("month"))
  );
  testEqual(
    String(moment("2025-01-23T07:00:00Z").startOf("day")),
    String(gnoment("2025-01-23T07:00:00Z").startOf("day"))
  );

  testHeader("Date Arithmetic Tests - endOf");
  testEqual(
    String(moment("2025-01-23T07:00:00Z").endOf("year")),
    String(gnoment("2025-01-23T07:00:00Z").endOf("year"))
  );
  testEqual(
    String(moment("2025-01-23T07:00:00Z").endOf("month")),
    String(gnoment("2025-01-23T07:00:00Z").endOf("month"))
  );
  testEqual(
    String(moment("2025-01-23T07:00:00Z").endOf("day")),
    String(gnoment("2025-01-23T07:00:00Z").endOf("day"))
  );
};

test();

// console.log(gnoment(new Date()))
// console.log('after test')
// console.log(moment.tz(inputs[0],'America/Los_Angeles'));
// //console.log(gnoment(inputs[0]).format('YYYY-MM-DD HH:mm:ss [GMT]ZZ'),'America/Los_Angeles');
// console.log(gnoment.tz(inputs[0],'America/Los_Angeles'));

// console.log(moment.unix(unixinputs[0]));
// console.log(moment.unix(1738330152))

// console.log(moment)
// console.log(gnoment)

// console.log(moment(inputs[0]))
// console.log(moment(inputs[0]).utc())

// console.log(moment(inputs[1]))
// console.log(moment(inputs[1]).utc())

// console.log(gnoment(inputs[0]))
// console.log(gnoment(inputs[0]).utc())

// console.log(gnoment(inputs[1]))
// console.log(gnoment(inputs[1]).utc())
