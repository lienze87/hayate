/* eslint-disable no-return-assign */
/* eslint-disable no-cond-assign */
/*
 * Ease
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2010 gskinner.com, inc.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * @module TweenJS
 */

/**
 * The Ease class provides a collection of easing functions for use with TweenJS. It does not use the standard 4 param
 * easing signature. Instead it uses a single param which indicates the current linear ratio (0 to 1) of the tween.
 *
 * Most methods on Ease can be passed directly as easing functions:
 *
 *      createjs.Tween.get(target).to({x:100}, 500, createjs.Ease.linear);
 *
 * However, methods beginning with "get" will return an easing function based on parameter values:
 *
 *      createjs.Tween.get(target).to({y:200}, 500, createjs.Ease.getPowIn(2.2));
 *
 * Please see the <a href="http://www.createjs.com/Demos/TweenJS/Tween_SparkTable">spark table demo</a> for an
 * overview of the different ease types on <a href="http://tweenjs.com">TweenJS.com</a>.
 *
 * <em>Equations derived from work by Robert Penner.</em>
 * @class Ease
 * @static
 * */
function Ease() {
  throw new Error('Ease cannot be instantiated.');
}

// static methods and properties
/**
 * @method linear
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.linear = (t: number): number => {
  return t;
};

/**
 * Identical to linear.
 * @method none
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.none = Ease.linear;

/**
 * Mimics the simple -100 to 100 easing in Adobe Flash/Animate.
 * @method get
 * @param {Number} amount A value from -1 (ease in) to 1 (ease out) indicating the strength and direction of the ease.
 * @static
 * @return {Function}
 * */
Ease.get = (amount: number): Function => {
  if (amount < -1) {
    amount = -1;
  } else if (amount > 1) {
    amount = 1;
  }
  return (t: number) => {
    if (amount === 0) {
      return t;
    }
    if (amount < 0) {
      return t * (t * -amount + 1 + amount);
    }
    return t * ((2 - t) * amount + (1 - amount));
  };
};

/**
 * Configurable exponential ease.
 * @method getPowIn
 * @param {Number} pow The exponent to use (ex. 3 would return a cubic ease).
 * @static
 * @return {Function}
 * */
Ease.getPowIn = (pow: number): Function => {
  return (t: number) => {
    return t ** pow;
  };
};

/**
 * Configurable exponential ease.
 * @method getPowOut
 * @param {Number} pow The exponent to use (ex. 3 would return a cubic ease).
 * @static
 * @return {Function}
 * */
Ease.getPowOut = (pow: number): Function => {
  return (t: number) => {
    return 1 - (1 - t) ** pow;
  };
};

/**
 * Configurable exponential ease.
 * @method getPowInOut
 * @param {Number} pow The exponent to use (ex. 3 would return a cubic ease).
 * @static
 * @return {Function}
 * */
Ease.getPowInOut = (pow: number): Function => {
  return (t: number) => {
    if ((t *= 2) < 1) return 0.5 * t ** pow;
    return 1 - 0.5 * Math.abs((2 - t) ** pow);
  };
};

/**
 * @method quadIn
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.quadIn = Ease.getPowIn(2);
/**
 * @method quadOut
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.quadOut = Ease.getPowOut(2);
/**
 * @method quadInOut
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.quadInOut = Ease.getPowInOut(2);

/**
 * @method cubicIn
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.cubicIn = Ease.getPowIn(3);
/**
 * @method cubicOut
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.cubicOut = Ease.getPowOut(3);
/**
 * @method cubicInOut
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.cubicInOut = Ease.getPowInOut(3);

/**
 * @method quartIn
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.quartIn = Ease.getPowIn(4);
/**
 * @method quartOut
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.quartOut = Ease.getPowOut(4);
/**
 * @method quartInOut
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.quartInOut = Ease.getPowInOut(4);

/**
 * @method quintIn
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.quintIn = Ease.getPowIn(5);
/**
 * @method quintOut
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.quintOut = Ease.getPowOut(5);
/**
 * @method quintInOut
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.quintInOut = Ease.getPowInOut(5);

/**
 * @method sineIn
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.sineIn = (t: number): number => {
  return 1 - Math.cos((t * Math.PI) / 2);
};

/**
 * @method sineOut
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.sineOut = (t: number): number => {
  return Math.sin((t * Math.PI) / 2);
};

/**
 * @method sineInOut
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.sineInOut = (t: number): number => {
  return -0.5 * (Math.cos(Math.PI * t) - 1);
};

/**
 * Configurable "back in" ease.
 * @method getBackIn
 * @param {Number} amount The strength of the ease.
 * @static
 * @return {Function}
 * */
