const { createTransport } = require('nodemailer');
const Promise = require('bluebird');

// TODO update this w current Nodemailer docs
const transport = createTransport({
  // service: 'Gmail',
  // auth: {
  //   XOAuth2: {
  //     user: process.env.MY_GMAIL,
  //     clientId: process.env.GMAIL_CLIENTID,
  //     clientSecret: process.env.GMAIL_CLIENT_SECRET,
  //     refreshToken: process.env.GMAIL_REFRESH_TOKEN,
  //   },
  // },
});

/**
 * @param {Object} args object containing named arguments
 * @param {string} args.from email
 * @param {string} args.to email
 * @param {string} args.subject of email
 * @param {string} args.text in body
 * @returns {Promise<undefined>} sends the email
 */
function sendEmailAsync({ from, to, subject, text }) {
  return Promise.promisify(transport.sendMail.bind(transport, { to, from, subject, text }))();
}

/**
 * @param {Object} args object containing named arguments
 * @param {string} args.subject of email
 * @param {string} args.text in body
 * @returns {Promise<undefined>} sends the email
 */
function sendEmailToMyself({ subject, text }) {
  return sendEmailAsync({
    from: process.env.MY_GMAIL,
    to: process.env.MY_GMAIL,
    subject,
    text,
  });
}

module.exports = {
  sendEmailAsync,
  sendEmailToMyself,
};
