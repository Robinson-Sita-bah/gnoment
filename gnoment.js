/* © 2017-2025 Booz Allen Hamilton Inc. All Rights Reserved. */
// gnoment 🧙‍♂️🍄 - Wrapper using internationalized date & date-fns to look similar to moment.js to ease conversions
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
  toCalendarDate,
  CalendarDate,
} from "@internationalized/date";

import {
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
} from "date-fns";
import isNil from "lodash/isNil.js";

export function gnomentToCalendarDate(g) {
  return !isNil(g) && gnoment(g).toCalendarDate();
}

export function calendarDateToGnoment(g) {
  return !isNil(g) && gnoment(g);
}

export function rangeValueToGnomentRange(range) {
  let startDate = null;
  let endDate = null;

  if (range) {
    startDate = calendarDateToGnoment(range.start);
    endDate = calendarDateToGnoment(range.end);
  }

  return {
    startDate,
    endDate,
  };
}

export function gnomentRangeToRangeValue(startDate, endDate) {
  let rangeValue = null;

  const start = gnomentToCalendarDate(startDate);
  const end = gnomentToCalendarDate(endDate);

  if (start && end) {
    rangeValue = {
      start,
      end,
    };
  }

  return rangeValue;
}

export function gnomentToCalendarDateTime(g) {
  return gnoment(g).toCalendarDateTime();
}

// This function is used to parse a date string in a flexible way, and should always return a ZonedDateTime object.
const parseFlexibleDate = (input, timeZone = "UTC") => {
  let res;
  if (input.length === 10) {
    // If the input is exactly "YYYY-MM-DD", assume it's a date without time
    let d = parseDate(input);
    d = toZoned(d, timeZone);
    d = d.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    res = d;
  } else if (
    input.includes("Z") //||
    // input.includes("+") ||
    // input.includes("-")
  ) {
    // If it has a 'Z' (UTC) or timezone offset, treat as absolute timestamp
    res = parseAbsolute(input, timeZone);
  } else {
    // Otherwise, assume it's a local date-time string
    // TODO - Need to improve
    let inputUpdated = input;
    if (input.length > 11 && input[10] === " ")
      inputUpdated = `${input.substring(0, 10)}T${input.substring(11)}`;
    const d = parseDateTime(inputUpdated);
    res = toZoned(d, timeZone);
  }
  return res;
};

//Accepts (date, tz) or (tz) params
gnoment.tz = (...params) => {
  if (params.length === 2) {
    const zoneDateTime = parseFlexibleDate(params[0], params[1]);
    return gnoment(zoneDateTime);
  }

  if (params.length === 1) {
    return gnoment().tz(params[0]);
  }
  return gnoment(null);
};

let defaultTimeZone = getLocalTimeZone();

gnoment.tz.setDefault = (tz) => {
  defaultTimeZone = tz;
};

gnoment.utc = (date) => {
  return gnoment(date).utc();
};

class Gnoment {
  constructor(date) {
    this.zonedDateTime = null;
    if (date === undefined) {
      this.zonedDateTime = now(defaultTimeZone);
    } else if (typeof date === "string") {
      const dateObj = parseFlexibleDate(date, defaultTimeZone);
      this.zonedDateTime = toCalendarDateTime(dateObj);
      this.zonedDateTime = toZoned(this.zonedDateTime, defaultTimeZone);
    } else if (date instanceof Date) {
      const dateTime = new CalendarDateTime(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      );
      this.zonedDateTime = toZoned(dateTime, defaultTimeZone);
    } else if (date instanceof ZonedDateTime) {
      this.zonedDateTime = date;
    } else if (date instanceof CalendarDate) {
      this.zonedDateTime = toZoned(date, defaultTimeZone);
    } else if (date instanceof Gnoment) {
      this.zonedDateTime = date.zonedDateTime;
    }
  }

  toCalendarDate() {
    return toCalendarDate(this.zonedDateTime);
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
    if (!this.isValid()) return new Gnoment(null);
    const utcDateTime = toZoned(this.zonedDateTime, "UTC");
    return gnoment(utcDateTime);
  }

  unix() {
    const dUpdated = Math.floor(this.zonedDateTime.toDate().getTime() / 1000);
    return dUpdated;
  }

  valueOf() {
    return gnoment(this.zonedDateTime).unix() * 1000;
  }

  normalize(s) {
    let sUpdated = s;
    sUpdated = s.replace(/\+00:00\[UTC\]/g, "Z");
    sUpdated = s.replace(/\[.*?\]/g, "");
    return sUpdated;
  }

