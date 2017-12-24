const { createTransport } = require('nodemailer');
const Promise = require('bluebird');

// TODO update this w current Nodemailer docs
const transport = createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    type: 'OAuth2',
    clientId: process.env.GMAIL_CLIENTID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
  },
});

/**
 * @param {Object} args object containing named arguments
 * @param {string} args.from email
 * @param {string} args.to email
 * @param {string} args.subject of email
 * @param {string} args.text in body
 * @returns {Promise<undefined>} sends the email
 */
function sendEmailAsync({ to, subject, text }) {
  const sendEmail = transport.sendMail.bind(transport, {
    to,
    from: process.env.MY_GMAIL,
    subject,
    text,
    auth: {
      user: process.env.MY_GMAIL,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken: process.env.GMAIL_ACCESS_TOKEN,
    },
  });
  return Promise.promisify(sendEmail)();
}

/**
 * @param {Object} args object containing named arguments
 * @param {string} args.subject of email
 * @param {string} args.text in body
 * @returns {Promise<undefined>} sends the email
 */
function sendEmailToMyself({ subject, text }) {
  return sendEmailAsync({
    to: process.env.MY_GMAIL,
    subject,
    text,
  });
}

module.exports = {
  sendEmailAsync,
  sendEmailToMyself,
};
