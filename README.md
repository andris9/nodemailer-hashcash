# hashcash plugin for Nodemailer

This plugin adds [hashcash headers](http://www.hashcash.org/) for the Nodemailer generated e-mail messages.

> NB! Generating hashcash values with JavaScript might be **very** slow (might take even 10s of seconds for a 20 bit hashcash value) and every recipient requires its own unique X-Hashcash header, so do not use this for messages with a large list of recipients.

## Install

Install from npm

    npm install nodemailer-hashcash --save

## Usage

#### 1. Load the `hashcash` function

```javascript
var hashcash = require('nodemailer-hashcash');
```

#### 2. Attach it as a 'compile' handler for a nodemailer transport object

```javascript
nodemailerTransport.use('compile', hashcash(options));
```

Where

  * **options** - is an optional options argument with the following values:
      * **bits** - (defaults to 20) how many bits to calculate

## Example

```javascript
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport();
transporter.use('compile', hashcash());
transporter.sendMail({
    from: 'me@example.com',
    to: 'receiver@example.com',
    …
});
```

## License

**MIT**
