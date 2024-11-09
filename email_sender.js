const nodemailer = require('nodemailer');
const fs = require('fs');
const { parse } = require('csv-parse');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function readCSV(filename) {
    const records = [];
    const parser = fs
        .createReadStream(filename)
        .pipe(parse({ columns: true }));

    for await (const record of parser) {
        records.push(record.email);
    }
    return records;
}

async function sendEmail(transporter, from, to, subject, body) {
    try {
        await transporter.sendMail({
            from,
            to,
            subject,
            text: body
        });
        console.log(`✓ Email sent successfully to ${to}`);
        return true;
    } catch (error) {
        console.error(`✗ Failed to send email to ${to}:`, error.message);
        return false;
    }
}

async function main() {
    // Get user input
    const credentials = await new Promise((resolve) => {
      rl.question('Enter your email: ', (email) => {
        rl.question('Enter your app password: ', (password) => {
          rl.question('Enter email subject: ', (subject) => {
            resolve({ email, password, subject });
          });
        });
      });
    });

    // Create transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: credentials.email,
            pass: credentials.password
        }
    });

    // Read email template
    const emailBody = fs.readFileSync('rmail_template.txt', 'utf8');

    // Read recipients
    const recipients = await readCSV('excel.csv');

    // Send emails
    let successful = 0;
    for (const recipient of recipients) {
        if (await sendEmail(
            transporter,
            credentials.email,
            recipient,
            credentials.subject,
            emailBody
        )) {
            successful++;
        }
    }

    console.log(`\nSummary: Sent ${successful} out of ${recipients.length} emails successfully`);
    rl.close();
    process.exit();
}

main().catch(error => console.error('Error in main:', error.message));