  // Node specific
  [Symbol.for("nodejs.util.inspect.custom")]() {
    if (this.isValid()) return `Gnoment<${this.format()}>`;
    return "Gnoment<Invalid date>";
  }

  toString() {
    if (this.isValid()) {
      return this.format(
        "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ",
        this.zonedDateTime.timeZone
      );
    }
    return "Invalid date";
  }

  convertOffsetToHoursMinutes = (offset) => {
    const totalMinutes = offset / 60000;
    const sign = totalMinutes >= 0 ? "+" : "-";
    const hours = Math.floor(Math.abs(totalMinutes) / 60);
    const minutes = Math.abs(totalMinutes) % 60;
    return `${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  getOffset = () => {
    return this.convertOffsetToHoursMinutes(this.zonedDateTime.offset);
  };

  clone = () => {
    return new Gnoment(this.zonedDateTime);
  };

  isValid() {
    if (this.zonedDateTime) {
      return true;
    }
    return false;
  }

  //Date Comparisons
  isSame = (date2) => {
    if (!this.isValid()) return false;
    return this.zonedDateTime.compare(date2.zonedDateTime) === 0;
  };

  isSameOrBefore = (date2) => {
    if (!this.isValid()) return false;
    return this.zonedDateTime.compare(date2.zonedDateTime) <= 0;
  };

  isBefore = (date2) => {
    if (!this.isValid()) return false;
    return this.zonedDateTime.compare(date2.zonedDateTime) < 0;
  };

  isSameOrAfter = (date2) => {
    if (!this.isValid()) return false;
    return this.zonedDateTime.compare(date2.zonedDateTime) >= 0;
  };

  isAfter = (date2) => {
    if (!this.isValid()) return false;
    return this.zonedDateTime.compare(date2.zonedDateTime) > 0;
  };

  isBetween = (start, end, unit, inclusivity = "()") => {
    if (!this.isValid()) return false;
    let currentUpdated = this;
    let startUpdated = gnoment(start);
    let endUpdated = gnoment(end);
    if (unit) {
      currentUpdated = gnoment(this.zonedDateTime).startOf(unit);
      startUpdated = startUpdated.zonedDateTime.startOf(unit);
      endUpdated = endUpdated.zonedDateTime.startOf(unit);
    }
    const afterStart =
      inclusivity[0] === "["
        ? currentUpdated.isSameOrAfter(startUpdated)
        : currentUpdated.isAfter(startUpdated);
    const beforeEnd =
      inclusivity[1] === "]"
        ? currentUpdated.isSameOrBefore(endUpdated)
        : currentUpdated.isBefore(endUpdated);
    return afterStart && beforeEnd;
  };

  //Date Calcs
  diff = (date2, unit) => {
    let res;
    if (unit === "years") {
      res = differenceInYears(this.zonedDateTime.toDate(), new Date(date2));
    } else if (unit === "months") {
      res = differenceInMonths(this.zonedDateTime.toDate(), new Date(date2));
    } else if (unit === "weeks") {
      res = differenceInWeeks(this.zonedDateTime.toDate(), new Date(date2));
    } else if (unit === "days") {
      res = differenceInDays(this.zonedDateTime.toDate(), new Date(date2));
    }

    if (isNil(res)) {
      res = 0;
    }
    return res;
  };

  // moment units =>zonedDatetime units
  unitLookupTable = {
    month: "months",
    day: "days",
    year: "years",
    week: "weeks",
  };

  unitLookup = (momentUnit) => {
    return momentUnit in this.unitLookupTable
      ? this.unitLookupTable[momentUnit]
      : momentUnit;
  };

  year = (input) => {
    this.zonedDateTime = this.zonedDateTime.set({ year: input });
    return Number(gnoment(this.zonedDateTime).format("YYYY"));
  };

  add = (duration, unit) => {
    if (!this.isValid()) return new Gnoment(null);
    const unitTemp = this.unitLookup(unit);
    this.zonedDateTime = this.zonedDateTime.add({ [unitTemp]: duration });
    return gnoment(this.zonedDateTime);
  };

  subtract = (duration, unit) => {
    if (!this.isValid()) return new Gnoment(null);
    const unitTemp = this.unitLookup(unit);
    this.zonedDateTime = this.zonedDateTime.subtract({ [unitTemp]: duration });
    return gnoment(this.zonedDateTime);
  };

  startOf = (unit) => {
    if (!this.isValid()) return new Gnoment(null);
    let res;
    if (unit === "year") {
      let temp = startOfYear(this.zonedDateTime);
      temp = temp.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      res = gnoment(temp);
    } else if (unit === "month") {
      let temp = startOfMonth(this.zonedDateTime);
      temp = temp.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      res = gnoment(temp);
    } else if (unit === "day") {
      let temp = this.zonedDateTime;
      temp = temp.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      res = gnoment(temp);
    }
    return res;
  };

  endOf = (unit) => {
    if (!this.isValid()) return new Gnoment(null);
    let res;
    if (unit === "year") {
      let temp = endOfYear(this.zonedDateTime);
      temp = temp.set({ hour: 23, minute: 59, second: 59, millisecond: 999 });
      res = gnoment(temp);
    } else if (unit === "month") {
      let temp = endOfMonth(this.zonedDateTime);
      temp = temp.set({ hour: 23, minute: 59, second: 59, millisecond: 999 });
      res = gnoment(temp);
    } else if (unit === "day") {
      let temp = this.zonedDateTime;
      temp = temp.set({ hour: 23, minute: 59, second: 59, millisecond: 999 });
      res = gnoment(temp);
    }
    return res;
  };

  tz = (timezone) => {
    const z = this.isValid() ? toZoned(this.zonedDateTime, timezone) : null;
    return gnoment(z);
  };

  format = (format, timezone) => {
    if (!this.isValid()) return "Invalid date";

    // Create date object and handle timezone if provided
    let tzUpdated = timezone;
    let formatUpdated = format;

    if (!formatUpdated) formatUpdated = "YYYY-MM-DDTHH:mm:ssZ";
    if (!tzUpdated) tzUpdated = this.zonedDateTime.timeZone;

    const date = this.zonedDateTime.toDate(tzUpdated);
    const d = new Date(date);
    let timezoneShort = "";

    const getDateEnding = (day) => {
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    // Helper function to get timezone offset in format ±HH:mm
    const getTimezoneOffset = () => {
      return this.convertOffsetToHoursMinutes(this.zonedDateTime.offset);
    };
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tzUpdated,
      timeZoneName: "short",
    }).formatToParts(date);

    // Extract the part corresponding to the timezone name
    const tzNamePart = parts.find((part) => part.type === "timeZoneName");
    timezoneShort = tzNamePart ? tzNamePart.value : "";
    const timeOptions = tzUpdated ? { timeZone: tzUpdated } : {};
    const YYYYFormat = d.toLocaleString("en-US", {
      ...timeOptions,
      year: "numeric",
    });
    const formatTokens = {
      // Year
      YYYY: YYYYFormat.length === 1 ? YYYYFormat.padStart(4, "0") : YYYYFormat,
      YY: d.toLocaleString("en-US", { ...timeOptions, year: "2-digit" }),

      // Month
      MM: d.toLocaleString("en-US", { ...timeOptions, month: "2-digit" }),
      M: d.toLocaleString("en-US", { ...timeOptions, month: "numeric" }),
      MMMM: d.toLocaleString("en-US", { ...timeOptions, month: "long" }),
      MMM: d.toLocaleString("en-US", { ...timeOptions, month: "short" }),

      // Day
      DD: d.toLocaleString("en-US", { ...timeOptions, day: "2-digit" }),
      Do: d
        .toLocaleString("en-US", { ...timeOptions, day: "numeric" })
        .concat(getDateEnding(d.getDate())),
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
      ZZ: getTimezoneOffset(d, tzUpdated).replace(":", ""),
      Z: getTimezoneOffset(d, tzUpdated).replace("+00:00", "Z"),
      z: timezoneShort || defaultTimeZone,
    };

    // Replace tokens with actual values
    formatUpdated = formatUpdated.replace("LL", "MMMM D, YYYY");
    formatUpdated = formatUpdated.replace("ll", "MMM D, YYYY");
    formatUpdated = formatUpdated.replace("l", "M/D/YYYY");
    return formatUpdated.replace(
      /\[([^\]]+)\]|YYYY|YY|MMMM|MMM|MM|M|DD|Do|D|dddd|ddd|HH|H|hh|h|mm|m|ss|s|SSS|A|a|ZZ|Z|z/g,
      (match, contents) => contents || formatTokens[match]
    );
  };

  toJSON() {
    return this.utc().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  }
}

export function gnoment(d) {
  return new Gnoment(d);
}

gnoment.unix = (d) => {
  let dUpdated = d;
  if (dUpdated === undefined) return new Gnoment(null);
  if (dUpdated === null) dUpdated = 0;
  return new Gnoment(new Date(dUpdated * 1000));
};

gnoment.isGnoment = (date) => {
  return date instanceof Gnoment;
};

export default gnoment;
