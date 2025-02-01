// gnoment 🧙‍♂️🍄 - Internationalized date wrapper to look similar to moment.js to ease conversions
// https://react-spectrum.adobe.com/internationalized/date/ZonedDateTime.html

import {
  now,
  getLocalTimeZone,
  CalendarDateTime,
  parseDate,
  parseDateTime,
  parseAbsolute,
  toCalendarDateTime,
  toZoned,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  ZonedDateTime,
} from "@internationalized/date";

let gnomentToCalendarDate = (gnoment) => {
  return gnoment.toCalendarDate();
};

let gnomentToCalendarDateTime = (gnoment) => {
  return gnoment.toCalendarDateTime();
};

let gnomentToZonedDateTime = (gnoment) => {
  return gnoment.toZonedDateTime();
};

// This function is used to parse a date string in a flexible way, and should always return a ZonedDateTime object.
const parseFlexibleDate = (input, timeZone = "UTC") => {
  console.log(input);
  if (input.length === 10) {
    // If the input is exactly "YYYY-MM-DD", assume it's a date without time
    // console.log('parseDate')
    let d = parseDate(input);
    d = toZoned(d, timeZone);
    d = d.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    return d;
  } else if (
    input.includes("Z") //||
    // input.includes("+") ||
    // input.includes("-")
  ) {
    // If it has a 'Z' (UTC) or timezone offset, treat as absolute timestamp
    // console.log('parseAbsolute');
    // return parseAbsolute(input, timeZone);
    return parseAbsolute(input, timeZone);
  } else {
    // Otherwise, assume it's a local date-time string
    // TODO - Need to improve
    if (input.length > 11 && input[10] === " ")
      input = input.substring(0, 10) + "T" + input.substring(11);
    // console.log(input);
    let d = parseDateTime(input);
    return toZoned(d, timeZone);
  }
};

function gnoment(d) {
  return new Gnoment(d);
}

gnoment.unix = (d) => {
  return new Gnoment(new Date(d * 1000));
};

gnoment.tz = (date, tz) => {
  const zoneDateTime = parseFlexibleDate(date, tz);
  return gnoment(zoneDateTime);
};

gnoment.utc = (date) => {
  return gnoment(date).utc();
};

class Gnoment {
  constructor(date) {
    if (date === undefined) {
      this.zonedDateTime = now(getLocalTimeZone());
    } else if (typeof date === "string") {
      const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      // console.log('localTimeZone:',localTimeZone)
      const dateObj = parseFlexibleDate(date, localTimeZone);
      this.zonedDateTime = toCalendarDateTime(dateObj);
      this.zonedDateTime = toZoned(this.zonedDateTime, localTimeZone);
      // console.log('this.zonedDateTime:',this.zonedDateTime);
    } else if (date instanceof Date) {
      const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const dateTime = new CalendarDateTime(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      );
      this.zonedDateTime = toZoned(dateTime, localTimeZone);
    } else if (date instanceof ZonedDateTime) {
      this.zonedDateTime = date;
    } else if (date instanceof Gnoment) {
      this.zonedDateTime = date.zonedDateTime;
    } else {
      throw new Error("Unhandled input to Gnoment constructor");
    }
  }

  toCalendarDate() {
    return this.zonedDateTime.toCalendarDate();
  }

  toCalendarDateTime() {
    return toCalendarDateTime(this.zonedDateTime);
  }

  toZonedDateTime() {
    return this.zonedDateTime;
  }

  getCalendarDateTime() {
    return this.zonedDateTime;
  }

  utc() {
    const utcDateTime = toZoned(this.zonedDateTime, "UTC");
    return gnoment(utcDateTime);
  }

  normalize(s) {
    // return s;
    s = s.replace(/\+00:00\[UTC\]/g, "Z");
    s = s.replace(/\[.*?\]/g, "");
    return s;
  }

