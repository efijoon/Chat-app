const autoBind = require('auto-bind');
// const Recaptcha = require('express-recaptcha').Recaptcha;
// const { validationResult } = require('express-validator/check');
const isMongoId = require('validator/lib/isMongoId');
const sprintf = require('sprintf-js').sprintf;
const uniqueString = require('unique-string');
const mail = require("app/helpers/mail");

module.exports = class controller {
  constructor() {
    autoBind(this);
    // this.recaptchaConfig();
  }

  back(req, res) {
    req.flash("formData", req.body);
    return res.redirect(req.header("Referer") || "/");
  }

  isMongoId(paramId) {
    if (!isMongoId(paramId)) this.error("ای دی وارد شده صحیح نیست", 404);
  }

  error(message, status = 500) {
    let err = new Error(message);
    err.status = status;
    throw err;
  }

  slug(title) {
    return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, "-");
  }

  alert(req, data) {
    let title = data.title || "",
      message = data.message || "",
      type = data.type || "info",
      button = data.button || null,
      timer = data.timer || 6000,
      toast = data.toast || false,
      position = data.position || 'center';

    req.flash("SAmessages", { title, message, type, button, timer, toast, position });
  }

  async alertAndBack(req, res, data) {
    await this.alert(req, data);
    return this.back(req, res);
  }
};