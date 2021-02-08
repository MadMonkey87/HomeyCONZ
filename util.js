const fs = require('fs');
const crypto = require('crypto');

module.exports.util = {}

module.exports.util.round = function (value, exp) {
  if (typeof exp === 'undefined' || +exp === 0)
    return Math.round(value);

  value = +value;
  exp = +exp;

  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
    return NaN;

  // Shift
  value = value.toString().split('e');
  value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
}

module.exports.util.generateGuid = function generateGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// hue = [0,1], sat = [0,1]
module.exports.util.hsToXy = function (hue, sat) {
  var rgb = HSVtoRGB(hue, sat, 1);
  return rgbToXy2(rgb)
}

function rgbToXy(r, g, b) {
  var X = .412453 * r + .35758 * g + .180423 * b
    , Y = .212671 * r + .71516 * g + .072169 * b
    , Z = .019334 * r + .119193 * g + .950227 * b;
  return [X / (X + Y + Z), Y / (X + Y + Z)]
}

function rgbToXy2(rgb) {
  var viv = rgb.map(x => x > .04045 ? Math.pow((x + .055) / 1.055, 2.4) : x / 12.92);
  let red = viv[0]
    , green = viv[1]
    , blue = viv[2]
    , X = .649926 * red + .103455 * green + .197109 * blue
    , Y = .234327 * red + .743075 * green + .022598 * blue
    , Z = 0 * red + .053077 * green + 1.035763 * blue;
  return [X / (X + Y + Z), Y / (X + Y + Z)]
}

function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  switch (p = v * (1 - s),
  q = v * (1 - (f = 6 * h - (i = Math.floor(6 * h))) * s),
  t = v * (1 - (1 - f) * s),
  i % 6) {
    case 0:
      r = v,
        g = t,
        b = p;
      break;
    case 1:
      r = q,
        g = v,
        b = p;
      break;
    case 2:
      r = p,
        g = v,
        b = t;
      break;
    case 3:
      r = p,
        g = q,
        b = v;
      break;
    case 4:
      r = t,
        g = p,
        b = v;
      break;
    case 5:
      r = v,
        g = p,
        b = q
  }
  return [r, g, b]
}

function hueToHex(hue) {
  var rgb = {}
    , h = hue
    , t1 = 255
    , t3 = h % 60 * 255 / 60;
  360 == h && (h = 0),
    h < 60 ? (rgb.r = t1,
      rgb.b = 0,
      rgb.g = 0 + t3) : h < 120 ? (rgb.g = t1,
        rgb.b = 0,
        rgb.r = t1 - t3) : h < 180 ? (rgb.g = t1,
          rgb.r = 0,
          rgb.b = 0 + t3) : h < 240 ? (rgb.b = t1,
            rgb.r = 0,
            rgb.g = t1 - t3) : h < 300 ? (rgb.b = t1,
              rgb.g = 0,
              rgb.r = 0 + t3) : h < 360 ? (rgb.r = t1,
                rgb.g = 0,
                rgb.b = t1 - t3) : (rgb.r = 0,
                  rgb.g = 0,
                  rgb.b = 0);
  var r = parseInt(rgb.r).toString(16)
    , rr = 2 == r.length ? r : "0" + r
    , g = parseInt(rgb.g).toString(16)
    , gg = 2 == g.length ? g : "0" + g
    , b = parseInt(rgb.b).toString(16);
  return rr + gg + (2 == b.length ? b : "0" + b)
}

function mapHueTo360(hue) {
  return Math.floor(360 / 65535 * hue)
}

function mapHueFrom360(hue) {
  return Math.floor(hue / 360 * 65535)
}

module.exports.util.xyToHs = function (x, y, bri) {
  var z = 1 - x - y
    , X = (bri,
      0 === y ? 0 : 1 / y * x)
    , Z = 0 === y ? 0 : 1 / y * z
    , r = 3.2406 * X - 1.5372 - .4986 * Z
    , g = .9689 * -X + 1.8758 + .0415 * Z
    , b = .0557 * X - .204 + 1.057 * Z;
  r > b && r > g && r > 1 ? (g /= r,
    b /= r,
    r = 1) : g > b && g > r && g > 1 ? (r /= g,
      b /= g,
      g = 1) : b > r && b > g && b > 1 && (r /= b,
        g /= b,
        b = 1),
    r = r <= .0031308 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - .055,
    g = g <= .0031308 ? 12.92 * g : 1.055 * Math.pow(g, 1 / 2.4) - .055,
    b = b <= .0031308 ? 12.92 * b : 1.055 * Math.pow(b, 1 / 2.4) - .055,
    r < 0 && (r = 0),
    g < 0 && (g = 0),
    b < 0 && (b = 0);
  var hsv = rgb2hsv(String(255 * r), String(255 * g), String(255 * b));
  return { hue: hsv[0] / 360/* * 65535*/, sat:/*255 * */hsv[1] }
}

function rgb2hsv(r, g, b) {
  r = parseInt(("" + r).replace(/\s/g, ""), 10),
    g = parseInt(("" + g).replace(/\s/g, ""), 10),
    b = parseInt(("" + b).replace(/\s/g, ""), 10);
  if (!(null == r || null == g || null == b || isNaN(r) || isNaN(g) || isNaN(b) || r < 0 || g < 0 || b < 0 || r > 255 || g > 255 || b > 255)) {
    r /= 255,
      g /= 255,
      b /= 255;
    var minRGB = Math.min(r, Math.min(g, b))
      , maxRGB = Math.max(r, Math.max(g, b));
    return minRGB == maxRGB ? [0, 0, minRGB] : [60 * ((r == minRGB ? 3 : b == minRGB ? 1 : 5) - (r == minRGB ? g - b : b == minRGB ? r - g : b - r) / (maxRGB - minRGB)), (maxRGB - minRGB) / maxRGB, maxRGB]
  }
}

module.exports.util.hexToRgb = function hexToRgb(hex) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}

module.exports.util.getFileSizeInBytes = function (filename) {
  var stats = fs.statSync(filename);
  var fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}

module.exports.util.convertBase64ToFile = function (base64EncodedContent) {
  const type = base64EncodedContent.split(',')[0].split(';')[0].split(':')[1];
  const byteString = atob(base64EncodedContent.split(',')[1]);

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }
  const newBlob = new Blob([ab], {
    type: type,
  });
  return newBlob;
}

module.exports.util.saveFile = function (filename, base64EncodedContent, callback) {
  // const type = base64EncodedContent.split(',')[0].split(';')[0].split(':')[1]; 
  const buffer = Buffer.from(base64EncodedContent.split(',')[1], 'base64');
  const sha256 = crypto.createHash("sha256").update(buffer).digest("hex");
  if (fs.existsSync(filename)) {
    callback('the file exists already', null);
  } else {
    fs.writeFile(filename, buffer, () => callback(null, sha256));
  }
}

module.exports.util.debounce = function (func, wait) {
  let timeout;
  return function () {
    let context = this;
    let args = arguments;
    let later = function () {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
module.exports.util.throttle = function (func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function () {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function () {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

module.exports.util.throttle = function (callback, limit) {
  var waiting = false;                      // Initially, we're not waiting
  return function () {                      // We return a throttled function
    if (!waiting) {                         // If we're not waiting
      callback.apply(this, arguments);      // Execute users function
      waiting = true;                       // Prevent future invocations
      setTimeout(function () {              // After a period of time
        waiting = false;                    // And allow future invocations
      }, limit);
    }
  }
}


module.exports.util.appDataFolder = '/userdata/';