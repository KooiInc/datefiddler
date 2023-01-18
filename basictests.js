import factory from "./datefiddler.js";
import {strictEqual, deepStrictEqual, doesNotThrow} from 'node:assert/strict';
runTests();
process.exit(0);

function runTests() {
  const xDate = factory(exts);
  console.clear();
  const d = new Date();
  const formatter = d => d.toLocaleString(`en-GB`);
  const dsrClone = new Date(2000, 0, 1);
  const wd = xDate(d, formatter);
  const dsr = wd.clone(formatter).set(new Date(2000, 0, 1));
  const getLine = err => `\n   @line ${err.stack.split(`\n`)[1].split(`:`).slice(-2, -1).shift()}\n`;
  const logs = [];
  let errors = false;
  let cnt = 0;
  const log = str => logs.push(`  ${str.replace(/\n/, `\n  `)}`);
  const runTest = (value, expected, okLine, testFn2Run = strictEqual) => {
    cnt += 1;
    try {
      testFn2Run(value instanceof Function ? value() : value, expected, okLine);
      log(`   😀 test ${okLine} OK`);
    } catch (err) {
      errors = true;
      log(`   🤐 ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
    }
  };

  log(`\nNote: formatter = ${formatter.toString()}`);
  log(`\n--- instances ---`);
  log(`\nwd = xDate(new Date(), formatter) => ${wd.value}`);
  runTest(wd.ISO, d.toISOString(), `wd [date]`);
  runTest(wd.value, formatter(d), `wd [value]`);
  log(`\ndsr = wd.clone(formatter).set(new Date(2000, 0 , 1)) => ${dsr.value}`);
  runTest(dsr.ISO, dsrClone.toISOString(), `dsr = wd clone and set [date]`);
  runTest(dsr.value, formatter(dsrClone), `dsr = wd clone and set [value]`);

  log(`\n--- methods ---`);

  dsr.set(new Date(2000, 1, 1));
  log(`\ndsr.set(new Date(2000, 1 , 1) => ${dsr.value}`);
  runTest(dsr.date, new Date(2000, 1, 1), `dsr.set [date]`, deepStrictEqual);
  runTest(dsr.value, formatter(new Date(2000, 1, 1)), `dsr.set [value]`);

  dsr.add(`2 days`);
  log(`\ndsr.add(\`2 days\`) => ${dsr.value}`);
  runTest(dsr.ISO, new Date(2000, 1, 3).toISOString(), `dsr.add [date]`);

  log(`\ndsr.reset() => ${dsr.reset().value}`)
  runTest(dsr.date, dsr.initial, `dsr.reset [date]`, deepStrictEqual);

  log(`\n--- exensions ---`);

  let newDate = new Date(wd.date);
  newDate.setDate(newDate.getDate() + 7);
  wd.nextWeek();
  log(`\nwd.nextWeek() => ${wd.value}`);
  runTest(wd.date, newDate, `wd.nextWeek [date]`, deepStrictEqual);
  runTest(wd.value, formatter(newDate), `wd.nextWeek [value]`);

  newDate = new Date(wd.date);
  newDate.setMonth(newDate.getMonth() - 2);
  wd.previousMonth().previousMonth();
  log(`\n--- chain extension methods ---`);
  log(`\nwd.previousMonth().previousMonth() => ${wd.value}`);
  runTest(wd.date, newDate, `wd.previousMonth (2x) (double) [date]`, deepStrictEqual);
  runTest(wd.value, formatter(newDate), `wd.previousMonth (2x) (double) [value]`);

  log(`\n--- chain extension methods and "native" methods ---`);

  newDate = new Date(wd.date);
  newDate.setDate(newDate.getDate() - 1);
  newDate.setFullYear(newDate.getFullYear() + 3);
  wd.yesterday().add(`3 years`);
  log(`\nwd.yesterday().add(\`3 years\`) => ${wd.value}`);
  runTest(wd.date, newDate, `wd.yesterday.add [date]`, deepStrictEqual);
  runTest(wd.value, formatter(newDate), `wd.yesterday.add [value]`);

  log(`\n--- reset instance date to its initial date ---`);
  log(`\nwd.value => current value ${wd.value}`)
  wd.reset();
  log(`wd.reset().value => new value ${wd.value}`);
  runTest(wd.date, wd.initial, `wd.reset (initial) [date]`, deepStrictEqual);
  runTest(wd.value, formatter(wd.initial), `wd.reset (initial) [value]`);

  log(`\n--- reset date *and* initial date to current instance date value ---`);

  wd.set(new Date(2021, 7, 27));
  wd.update2Current();
  log(`\nwd.set(new Date(2021, 7, 27)); => ${wd.value}`);
  log(`wd.update2Current() => ${wd.value}`);
  runTest(wd.date, wd.initial, `wd.reset (all) [date]`, deepStrictEqual);
  runTest(wd.value, formatter(wd.initial), `wd.reset (all) [value]`);

  log(`\n--- reset all using [instance].set ---`);

  const ddr = new Date();
  dsr.set(ddr, true);
  log(`\ndsr.set(new Date(), true) => ${dsr.value}`);
  runTest(dsr.date, ddr, `dsr.set (all) [date]`, deepStrictEqual);
  runTest(dsr.value, formatter(dsr), `dsr.set (all) [value]`);

  log(`\n-- .add parameters ---`);

  const paramsAsCommaDelimitedString = xDate(new Date(1900, 0, 1)).add("1 day, 2 hours, 30 minutes");
  log(`\nconst paramsAsCommaDelimitedString = xDate(new Date(1900, 0, 1)).add("1 day, 2 hours, 30 minutes");
     => ${paramsAsCommaDelimitedString.value}`);
  runTest(paramsAsCommaDelimitedString.date, new Date(1900, 0, 2, 2, 30), `.add single string comma delimited parameter`, deepStrictEqual);

  const multipleParams = xDate(new Date(1900, 0, 1)).add("1 day", "2 hours", "30 minutes");
  log(`\nconst multipleParams = xDate(new Date(1900, 0, 1)).add("1 day", "2 hours", "30 minutes");\n     => ${multipleParams.value}`);
  runTest(multipleParams.date, new Date(1900, 0, 2, 2, 30), `.add multiple parameters`, deepStrictEqual);

  const invalidParams = xDate(new Date(1900, 0, 1)).add("1 millennium");
  log(`\nconst invalidParams = xDate(new Date(1900, 0, 1)).add("1 millennium");\n     => ${invalidParams.value}`);
  runTest(invalidParams.date, new Date(1900, 0, 1), `.add invalid parameters`, deepStrictEqual);

  const noParams = xDate(new Date(1900, 0, 1)).add();
  log(`\nconst noParams = xDate(new Date(1900, 0, 1)).add();\n     => ${noParams.value}`);
  runTest(noParams.date, new Date(1900, 0, 1), `.add no parameters`, deepStrictEqual);

  log(`\n--- miscellaneous ---`);

  log(`\n\`\${dsr\}\` => ${dsr}`);
  runTest(`${dsr}`, formatter(dsr), `dsr toString (formatter in instance)`);

  const tsInstance = xDate();
  log(`\n\`\${xDate()}\ => value: ${tsInstance}`);
  runTest(`${tsInstance}`, formatter(tsInstance), `toString no instance formatter`);

  const test = xDate(new Date(1900, 0, 1), "this is not a function");
  log(`\nconst test = xDate(new Date(1900, 0, 1), "this is not a function"); 
     => ${test.value}`);
  runTest(test.date, new Date(1900, 0, 1), `instantiation bad formatter`, deepStrictEqual);

  const formatterTest = test.clone(d => d.toLocaleString(`de-DE`));
  log(`\nconst formatterTest = test.clone(d => d.toLocaleString("de-DE"))); => ${formatterTest.value}`);
  runTest(formatterTest.value, formatterTest.date.toLocaleString("de-DE"), `clone with new formatter`);

  log(`\nfactory call without extensions => factory()`);
  runTest(factory, ``, `initialize without extensions does not throw`, doesNotThrow);

  log(errors ? `\nAll done, but there were errors ...\n` : `\nAll ${cnt} tests are ok!\n`);
  logIt(...logs);
}

function exts(instance) {
  return {
    nextWeek() {  return instance.add(`7 days`); },
    previousWeek() {  return instance.add("-7 days"); },
    addWeeks(n = 1) { return instance.add(`${n * 7} days`); },
    nextYear() { return instance.add("1 year"); },
    previousYear() { return instance.add("-1 year"); },
    nextMonth() { return instance.add("1 month"); },
    previousMonth() { return instance.add("-1 month"); },
    tomorrow() { return instance.add("1 day"); },
    yesterday() { return instance.add("-1 day"); }
  };
}

function logIt(...args) {
  args.forEach(arg => console.log(arg instanceof Object ? JSON.stringify(arg, null, 2) : arg));
}
