const nodemailer = require('nodemailer');
const fs = require('fs');
const { parse } = require('csv-parse');
const readline = require('readline');
const QRCode = require('qrcode');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function readCSV(filename) {
  try {
    const records = [];
    const parser = fs
      .createReadStream(filename)
      .pipe(parse({ columns: true }));

    for await (const record of parser) {
      records.push({
        name: record.name,
        email: record.email
      });
    }
    return records;
  } catch (error) {
    console.error("Error reading CSV file:", error.message);
    return [];
  }
}

async function generateQRCode(email) {
  const qrPath = `qr_${Date.now()}.png`;
  try {
    await QRCode.toFile(qrPath, email);
    return qrPath;
  } catch (error) {
    console.error("Error generating QR Code:", error.message);
    throw error;
  }
}

async function sendEmail(transporter, from, recipient, subject, htmlContent) {
  try {
    const qrPath = await generateQRCode(recipient.email);

    await transporter.sendMail({
      from,
      to: recipient.email,
      subject,
      html: htmlContent,
      attachments: [{
        filename: 'qr.png',
        path: qrPath,
        cid: 'qr'
      }]
    });

    fs.unlinkSync(qrPath); // Clean up QR code file after sending
    console.log(`✓ Email sent successfully to ${recipient.name} (${recipient.email})`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to send email to ${recipient.name} (${recipient.email}):`, error.message);
    return false;
  }
}

async function main() {
  const credentials = await new Promise((resolve) => {
    rl.question('Enter email subject: ', (subject) => {
      resolve({ subject });
    });
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let emailTemplate;
  try {
    emailTemplate = fs.readFileSync('invitetemplte.HTML', 'utf8');
  } catch (error) {
    console.error("Error reading email template:", error.message);
    return;
  }

  const recipients = await readCSV('excel.csv');
  let successful = 0;

  for (const recipient of recipients) {
    const personalizedHtml = emailTemplate
      .replace('${name}', recipient.name)
      .replace('${email}', recipient.email);

    if (await sendEmail(
      transporter,
      process.env.EMAIL_USER,
      recipient,
      credentials.subject,
      personalizedHtml
    )) {
      successful++;
    }
  }

  console.log(`\nSummary: Sent ${successful} out of ${recipients.length} emails successfully`);
  rl.close();
}

main().catch(console.error);
