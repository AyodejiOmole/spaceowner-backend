const nodemailer = require("nodemailer");

let transport;

async function init() {
  transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.Gmail_address,
      pass: process.env.Gmail_Password,
    },
  });
}


async function sendMail(to, subject, html, from = '"WarehouzIt" <info@warehouzit.com>') {
  await transport.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html,
  });
}

async function close() {
  await transport.close();
}

async function send(option) {
  await init();
  await sendMail(`${option.email}`, `${option.subject}`, `${option.mailHtml}`, `${option.from}`);
  await close();
}


module.exports = {
  send
};
