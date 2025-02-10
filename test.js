import gnoment from "./gnoment.js";
import moment from "moment-timezone";
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
  testHeader("moment(null)");
  testEqual(String(moment(null)), String(gnoment(null)));

  testHeader("moment(undefined)");
  testEqual(String(moment(undefined)), String(gnoment(undefined)));

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

  testHeader("moment(i).utc().format()");
  for (let i of inputs) {
    testEqual(moment(i).utc().format(), gnoment(i).utc().format());
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
      moment(i).tz("America/Los_Angeles").toJSON(),
      gnoment(i).tz("America/Los_Angeles").toJSON()
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

  testHeader("moment.unix(undefined)");
  testEqual(String(moment.unix(undefined)), String(gnoment.unix(undefined)));

  testHeader("moment.unix(undefined).tz('America/Los_Angeles')");
  testEqual(
    String(moment.unix(undefined).tz("America/Los_Angeles")),
    String(gnoment.unix(undefined).tz("America/Los_Angeles"))
  );

  testHeader("moment.unix(null)");
  testEqual(String(moment.unix(null)), String(gnoment.unix(null)));

  testHeader("moment.unix(0)");
  testEqual(String(moment.unix(0)), String(gnoment.unix(0)));

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

  testEqual(
    String(moment(null).subtract(1, "day")),
    String(gnoment(null).subtract(1, "day"))
  );

  testHeader("Date Arithmetic Tests - add");
  testEqual(
    String(moment("2025-01-23T07:00:00Z").add(1, "day")),
    String(gnoment("2025-01-23T07:00:00Z").add(1, "day"))
  );

  testEqual(
    String(moment(null).add(1, "day")),
    String(gnoment(null).add(1, "day"))
  );

  testEqual(
    String(moment("2025-01-23T07:00:00Z").add(1, "year")),
    String(gnoment("2025-01-23T07:00:00Z").add(1, "year"))
  );

  testEqual(
    String(moment("2025-01-23T07:00:00Z").add(1, "month")),
    String(gnoment("2025-01-23T07:00:00Z").add(1, "month"))
  );

  testHeader("Date Arithmetic Tests - startOf('year')");
  testEqual(
    String(moment("2025-01-23T07:00:00Z").startOf("year")),
    String(gnoment("2025-01-23T07:00:00Z").startOf("year"))
  );

  testEqual(
    String(moment(null).startOf("year")),
    String(gnoment(null).startOf("year"))
  );

  testEqual(
    String(moment(null).tz("America/Los_Angeles").startOf("year")),
    String(gnoment(null).tz("America/Los_Angeles").startOf("year"))
  );

  testEqual(
    String(
      moment(null)
        .tz("America/Los_Angeles")
        .startOf("year")
        .format("YYYY-MM-DD")
    ),
    String(
      gnoment(null)
        .tz("America/Los_Angeles")
        .startOf("year")
        .format("YYYY-MM-DD")
    )
  );

  testHeader("Date Arithmetic Tests - startOf('month')");
  testEqual(
    String(moment("2025-01-23T07:00:00Z").startOf("month")),
    String(gnoment("2025-01-23T07:00:00Z").startOf("month"))
  );

  testEqual(
    String(moment(null).startOf("month")),
    String(gnoment(null).startOf("month"))
  );

  testEqual(
    String(moment(null).tz("America/Los_Angeles").startOf("month")),
    String(gnoment(null).tz("America/Los_Angeles").startOf("month"))
  );

  testEqual(
    String(
      moment(null)
        .tz("America/Los_Angeles")
        .startOf("month")
        .format("YYYY-MM-DD")
    ),
    String(
      gnoment(null)
        .tz("America/Los_Angeles")
        .startOf("month")
        .format("YYYY-MM-DD")
    )
  );

  testHeader("Date Arithmetic Tests - startOf('day')");

  testEqual(
    String(moment("2025-01-23T07:00:00Z").startOf("day")),
    String(gnoment("2025-01-23T07:00:00Z").startOf("day"))
  );

  testEqual(
    String(moment(null).startOf("day")),
    String(gnoment(null).startOf("day"))
  );

  testEqual(
    String(moment(null).tz("America/Los_Angeles").startOf("day")),
    String(gnoment(null).tz("America/Los_Angeles").startOf("day"))
  );

  testEqual(
    String(
      moment(null).tz("America/Los_Angeles").startOf("day").format("YYYY-MM-DD")
    ),
    String(
      gnoment(null)
        .tz("America/Los_Angeles")
        .startOf("day")
        .format("YYYY-MM-DD")
    )
  );

  testHeader("Date Arithmetic Tests - endOf('year')");
  testEqual(
    String(moment("2025-01-23T07:00:00Z").endOf("year")),
    String(gnoment("2025-01-23T07:00:00Z").endOf("year"))
  );

  testEqual(
    String(moment(null).endOf("year")),
    String(gnoment(null).endOf("year"))
  );

  testEqual(
    String(moment(null).tz("America/Los_Angeles").endOf("year")),
    String(gnoment(null).tz("America/Los_Angeles").endOf("year"))
  );

  testEqual(
    String(
      moment(null).tz("America/Los_Angeles").endOf("year").format("YYYY-MM-DD")
    ),
    String(
      gnoment(null).tz("America/Los_Angeles").endOf("year").format("YYYY-MM-DD")
    )
  );

  testHeader("Date Arithmetic Tests - endOf('month')");

  testEqual(
    String(moment("2025-01-23T07:00:00Z").endOf("month")),
    String(gnoment("2025-01-23T07:00:00Z").endOf("month"))
  );

  testEqual(
    String(moment(null).endOf("month")),
    String(gnoment(null).endOf("month"))
  );

  testEqual(
    String(moment(null).tz("America/Los_Angeles").endOf("month")),
    String(gnoment(null).tz("America/Los_Angeles").endOf("month"))
  );

  testEqual(
    String(
      moment(null).tz("America/Los_Angeles").endOf("month").format("YYYY-MM-DD")
    ),
    String(
      gnoment(null)
        .tz("America/Los_Angeles")
        .endOf("month")
        .format("YYYY-MM-DD")
    )
  );

  testHeader("Date Arithmetic Tests - endOf('day')");

  testEqual(
    String(moment("2025-01-23T07:00:00Z").endOf("day")),
    String(gnoment("2025-01-23T07:00:00Z").endOf("day"))
  );

  testEqual(
    String(moment(null).endOf("day")),
    String(gnoment(null).endOf("day"))
  );

  testEqual(
    String(moment(null).tz("America/Los_Angeles").endOf("day")),
    String(gnoment(null).tz("America/Los_Angeles").endOf("day"))
  );

  testEqual(
    String(
      moment(null).tz("America/Los_Angeles").endOf("day").format("YYYY-MM-DD")
    ),
    String(
      gnoment(null).tz("America/Los_Angeles").endOf("day").format("YYYY-MM-DD")
    )
  );

  testHeader("isValid");
  testEqual(
    moment("2025-01-23T07:00:00Z").isValid(),
    gnoment("2025-01-23T07:00:00Z").isValid()
  );

  testEqual(moment(undefined).isValid(), gnoment(undefined).isValid());

  testHeader("Not isValid");
  testEqual(moment(null).isValid(), gnoment(null).isValid());

  testHeader("Invalid date str");

  testEqual(
    moment
      .unix(undefined)
      .tz("America/Los_Angeles")
      .format("MM/DD/YYYY [at] hh:mm a z"),
    gnoment
      .unix(undefined)
      .tz("America/Los_Angeles")
      .format("MM/DD/YYYY [at] hh:mm a z")
  );

  testHeader("format is a func");
  testEqual(typeof moment().format, typeof gnoment().format);
};

test();

console.log(moment(inputs[0]).utc(), gnoment(inputs[0]).utc());
console.log(moment(inputs[0]), gnoment(inputs[0]));

console.log(moment(null).subtract(1, "day"), gnoment(null).subtract(1, "day"));
