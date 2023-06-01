require('dotenv').config()
import nodemailer from 'nodemailer'

let sendSimpleEmail = async (dataSend) => {

    //set mail người gửi 
    let transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "stmp.email.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        }
    })

    //code format thông tin trong mail
    let info = await transporter.sendMail({
        from: '"Trung tâm đăng kiểm vrss👻" <boan19997@gmail.com>',
        to: dataSend.reciverEmail,
        subject: "Thông tin đặt lịch đăng kiểm", // Subject line
        html: getBodyHTMLEmail(dataSend),
    })

}

let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch đăng kiểm online tại vrss</p>
        <p>Thông tin đặt lịch đăng kiểm:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Trung tâm đăng kiểm: ${dataSend.centerName}</b></div>

        <p>Nếu các thông tin trên đúng, vui lòng click vào đường link để xác nhận
            và hoàn tất thủ tục đặt lịch đăng kiểm
        </p>
        <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        </div>

        <div>Xin chân thành cám ơn!</div>
        `
    }
    if (dataSend.language === 'en') {
        result =
            `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>You received this email because you booked an online check-in at vrss</p>
        <p>Registration schedule information:</p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Registration Center: ${dataSend.centerName}</b></div>

        <p>If the above information is correct, please click on the link to confirm
        and complete the registration procedure
        </p>
        <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        </div>

        <div>Thank you very much!</div>
        `
    }
    return result
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName} !</h3>
        <p>Bạn nhận được email này vì đã đặt lịch đăng kiểm online trên vrss thành công</p>
        <p>Thông tin hoá đơn được gửi trong file đính kèm.</p>

        <div>Xin chân thành cám ơn!</div>
        `
    }
    if (dataSend.language === 'en') {
        result =
            `
        <h3>Dear ${dataSend.patientName} !</h3>
        <p>You received this email because you have successfully booked an online registration on vrss</p>
        <p>Invoice information is sent in the attached file.</p>

        <div>Thank you very much!</div>
        `
    }
    return result
}

let sendAttachment = async (dataSend) => {
    //set mail người gửi 
    let transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "stmp.email.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        }
    })

    //code format thông tin trong mail
    let info = await transporter.sendMail({
        from: '"Trung tâm đăng kiểm vrss👻" <boan19997@gmail.com>',
        to: dataSend.email,
        subject: "Kết quả đặt lịch khám bệnh", // Subject line
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: [
            {
                filename: `remedy-${dataSend.userId}-${new Date().getTime()}.png`,
                content: dataSend.imgBase64.split("base64,")[1],
                encoding: 'base64'
            }
        ]
    })
}

let getBodyHTMLEmailRefuse = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName} !</h3>
        <p>Bạn nhận được email này do trung tâm từ chối lịch hẹn của bạn vì lí do ${dataSend.refuse}</p>
        <p>Vui lòng thay đổi để phù hợp với yêu cầu đăng kiểm.</p>

        <div>Xin chân thành cám ơn!</div>
        `
    }
    if (dataSend.language === 'en') {
        result =
            `
        <h3>Dear ${dataSend.patientName} !</h3>
        <p>You received this email because the center rejected your appointment due to ${dataSend.refuse}</p>
        <p>Please change to match registration requirements.</p>

        <div>Thank you very much!</div>
        `
    }
    return result
}

let sendRefuse = async (dataSend) => {
    //set mail người gửi 
    let transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "stmp.email.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        }
    })

    //code format thông tin trong mail
    let info = await transporter.sendMail({
        from: '"Trung tâm đăng kiểm vrss 👻" <boan19997@gmail.com>',
        to: dataSend.email,
        subject: "Từ chối lịch hẹn đăng kiểm", // Subject line
        html: getBodyHTMLEmailRefuse(dataSend),
    })
}

module.exports = {
    sendSimpleEmail, getBodyHTMLEmail, sendAttachment, getBodyHTMLEmailRefuse, sendRefuse
}