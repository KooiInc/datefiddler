import factory from "./datefiddler.js";
import assert from 'node:assert/strict';
runTests();

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
  const log = str => logs.push(`  ${str.replace(/\n/, `\n  `)}`);

  log(`\nNote: formatter = ${formatter.toString()}`);
  log(`\n--- instances ---`);
  log(`\nwd = xDate(new Date(), formatter) => ${wd.value}`);

  try {
    assert.strictEqual(wd.ISO, d.toISOString(), "wd date");
    log("   test wd date OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  try {
    assert.strictEqual(wd.value, formatter(d), "wd value");
    log("   test wd value OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  log(`\ndsr = wd.clone(formatter).set(new Date(2000, 0 , 1)) => ${dsr.value}`);

  try {
    assert.strictEqual(dsr.ISO, dsrClone.toISOString(), "dsr = wd clone and set date");
    log("   test wd clone and set date OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  try {
    assert.strictEqual(dsr.value, formatter(dsrClone), "dsr = wd clone and set value");
    log("   test dsr = wd clone and set value OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  log(`\n--- methods ---`);

  dsr.set(new Date(2000, 1, 1));
  log(`\ndsr.set(new Date(2000, 1 , 1) => ${dsr.value}`);

  try {
    assert.strictEqual(dsr.ISO, new Date(2000, 1, 1).toISOString(), "dsr.set date");
    log("   test dsr.set date OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  try {
    assert.strictEqual(dsr.value, formatter(new Date(2000, 1, 1)), "dsr.set value");
    log("   test dsr.set value OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  dsr.add(`2 days`);
  log(`\ndsr.add(\`2 days\`) => ${dsr.value}`);

  try {
    assert.strictEqual(dsr.ISO, new Date(2000, 1, 3).toISOString(), "dsr.add date");
    log("   test dsr.add date OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  log(`\ndsr.reset() => ${dsr.reset().value}`)

  try {
    assert.deepStrictEqual(dsr.date, dsr.initial, "dsr.reset value");
    log("   test dsr.reset value OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  log(`\n--- exensions ---`);
  let newDate = new Date(wd.date);
  newDate.setDate(newDate.getDate() + 7);
  wd.nextWeek();
  log(`\nwd.nextWeek() => ${wd.value}`);

  try {
    assert.strictEqual(wd.ISO, newDate.toISOString(), "wd.nextWeek date");
    log("   test wd.nextWeek date OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  try {
    assert.strictEqual(wd.value, formatter(newDate), "wd.nextWeek value");
    log("   test wd.nextWeek value OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  newDate = new Date(wd.date);
  newDate.setMonth(newDate.getMonth() - 2);
  wd.previousMonth().previousMonth();

  log(`\n--- chain extension methods ---`);
  log(`\nwd.previousMonth().previousMonth() => ${wd.value}`);

  try {
    assert.strictEqual(wd.ISO, newDate.toISOString(), "wd.previousMonth (2x) (double) date");
    log("   test wd.previousMonth (2x) date OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  try {
    assert.strictEqual(wd.value, formatter(newDate), "wd.previousMonth (2x) value");
    log("   test wd.previousMonth (2x) value OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  log(`\n--- chain extension methods and "native" methods ---`);
  newDate = new Date(wd.date);
  newDate.setDate(newDate.getDate() - 1);
  newDate.setFullYear(newDate.getFullYear() + 3);
  wd.yesterday().add(`3 years`);
  log(`\nwd.yesterday().add(\`3 years\`) => ${wd.value}`);

  try {
    assert.strictEqual(wd.ISO, newDate.toISOString(), "wd.yesterday.add date");
    log("   test wd.yesterday.add date OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}     expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  try {
    assert.strictEqual(wd.value, formatter(newDate), "wd.yesterday.add value");
    log("   test wd.yesterday.add value OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  log(`\n--- reset instance date to its initial date ---`);
  log(`\nwd.value => current value ${wd.value}`)
  wd.reset();
  log(`wd.reset().value => new value ${wd.value}`);

  try {
    assert.strictEqual(wd.ISO, wd.initial.toISOString(), "wd.reset (all) date");
    log("   test wd.reset date OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  try {
    assert.strictEqual(wd.value, formatter(wd.initial), "wd.reset value");
    log("   test wd.reset date OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  log(`\n--- reset date *and* initial date to current instance date value ---`);
  wd.set(new Date(2021, 7, 27));
  wd.update2Current();
  log(`\nwd.set(new Date(2021, 7, 27)); => ${wd.value}`);
  log(`wd.update2Current() => ${wd.value}`);

  try {
    assert.strictEqual(wd.ISO, wd.initial.toISOString(), "wd.reset (all) date");
    log("   test wd.reset (all) date OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  try {
    assert.strictEqual(wd.value, formatter(wd.initial), "wd.reset (all) value");
    log("   test wd.reset (all) value OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  log(`\n--- reset all using [instance].set ---`);
  const ddr = new Date();
  dsr.set(ddr, true);
  log(`\ndsr.set(new Date(), true) => ${dsr.value}`);

  try {
    assert.strictEqual(dsr.ISO, ddr.toISOString(), "dsr.set (all) date");
    log("   test dsr.reset (all) date OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  try {
    assert.strictEqual(dsr.value, formatter(dsr), "dsr.reset (all) value");
    log("   test dsr.reset (all) value OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  log(`\n-- .add parameters ---`);
  const paramsAsCommaDelimitedString = xDate(new Date(1900, 0, 1)).add("1 day, 2 hours, 30 minutes");
  log(`\nconst paramsAsCommaDelimitedString = xDate(new Date(1900, 0, 1)).add("1 day, 2 hours, 30 minutes");
     => ${paramsAsCommaDelimitedString.value}`);

  try {
    assert.deepEqual(paramsAsCommaDelimitedString.date, new Date(1900, 0, 2, 2, 30), ".add single string comma delimited parameter");
    log("   test .add single string comma delimited parameter OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  const multipleParams = xDate(new Date(1900, 0, 1)).add("1 day", "2 hours", "30 minutes");
  log(`\nconst multipleParams = xDate(new Date(1900, 0, 1)).add("1 day", "2 hours", "30 minutes");\n     => ${multipleParams.value}`);

  try {
    assert.deepEqual(multipleParams.date, new Date(1900, 0, 2, 2, 30), ".add multiple parameters");
    log("   test .add multiple parameters OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  const invalidParams = xDate(new Date(1900, 0, 1)).add("1 millennium");
  log(`\nconst invalidParams = xDate(new Date(1900, 0, 1)).add("1 millennium");\n     => ${invalidParams.value}`);

  try {
    assert.deepEqual(invalidParams.date, new Date(1900, 0, 1), ".add invalid parameters");
    log("   test .add invalid parameters OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  const noParams = xDate(new Date(1900, 0, 1)).add();
  log(`\nconst noParams = xDate(new Date(1900, 0, 1)).add();\n     => ${noParams.value}`);

  try {
    assert.deepEqual(noParams.date, new Date(1900, 0, 1), ".add no parameters");
    log("   test .add no parameters OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  log(`\n--- miscellaneous ---`);
  log(`\n\`\${dsr\}\` => ${dsr}`);

  try {
    assert.strictEqual(`${dsr}`, formatter(dsr), "dsr toString (formatter in instance)");
    log("   test dsr toString (formatter in instance) OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  const tsInstance = xDate();

  log(`\n\`\${xDate()}\ => value: ${tsInstance}`);

  try {
    assert.strictEqual(`${tsInstance}`, formatter(tsInstance), "toString no instance formatter");
    log("   test toString no instance formatter OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  const test = xDate(new Date(1900, 0, 1), "this is not a function");
  log(`\nconst test = xDate(new Date(1900, 0, 1), "this is not a function"); 
     => ${test.value}`);

  try {
    assert.deepStrictEqual(test.value, new Date(1900, 0, 1), "instantiation bad formatter");
    log("   test instantiation bad formatter OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  const formatterTest = test.clone(d => d.toLocaleString(`de-DE`));
  log(`\nconst formatterTest = test.clone(d => d.toLocaleString("de-DE"))); => ${formatterTest.value}`);

  try {
    assert.strictEqual(formatterTest.value, formatterTest.date.toLocaleString("de-DE"), "clone with new formatter");
    log("   test clone with new formatter OK");
  } catch (err) {
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  log(`\nfactory call without extensions => factory()`);
  try {
    assert.doesNotThrow(factory(), "initialize without extensions does not throw");
    log("   initialize without extensions does not throw OK");
  } catch (err) {
    console.log(`WTF`);
    errors = true;
    log(`   ERROR for test ${err.message}${getLine(err)}   expected: ${err.expected},\n     actual: ${err.actual}\n`);
  }

  log(errors ? `\nAll done, but there were errors ...\n` : `\nAll done!\n`);
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
