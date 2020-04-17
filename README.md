# Rapidtext Open source web app using node.js and twilio
![Logo](https://raw.githubusercontent.com/gmpravin/twilio-example-nodejs/master/logo.png)
[![powered by twilio](https://raw.githubusercontent.com/gmpravin/twilio-example-nodejs/master/twilio-badge-clear.svg)]()

# About
 Rapidtext is a web application used to send a sms/bulk sms using twilio api
 ### Implemented In Javascript(Node.js)

# Features!
  - Node.js web server using Express.js
  - Basic web user interface using ejs
  - Bcrypt for hashing a user password
  - Encrypt & decrypt a twilio credential by Crypto-js 
  - Mysql database is used
  - Its support multi users
  - Validation on each forms
  - Error handling in different situations
  - Send bulk sms Through txt file
  - Send massages with different mobile numbers (purchase a Different mobile number from twilio), No default Sender number 
  - Linting and formatting using ESLint and Prettier
  - fancy 404 page and 500 page 
  - Uploaded files will be deleted in every 3600sec
  Screenshot below!!!
  

# How it works
This application build on Node.js runtime environment using Express.js web framework & Embedded JavaScript templates(Ejs)

### Tech

RapidText uses a number of open source projects to work properly:
* [twilio-node] - Sending a SMS based on Twilio api 
* [EJS] - Embedded JavaScript templates!
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework 
* [bcrypt] - bcrypt used for hash password 
* [crypto-js] - JavaScript library of crypto standards.
* [mysql] - mysql connector for node.js
* [express-validator] - validate the form fields
* [multer] - helping lib for upload a file to server
* [express-flash] - used for flash a notification

# Requirements

    - Node.js
    - A Twilio account - sign up
# Twilio Account Settings

This application needs twilio credential :

- Account Sid 
- Auth Token 
- Phone number

### Installation

Rapidtext requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and devDependencies and start the server.

```sh
1.Clone this repository and cd into it
$ git clone https://github.com/gmpravin/rapidtext
$ cd rapidtext
2.Install dependencies 
$ npm install
3.Run the application
$ npm run dev
```

BOOM!!! Application started.... on http://localhost:8080

# Instruction for handling web app
### Sending bulk sms by
- create txt file
- add mobile numbers with country code seperated by ,
EX:    +91860XXXXXXX,+918601XXXXXX,+91860XXXXXXX,+91860XXXXXXX

- save as txt file 
- upload this file
-done


# Screenshot
![Login](https://raw.githubusercontent.com/gmpravin/rapidtext/master/screenshot/login.PNG)
![img](https://raw.githubusercontent.com/gmpravin/rapidtext/master/screenshot/register.PNG)
![img](https://raw.githubusercontent.com/gmpravin/rapidtext/master/screenshot/emailexist.PNG)
![img](https://raw.githubusercontent.com/gmpravin/rapidtext/master/screenshot/errcon.PNG)
![img](https://raw.githubusercontent.com/gmpravin/rapidtext/master/screenshot/regvalidation.PNG)
![img](https://raw.githubusercontent.com/gmpravin/rapidtext/master/screenshot/sendsms.PNG)
![img](https://raw.githubusercontent.com/gmpravin/rapidtext/master/screenshot/sms.PNG)

![img](https://raw.githubusercontent.com/gmpravin/rapidtext/master/screenshot/bulksms.PNG)
#### checks a uploaded file is a mobile numbers or unwanded content 
![img](https://raw.githubusercontent.com/gmpravin/rapidtext/master/screenshot/upoladnonnumbers.PNG)

![img](https://raw.githubusercontent.com/gmpravin/rapidtext/master/screenshot/bulksmsOK.PNG)

![img](https://raw.githubusercontent.com/gmpravin/rapidtext/master/screenshot/checkint.PNG)
![img](https://raw.githubusercontent.com/gmpravin/rapidtext/master/screenshot/responsive.PNG)
![img](https://raw.githubusercontent.com/gmpravin/rapidtext/master/screenshot/index.PNG)
### Development

Want to contribute? Great!

### If You are new to contribution Follow this link
 https://github.com/firstcontributions/first-contributions


License
----

MIT

# Disclaimer

 No warranty expressed or implied. Software is as is.


[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   
   [node.js]: <http://nodejs.org>
   [twilio-node]: <https://github.com/twilio/twilio-node> 
[ejs]: <https://github.com/mde/ejs> 
[bcrypt]: <https://github.com/shaneGirish/bcrypt-nodejs> 
[Express]:<https://expressjs.com/>
[crypto-js]:<https://github.com/brix/crypto-js>
 [multer]: <https://github.com/expressjs/multer>
   [express-validator]: <https://github.com/express-validator/express-validator> 
[express-flash]: <https://github.com/RGBboy/express-flash> 
[mysql]: <https://github.com/mysqljs/mysql> 
[crypto-js]:<https://github.com/brix/crypto-js>
