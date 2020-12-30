const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


//Email sent once a new user signs up
const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.SENDGRID_SENDER_EMAIL,
        subject: 'Welcome to AUB Marketplace',
        html: `
        <div>Welcome to AUB Marketplace!</div>
        <div>&nbsp;</div>
        <div>Hello, ${name}, we&#39;re happy&nbsp;to see you joining, and eager to see you contributions to the community!</div>
        <div>Have fun browsing products and services shared by students and faculty!</div>
        <div>&nbsp;</div>
        <div>Best regards,</div>
        <div>AUB Marketplace Team</div>
        `
        
    }).catch((e)=>{
        console.log(e)
    })
}

//email sent once a current user deletes his account
const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.SENDGRID_SENDER_EMAIL,
        subject: 'Account Successfully deleted',
        html: `
        <div>Hi ${name},&nbsp;</div>
        <div>&nbsp;</div>
        <div>We&#39;re sorry to see you leaving.</div>
        <div>Please let us know if there is anything we could have done for a better experience.</div>
        <div>&nbsp;</div>
        <div>We hope to see you again!</div>
        <div>&nbsp;</div>
        <div>Best regards,</div>
        <div>AUB Marketplace Team</div>
        `
    }).catch((e)=>{
        console.log(e)
    })
}

//Email sent once a new user signs up
const sendRequestEmail = (email, seller, buyer) => {
    sgMail.send({
        to: email,
        from: process.env.SENDGRID_SENDER_EMAIL,
        subject: 'Someone wants your item!',
        html: `
        <div>Someone wants your item!!</div>
        <div>&nbsp;</div>
        <div>Hello, ${seller}, we&#39;re happy&nbsp;to inform you that ${buyer} wants to buy your item!!</div>
        <div>Please check the application for more information!</div>
        <div>&nbsp;</div>
        <div>Best regards,</div>
        <div>AUB Marketplace Team</div>
        `
    }).catch((e)=>{
        console.log(e)
    })
}


module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail,
    sendRequestEmail
}