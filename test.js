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

// "Jan 01, 2025"

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

  testHeader("moment(i).format('ddd D')");
  for (let i of inputs) {
    testEqual(moment().format("ddd D"), gnoment().format("ddd D"));
  }

  testHeader("moment(i).format()");
  for (let i of inputs) {
    testEqual(moment(i).format(), gnoment(i).format());
  }

  testHeader("moment(i).format('ddd')");
  for (let i of inputs) {
    testEqual(moment().format("ddd"), gnoment().format("ddd"));
  }
  testHeader("moment(i).format('D')");
  for (let i of inputs) {
    testEqual(moment().format("D"), gnoment().format("D"));
  }

  testHeader("moment(i).format('dddd, MMMM D, YYYY')");
  for (let i of inputs) {
    testEqual(
      moment().format("dddd, MMMM D, YYYY"),
      gnoment().format("dddd, MMMM D, YYYY")
    );
  }

  testHeader("moment(i).format('LL')");
  for (let i of inputs) {
    testEqual(moment().format("LL"), gnoment().format("LL"));
  }

  testHeader("moment(i).format('ll')");
  for (let i of inputs) {
    testEqual(moment().format("ll"), gnoment().format("ll"));
  }

  testHeader("moment(i).format('MMMM Do, YYYY')");
  for (let i of inputs) {
    testEqual(
      moment(i).format("MMMM Do, YYYY"),
      gnoment(i).format("MMMM Do, YYYY")
    );
  }

  testHeader("moment(i).format('ddd, ll')");
  for (let i of inputs) {
    testEqual(moment(i).format("ddd, ll"), gnoment(i).format("ddd, ll"));
  }

  testHeader("moment(i).toJSON()");
  for (let i of inputs) {
    testEqual(moment(i).toJSON(), gnoment(i).toJSON());
  }

  testHeader("moment(i).tz('America/Los_Angeles').toJSON()");
  for (let i of inputs) {
    testEqual(
      moment("2025-01-23T07:00:00Z").tz("America/Los_Angeles").toJSON(),
      gnoment("2025-01-23T07:00:00Z").tz("America/Los_Angeles").toJSON()
    );
  }

  const tz = "America/Phoenix";
  testHeader("moment(i).tz(tz)");
  for (let i of inputs) {
    testEqual(String(moment(i).tz(tz)), String(gnoment(i).tz(tz)));
  }

  testHeader("moment.tz(tz)");
  for (let i of inputs) {
    testEqual(String(moment.tz(tz)), String(gnoment.tz(tz)));
  }

  testHeader("moment.tz(i, tz)");
  for (let i of inputs) {
    testEqual(String(moment.tz(i, tz)), String(gnoment.tz(i, tz)));
  }

  testHeader("moment(i).format('MMM D, YYYY - h:mm a z')");
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

  testHeader("moment(i).utc()");
  for (let i of inputs) {
    testEqual(String(moment(i).utc()), String(gnoment(i).utc()));
  }

  testHeader("Gnoment with UTC param but no direct param");
  testEqual(
    String(moment.utc("2023-07-18T18:00:00Z")),
    String(gnoment.utc("2023-07-18T18:00:00Z"))
  );

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

  testHeader("Date Arithmetic Tests - diff");
  testEqual(
    moment("2025-07-20T07:00:00Z").diff("2025-07-18T07:00:00Z", "days"),
    gnoment("2025-07-20T07:00:00Z").diff("2025-07-18T07:00:00Z", "days")
  );

  testEqual(
    moment("2025-12-20T07:00:00Z").diff("2025-07-18T07:00:00Z", "weeks"),
    gnoment("2025-12-20T07:00:00Z").diff("2025-07-18T07:00:00Z", "weeks")
  );

  testEqual(
    moment("2025-12-01T07:00:00Z").diff("2025-07-01T07:00:00Z", "months"),
    gnoment("2025-12-01T07:00:00Z").diff("2025-07-01T07:00:00Z", "months")
  );

  testEqual(
    moment("2024-12-01T07:00:00Z").diff("2023-12-01T07:00:00Z", "years"),
    gnoment("2024-12-01T07:00:00Z").diff("2023-12-01T07:00:00Z", "years")
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

  testHeader("isValid");
  testEqual(
    moment("2025-01-23T07:00:00Z").isValid(),
    gnoment("2025-01-23T07:00:00Z").isValid()
  );

  testHeader("Not isValid");
};

test();

console.log(
  moment(inputs[0]).utc().format(),
  gnoment(inputs[0]).utc().format()
);
console.log(moment(inputs[0]).utc(), gnoment(inputs[0]).utc());
console.log(moment(inputs[0]), gnoment(inputs[0]));

console.log(moment().format, gnoment().format);
