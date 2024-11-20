# Bulk Mail Sender

**Bulk Mail Sender** is a Node.js-based application designed to simplify the process of sending bulk emails. It enables users to send personalized emails to multiple recipients using a CSV file for contact management and customizable email templates.

## Features

- **Bulk Email Sending**: Send emails to multiple recipients in a single operation.
- **CSV Integration**: Load recipient details from a CSV file (`excel.csv`).
- **Custom Templates**: Support for HTML email templates (`cyber.HTML` and `invitetemplte.HTML`).
- **QR Code Integration**: Includes QR code functionality for email tracking.
- **Email Preview**: Template rendering before sending.
- **Flexible Customization**: Modify email text, subject, and attachments.

## Tech Stack

- **Backend**: Node.js
- **Email Integration**: Nodemailer (or similar library as configured)
- **Templating**: HTML for custom email designs
- **CSV Handling**: File-based integration

## Getting Started

### Prerequisites

- Node.js installed on your machine
- A valid email service provider (SMTP credentials required)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anubhav12302387/Bulk_mail_Sender.git
   cd Bulk_mail_Sender
2. **Prepare your recipient list:**

Add recipient details to excel.csv in the following format:
graphql
```bash
Name,Email
John Doe,john.doe@example.com
Jane Smith,jane.smith@example.com

  
