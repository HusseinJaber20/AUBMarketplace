//when testing, we don't want to send emails to anyone
//hence, we will mock sendgrid, by making it call these empty functions instead
// --> no emails sent


module.exports = {
    setApiKey () {

    },
    send() {
        
    }
}