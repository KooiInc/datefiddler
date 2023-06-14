const addSymbol = (await import("https://kooiinc.github.io/ProtoXT/protoxt.js")).default;
const formatDate = (await import("https://cdn.jsdelivr.net/npm/intl-dateformatter/index.min.js")).default;
const libImportLocation = /dev\.kooi/i.test(location.href)
  ? "//dev.kooi/dflib/datefiddler.js"
  : "https://kooiinc.github.io/datefiddler/datefiddler.js";
const factory = (await import(libImportLocation)).default;
demo();

function demo() {
  const extensions = function(instance) {
    const add = toAdd => instance.add(toAdd);
    return {
      nextWeek: _ => add(`7 days`),
      previousWeek: _ => add("-7 days"),
      addWeeks: (n = 1) => add(`${n * 7} days`),
      nextYear: _ => add("1 year"),
      previousYear: _ => add("-1 year"),
      addYears: (n = 1) => add(`${n} years`),
      nextMonth: _ => add("1 month"),
      previousMonth: _ => add("-1 month"),
      addMOnths: (n = 1) => add(`${n} months`),
      tomorrow: _ => add("1 day"),
      yesterday: _ => add("-1 day"),
      addDays: (n = 1) => add(`${n} days`),
    };
  };

  const xDate = factory(extensions);
  // used in this demo
  const formatDT = addSymbol(Date, formatDate);
  const formatter1 = d => d[formatDT(`WD d MM yyyy hh:mmi:ss dp`, `l:en`)];
  const x1 = xDate();
  const x2 = xDate(new Date(2000, 0, 1));
  const formatter = function(d) { return d.toLocaleString(`nl-NL`, {timeZone: `Europe/Amsterdam`}); };
  const myFormattedDate = xDate(new Date(), formatter);
  const myDate = xDate( new Date(), formatter1 );
  const myDateValue1 = myDate
    .nextYear()
    .add("7 days")
    .add("2 years", "30 minutes", "nothing") // Note: "nothing" is ignored
    .add("2 hours")
    .add("2 years" )
    .add("-5 months")
    .add("20 years")
    .value;
  const myDateValue2 = myDate
    .add("-7 days")
    .add("-2 years", "-30 minutes")
    .add("-2 hours")
    .add("-2 years")
    .previousYear()
    .add("5 months")
    .add("-20 years")
    .add()
    .value;
  const {print} = printFactory();

  print(
    `!!#head0#Import the dateFiddler factory`,
    `p!!Start with importing the library (here named <code>factory</code>)`,
    `import factory from "https://kooiinc.github.io/datefiddler/datefiddler.js";`);

  print(`!!#head1#Initialize the constructor`,
    `p!!
    <div>To initialize the constructor you run the imported <code>factory</code> and assign the result
    to a variable (here: <code>xDate</code>).</div>
    <div>You can optionally supply a factory function to the datefiddler factory function
    for aggregated adding or subtracting from an instance.</div>
    <div>The methods returned from this function are usable within all instances you create 
    from the datefiddler constructor.</div> 
    <div>See "<a href="#head4">Instantiate and chain date arithmetic</a>" and following 
    for example usage of the methods.</div>`,
    `const exts = ${extensions.toString()};
  // assign xDate
  const xDate = factory(exts);
  // used in this demo
  const formatDT = addSymbol(Date, formatDate);
  // [addSymbol] @ https://github.com/KooiInc/ProtoXT
  // [formatDate] @ https://github.com/KooiInc/dateformat`);

  print(`!!#head2#Create instances using the constructor`,
    `p!!<div>instantiating <code>xDate</code> can be done using two optional parameters, 
    the <code>date</code> and a <code>formatter</code> method.
    <ul>
      <li><code>date</code>: a Date Object. The date to use (default <code>new Date()</code>).</li>
      <li><code>formatter</code>: a function to format the instance date   
        when retrieving <code>[instance].value</code> parameter (default <code>d => d</code>).</li>
    </ul>
    <div>Instantiating <code>xDate</code> without parameters uses default values.</div>
    <div>Every instance provides 4 properties</div>
    <ul>
      <li><code>date</code>: the instances Date</li>
      <li><code>value</code>: if <code>formatter</code> was present, 
        the formatted instance date or (default) the instance date.</li>
      <li><code>initial</code>: the initial date of the instance</li>
      <li><code>ISO</code>: the instance date stringified to its ISO representation</li>
    </ul>
   <div><b>Note</b>: an instance will be stringified using the <code>.value</code> property 
    when used in a string (e.g. <code>\`myDate is \${myDate}\`</code>.</div>`,
    `const x1 = xDate();
  const x2 = xDate(new Date(2000, 0, 1));
  x1.value; // => ${x1.value}
  x2.value; // => ${x2.value}`);

  print(`!!#head3#Format instance date value`,
    `p!!<div>
    When the <code>formatter</code> parameter 
    is present <code>[instance].value</code> and it is a proper function will
    return the instances <code>value</code> property value formatted 
    with it.</div>
    <div>Otherwise <code>[instance].value</code> will be the value of the instance date 
    (a <code>Date Object</code>).</div>
    <div><b>Note</b>: to retrieve the <code>Date Object</code> from an instance
    use <code>[instance].date</code>.</div>`,
    `const myFormattedDate = xDate(new Date, ${formatter.toString()});
  myFormattedDate.value; // => ${myFormattedDate.value}
  myFormattedDate.date;  // => ${myFormattedDate.date}`);

  print(`!!#head4#Instantiate and chain date arithmetic`,
    `p!!<div>An instance provides 5 methods:</div>
    <ul>
      <li><code>.clone</code>: clone the current instance to a new instance. 
        You must reassign the clone to a new variable. Example:
        <div class="example">
          <code>const nwInstance = [currentInstance].clone([formatter])</code>
        </div>
        <div><code>.clone</code> can be used with an optional <code>formatter</code> method parameter.</div>
        <div>Without parameters the (eventual) <code>formatter</code> method from the 
          originating instance is preserved.</div>
      </li>
      <li><code>.set</code>: set the instance date to a new value.</li>
      <li><code>.reset</code>: set the instance date to the <i>initial</i> instance date.</li>
      <li><code>.update2Current</code>: set the instance date <i>and its initial date</i> to the current instance date.</li>
      <li><code>.add</code>: add date unit(s) to the instance date. This method can be called with 
        one or more strings containing instructions about what to add to its date.</li>
    </ul>
    <div>the <code>.add</code> method takes one or more strings as parameters. 
    A typical parameter contains a number and a date-time unit (year(s), month(s), 
    minute(s) etc.) divided by a space. Example:</div>
    
    <div class="example"><code>[instance].add("-1 year", "1 day", "3 hours", "17 minutes");</code></div>
    
    <div>Instructions that don't abide by this rule are ignored. So "1 week" will not be processed,
    because "week" is not a date-time unit that can be used to do date arithmetic
    (you can of course make your own week extension, see "<code>.addWeeks</code>" in the extensions
    used here).</div>
    
    <div>When datefiddler was initialized with extensions the provided extension methods
    are also available for each instance.</div>
    
    <div>All instance methods including eventual extension methods are
    chainable (so, the result of any instance method call returns the instance and 
    therewith the aforementioned methods).</div>`,
    `const formatter1 = function(d) { return d[formatDT("WD d MM yyyy hh:mmi:ss dp", "l:en")]; };
  const myDate = xDate( new Date(), formatter1 );
  myDate
    .nextYear()
    .add("7 days")
    .add("2 years", "30 minutes", "nothing") // Note: "nothing" is ignored
    .add("2 hours")
    .add("2 years" )
    .add("-5 months")
    .add("20 years")
    .value; // => ${myDateValue1}
  myDate
    .add("-7 days")
    .add("-2 years", "-30 minutes")
    .add("-2 hours")
    .add("-2 years")
    .previousYear()
    .add("5 months")
    .add("-20 years")
    .add()  // Note: .add without parameters is ignored
    .value; // => ${myDateValue2}`,
  );
  const workingDate = xDate(new Date(), formatter1);
  let dateSetReset = workingDate.clone().set(new Date(1992, 3, 27)).add(`5 years`);
  print(`!!#head5#Set, reset and update2Current`,
    `p!!<div>
    An instance provides the methods <code>.set</code>, <code>.reset</code> 
    and <code>update2Current</code> to manipulate the instances date. The methods 
    will change an instances date, and/or initial date.</div>
    <div>The <code>.set</code> has an optional parameter (boolean, default false). When
    true, the set date will, after excution, also be the intances initial date.</div>`,
    `let workingDate = xDate(new Date(), formatter1);
  let dateSetReset = workingDate.clone().set(new Date(1992, 3, 27)).add("5 years");
  workingDate.value; // => ${workingDate.value}
  dateSetReset.value; // => ${dateSetReset.value}
  dateSetReset.set(new Date(1933, 1, 4)).tomorrow().value // => ${dateSetReset.set(new Date(1933, 1, 4)).tomorrow().value}
  dateSetReset.value // => ${dateSetReset.value}`);
  const diff = dateSetReset.reset().add("10 days").date - dateSetReset.reset().date;
  print(`// A use case for set/reset may be: calculate date difference ...
  dateSetReset.reset().add("10 days").date - dateSetReset.reset().date //=> ${diff} ms (10 days)
  // => dateSetReset.value ${dateSetReset.value}`);
  dateSetReset.set(new Date(2000, 0, 1), true);
  print(`// reset the instance including the initial date
  dateSetReset.set(new Date(2000, 0, 1), true);
  dateSetReset.value //=> ${dateSetReset.value}
  dateSetReset.initial //=> ${dateSetReset.initial}`)
  const newInstance = dateSetReset.clone(formatter1).add(`${new Date().getFullYear() - 2000 + 1} year`);
  print(`const newInstance = dateSetReset.clone(formatter1).add(\`${new Date().getFullYear() - 2000 + 1} year\`);
  newInstance.value; // => ${newInstance.value}
  newInstance.initial; // => ${newInstance.initial}
  
  // demo update2Current
  newInstance.add("-2 months");
  newInstance.value // => ${newInstance.add("-2 months").value}
  newInstance.initial // => ${newInstance.initial});
  
  // set [newInstance] to the current date using update2Current
  newInstance.update2Current();
  newInstance.value // => ${newInstance.update2Current().value}
  newInstance.initial // => ${newInstance.initial}`);

 const index = document.querySelector(`#index`);
 document.querySelectorAll(`[id^=head]`)
  .forEach( el => {
    index.insertAdjacentHTML("beforeend", `<li><a href="#${el.id}">${el.innerHTML}</a></li>`);
    el.insertAdjacentHTML("beforeend", ` <a href="#">&#8634; Index</a>`);
  } );
 document.body.insertAdjacentHTML(`beforeend`, `<div class="spacer"></div>`);
}