  // Node specific
  [Symbol.for("nodejs.util.inspect.custom")]() {
    // return `${this.toString()}`;
    return `Gnoment<${this.normalize(String(this.zonedDateTime))}>`;
  }

  toString() {
    return this.format(
      "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ",
      this.zonedDateTime.timeZone
    );
  }

  convertOffsetToHoursMinutes = (offset) => {
    const totalMinutes = offset / 60000;
    const sign = totalMinutes >= 0 ? "+" : "-";
    const hours = Math.floor(Math.abs(totalMinutes) / 60);
    const minutes = Math.abs(totalMinutes) % 60;
    return `${sign}${String(hours).padStart(2, "0")}${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  getOffset = () => {
    return this.convertOffsetToHoursMinutes(this.zonedDateTime.offset);
  };

  //Date Comparisons
  isSame = (date2) => {
    return this.zonedDateTime.compare(date2.zonedDateTime) === 0;
  };

  isSameOrBefore = (date2) => {
    return this.zonedDateTime.compare(date2.zonedDateTime) <= 0;
  };

  isBefore = (date2) => {
    return this.zonedDateTime.compare(date2.zonedDateTime) < 0;
  };

  isSameOrAfter = (date2) => {
    return this.zonedDateTime.compare(date2.zonedDateTime) >= 0;
  };

  isAfter = (date2) => {
    return this.zonedDateTime.compare(date2.zonedDateTime) > 0;
  };

  isBetween = () => {
    //Code here
  };

  //Date Calcs
  diff = () => {
    //Code here
  };

  // moment units =>zonedDatetime units
  unitLookupTable = {
    month: "months",
    day: "days",
    year: "years",
    week: "weeks",
  };

  unitLookup = (momentUnit) => {
    if (momentUnit in this.unitLookupTable)
      return this.unitLookupTable[momentUnit];
    else return momentUnit;
  };

  add = (duration, unit) => {
    let unitTemp = this.unitLookup(unit);
    return gnoment(this.zonedDateTime.add({ [unitTemp]: duration }));
  };

  subtract = (duration, unit) => {
    let unitTemp = this.unitLookup(unit);
    return gnoment(this.zonedDateTime.subtract({ [unitTemp]: duration }));
  };

  startOf = (unit) => {
    if (unit === "year") {
      let temp = startOfYear(this.zonedDateTime);
      temp = temp.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      return gnoment(temp);
    } else if (unit === "month") {
      let temp = startOfMonth(this.zonedDateTime);
      temp = temp.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      return gnoment(temp);
    } else if (unit === "day") {
      let temp = this.zonedDateTime;
      temp = temp.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      return gnoment(temp);
    }
  };

  endOf = (unit) => {
    if (unit === "year") {
      let temp = endOfYear(this.zonedDateTime);
      temp = temp.set({ hour: 23, minute: 59, second: 59, millisecond: 999 });
      return gnoment(temp);
    } else if (unit === "month") {
      let temp = endOfMonth(this.zonedDateTime);
      temp = temp.set({ hour: 23, minute: 59, second: 59, millisecond: 999 });
      return gnoment(temp);
    } else if (unit === "day") {
      let temp = this.zonedDateTime;
      temp = temp.set({ hour: 23, minute: 59, second: 59, millisecond: 999 });
      return gnoment(temp);
    }
  };

  tz = (timezone) => {
    const z = toZoned(this.zonedDateTime, timezone);
    return gnoment(z);
  };

  format = (format, timezone) => {
    // Create date object and handle timezone if provided

    const date = this.zonedDateTime.toDate(timezone);
    const d = new Date(date);
    let timezoneShort = "";

    // Helper function to get timezone offset in format ±HH:mm
    const getTimezoneOffset = (date, timezone) => {
      return this.convertOffsetToHoursMinutes(this.zonedDateTime.offset);
    };
    if (!timezone) {
      timezone = this.zonedDateTime.timeZone;
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: this.zonedDateTime.timeZone,
        timeZoneName: "short",
      }).formatToParts(date);

      // Extract the part corresponding to the timezone name
      const tzNamePart = parts.find((part) => part.type === "timeZoneName");
      timezoneShort = tzNamePart ? tzNamePart.value : "";
      // timezone = this.zonedDateTime.timeZone;
    }
    const timeOptions = timezone ? { timeZone: timezone } : {};
    const formatTokens = {
      // Year
      YYYY: d.toLocaleString("en-US", { ...timeOptions, year: "numeric" }),
      YY: d.toLocaleString("en-US", { ...timeOptions, year: "2-digit" }),

      // Month
      MM: d.toLocaleString("en-US", { ...timeOptions, month: "2-digit" }),
      M: d.toLocaleString("en-US", { ...timeOptions, month: "numeric" }),
      MMMM: d.toLocaleString("en-US", { ...timeOptions, month: "long" }),
      MMM: d.toLocaleString("en-US", { ...timeOptions, month: "short" }),

      // Day
      DD: d.toLocaleString("en-US", { ...timeOptions, day: "2-digit" }),
      D: d.toLocaleString("en-US", { ...timeOptions, day: "numeric" }),
      dddd: d.toLocaleString("en-US", { ...timeOptions, weekday: "long" }),
      ddd: d.toLocaleString("en-US", { ...timeOptions, weekday: "short" }),

      // Hour
      HH: d
        .toLocaleString("en-US", {
          ...timeOptions,
          hour: "2-digit",
          hour12: false,
        })
        .replace(/24/g, "00"),
      H: d
        .toLocaleString("en-US", {
          ...timeOptions,
          hour: "numeric",
          hour12: false,
        })
        .replace(/24/g, "0"),
      hh: d
        .toLocaleString("en-US", {
          ...timeOptions,
          hour: "2-digit",
          hour12: true,
        })
        .replace(/ AM| PM/g, ""),
      h: d
        .toLocaleString("en-US", {
          ...timeOptions,
          hour: "numeric",
          hour12: true,
        })
        .replace(/ AM| PM/g, ""),

      // Minute
      mm: d
        .toLocaleString("en-US", { ...timeOptions, minute: "2-digit" })
        .padStart(2, "0"),
      m: d.toLocaleString("en-US", { ...timeOptions, minute: "numeric" }),

      // Second
      ss: d
        .toLocaleString("en-US", { ...timeOptions, second: "2-digit" })
        .padStart(2, "0"),
      s: d.toLocaleString("en-US", { ...timeOptions, second: "numeric" }),

      // Millisecond
      SSS:
        d
          .toLocaleString("en-US", {
            ...timeOptions,
            fractionalSecondDigits: 3,
          })
          .split(".")[1] || "000",

      // AM/PM
      A: d
        .toLocaleString("en-US", {
          ...timeOptions,
          hour12: true,
          hour: "numeric",
        })
        .split(" ")[1],
      a: d
        .toLocaleString("en-US", {
          ...timeOptions,
          hour12: true,
          hour: "numeric",
        })
        .split(" ")[1]
        .toLowerCase(),

      // Timezone
      ZZ: getTimezoneOffset(d, timezone).replace(":", ""),
      Z: getTimezoneOffset(d, timezone),
      z: timezoneShort || Intl.DateTimeFormat().resolvedOptions().timeZone,
      // 'z': d.toLocaleString('en-US', { timeZone: timezone, timeZoneName: 'short' }),
    };

    // Replace tokens with actual values
    return format.replace(
      /\[([^\]]+)\]|YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd|HH|H|hh|h|mm|m|ss|s|SSS|A|a|ZZ|Z|z/g,
      (match, contents) => contents || formatTokens[match]
    );
  };
}

export {
  gnoment,
  gnomentToCalendarDate,
  gnomentToCalendarDateTime,
  gnomentToZonedDateTime,
};
export default gnoment;
