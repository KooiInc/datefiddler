export default dateFiddleFactory;

function dateFiddleFactory(extensions) {
  const units = {
    year: `FullYear`, month: `Month`, date: `Date`,
    day: `Date`, hour: `Hours`, minute: `Minutes`,
    second: `Seconds`, millisecond: `Milliseconds`
  };

  return function(date = new Date(), formatter = d => d) {
    return instatiate(date, !(formatter instanceof Function) ? d => d : formatter);
  };

  function instatiate(thisDate, formatter) {
    let _date = thisDate;
    let _initial = new Date(thisDate);
    let instance = {
      toString() { return instance.value.toString(); },
      reset() { return instance.set(_initial); },
      update2Current() { return instance.set(new Date(_date), true); },
      set date(d) { _date  = new Date(d); },
      set initial(d) { _initial = new Date(d); },
      get date() { return _date; },
      get initial() { return _initial; },
      get value() { return formatter(instance.date); },
      get ISO() { return instance.date.toISOString(); },
      clone(nwFormatter) { return instatiate(new Date(_date), nwFormatter || formatter); },
      set: function(nwValue, all = false) {
        instance.date = _date = new Date(nwValue);
        instance.initial = _initial = all ? new Date(_date) : _initial;

        return instance;
      },
      add(...things2AddOrSubtract) {
        const allInOne = things2AddOrSubtract.length === 1 && 
          things2AddOrSubtract.shift()?.split(/,/);

        if (allInOne && allInOne.length) {
          things2AddOrSubtract = allInOne.map(v => v.trim());
        }

        if (things2AddOrSubtract.length) {
          things2AddOrSubtract
            .map(function (a) { return a.toLowerCase().split(/\s/); })
            .forEach(function ([n, term]) {
                const unit = units[term?.replace(/s$/i, ``)];

                if (+n && unit) {
                  _date[`set${unit}`](_date[`get${unit}`]() + +n);
                }
              }
            );
        }
        return instance;
      },
    };

    instance.set(thisDate);
    if (extensions) {
      Object.entries(extensions(instance)).forEach( ([ext, fn]) => instance[ext] = fn );
    }

    return Object.freeze(instance);
  }
}