function printFactory() {
  const results = document.body.insertAdjacentElement(
    `beforeend`,
    Object.assign(document.createElement(`div`), {id: `result`})
  );

  function cleanupCode(lines) {
    return lines.replace(/\n\s{2}/mg, `\n`);
  }

  function createCodeElement(codeOrText) {
    const isHeader = codeOrText.startsWith(`!!`);
    const isParagraph = codeOrText.startsWith(`p!!`);
    const headerId = isHeader ?
      codeOrText.match(/#.+?#/)?.shift().replace(/#/g, ``) ?? `_${Math.floor(Math.random() * 100000).toString(16)}` : ``;
    return isHeader || isParagraph
      ? Object.assign(
        document.createElement(isHeader ? `h2` : `p`),
        { id: headerId, innerHTML: codeOrText.replace(/^!!|^p!!|#.+?#/g, ``)})
      : Object.assign(
        document.createElement(`pre`),
        {
          className: `language-javascript line-numbers`,
          innerHTML: `<code class="language-javascript js">${cleanupCode(codeOrText)}</code>`
        });
  }

  function printItem(top) {
    return function(line) {
        const nwElem = results.insertAdjacentElement( top ? `afterbegin` : `beforeend`, createCodeElement(line));
        const codeElem = nwElem.querySelector(`code`);
        if (codeElem) { Prism.highlightElement(codeElem); }
    };
  }

  return {
    print: function(...txt) { txt.forEach( printItem() ); },
    printTop: (...txt) => txt.forEach( printItem(true) ), };
}