Ease.getBackIn = (amount: number): Function => {
  return (t: number) => {
    return t * t * ((amount + 1) * t - amount);
  };
};
/**
 * @method backIn
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.backIn = Ease.getBackIn(1.7);

/**
 * Configurable "back out" ease.
 * @method getBackOut
 * @param {Number} amount The strength of the ease.
 * @static
 * @return {Function}
 * */
Ease.getBackOut = (amount: number): Function => {
  return (t: number) => {
    return --t * t * ((amount + 1) * t + amount) + 1;
  };
};
/**
 * @method backOut
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.backOut = Ease.getBackOut(1.7);

/**
 * Configurable "back in out" ease.
 * @method getBackInOut
 * @param {Number} amount The strength of the ease.
 * @static
 * @return {Function}
 * */
Ease.getBackInOut = (amount: number): Function => {
  amount *= 1.525;
  return (t: number) => {
    if ((t *= 2) < 1) return 0.5 * (t * t * ((amount + 1) * t - amount));
    return 0.5 * ((t -= 2) * t * ((amount + 1) * t + amount) + 2);
  };
};
/**
 * @method backInOut
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.backInOut = Ease.getBackInOut(1.7);

/**
 * @method circIn
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.circIn = (t: number): number => {
  return -(Math.sqrt(1 - t * t) - 1);
};

/**
 * @method circOut
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.circOut = (t: number): number => {
  return Math.sqrt(1 - --t * t);
};

/**
 * @method circInOut
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.circInOut = (t: number): number => {
  if ((t *= 2) < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1);
  return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
};

/**
 * @method bounceIn
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.bounceIn = (t: number): number => {
  return 1 - Ease.bounceOut(1 - t);
};

/**
 * @method bounceOut
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.bounceOut = (t: number): number => {
  if (t < 1 / 2.75) {
    return 7.5625 * t * t;
  }
  if (t < 2 / 2.75) {
    return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
  }
  if (t < 2.5 / 2.75) {
    return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
  }
  return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
};

/**
 * @method bounceInOut
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.bounceInOut = (t: number): number => {
  if (t < 0.5) return Ease.bounceIn(t * 2) * 0.5;
  return Ease.bounceOut(t * 2 - 1) * 0.5 + 0.5;
};

/**
 * Configurable elastic ease.
 * @method getElasticIn
 * @param {Number} amplitude
 * @param {Number} period
 * @static
 * @return {Function}
 * */
Ease.getElasticIn = (amplitude: number, period: number): Function => {
  const pi2 = Math.PI * 2;
  return (t: number) => {
    if (t === 0 || t === 1) return t;
    const s = (period / pi2) * Math.asin(1 / amplitude);
    return -(amplitude * 2 ** (10 * (t -= 1)) * Math.sin(((t - s) * pi2) / period));
  };
};
/**
 * @method elasticIn
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.elasticIn = Ease.getElasticIn(1, 0.3);

/**
 * Configurable elastic ease.
 * @method getElasticOut
 * @param {Number} amplitude
 * @param {Number} period
 * @static
 * @return {Function}
 * */
Ease.getElasticOut = (amplitude: number, period: number): Function => {
  const pi2 = Math.PI * 2;
  return (t: number) => {
    if (t === 0 || t === 1) return t;
    const s = (period / pi2) * Math.asin(1 / amplitude);
    return amplitude * 2 ** (-10 * t) * Math.sin(((t - s) * pi2) / period) + 1;
  };
};
/**
 * @method elasticOut
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.elasticOut = Ease.getElasticOut(1, 0.3);

/**
 * Configurable elastic ease.
 * @method getElasticInOut
 * @param {Number} amplitude
 * @param {Number} period
 * @static
 * @return {Function}
 * */
Ease.getElasticInOut = (amplitude: number, period: number): Function => {
  const pi2 = Math.PI * 2;
  return (t: number) => {
    const s = (period / pi2) * Math.asin(1 / amplitude);
    if ((t *= 2) < 1) return -0.5 * (amplitude * 2 ** (10 * (t -= 1)) * Math.sin(((t - s) * pi2) / period));
    return amplitude * 2 ** (-10 * (t -= 1)) * Math.sin(((t - s) * pi2) / period) * 0.5 + 1;
  };
};
/**
 * @method elasticInOut
 * @param {Number} t
 * @static
 * @return {Number}
 * */
Ease.elasticInOut = Ease.getElasticInOut(1, 0.3 * 1.5);

export default Ease;
