
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const myOAuth2Client = new OAuth2(
    "830846393804-vm556b8lg6rub3em1mpk357i6fk4so17.apps.googleusercontent.com",
    "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",
    "https://developers.google.com/oauthplayground"
)

myOAuth2Client.setCredentials({
    refresh_token: "1//04PSbLmzkXv8rCgYIARAAGAQSNwF-L9IrktYYqUdjjIsk88CZY_0ipu29u-c5ZJL7RyL7r2qiUPjPf5FPAwdJ-B8zo77OE62JgwM"
});

let myAccessToken = '';
async function a() {
    myAccessToken = await myOAuth2Client.getAccessToken()

    console.log(myAccessToken, "myAccessToken")


    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "info@gigithq.co", //your gmail account you used to set the project up in google cloud console"
            clientId: "830846393804-vm556b8lg6rub3em1mpk357i6fk4so17.apps.googleusercontent.com",
            clientSecret: "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",
            refreshToken: "1//04PSbLmzkXv8rCgYIARAAGAQSNwF-L9IrktYYqUdjjIsk88CZY_0ipu29u-c5ZJL7RyL7r2qiUPjPf5FPAwdJ-B8zo77OE62JgwM",
            accessToken: myAccessToken //access token variable we defined earlier
        }
    });



    const mailOptions = {
        from: 'info@gigithq.co', // sender
        to: "akshita.tomar@ultivic.com", // receiver
        subject: 'My tutorial brought me here', // Subject
        html: '<p>You have received this email using nodemailer, you are welcome ;)</p>'// html body
    }
    transport.sendMail(mailOptions, function (err, result) {
        if (err) {
            console.log(err, "err")
            // res.send({
            //     message: err
            // })
        } else {
            transport.close();

            console.log(result, "mail sent!")
            // res.send({
            //     message: 'Email has been sent: check your inbox!'
            // })
        }
    })
}
a();
