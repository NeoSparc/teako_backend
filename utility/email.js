// signup otp email template
const emailTemplate=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 500px;
            margin: 30px auto;
            background-color: #ffffff;
            border: 2px solid #F89F1F;
            border-radius: 8px;
            box-shadow: 0 0 12px rgba(0, 0, 0, 0.15);
            overflow: hidden;
        }
        .header {
            background-color: #382A1E;
            color: #F89F1F;
            padding: 20px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
        }
        .content {
            padding: 30px;
            text-align: center;
            color: #382A1E;
        }
        .otp {
            font-size: 28px;
            font-weight: bold;
            color: #F89F1F;
            background-color: #fdf7e3;
            border: 2px dashed #F89F1F;
            padding: 15px;
            margin: 20px auto;
            display: inline-block;
            border-radius: 6px;
        }
        .footer {
            background-color: #382A1E;
            color: #f4f4f4;
            padding: 10px;
            text-align: center;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            Your OTP is Here!
        </div>
        <div class="content">
            <p>"Unlock the possibilities at <strong>Teako</strong> Interiors with your one-time verification code!"</p>
            <div class="otp">{{OTP}}</div>
            <p>Please do not share this OTP with anyone for your security.</p>
        </div>
        <div class="footer">
            &copy; 2024 Teako Interiors. All rights reserved.
        </div>
    </div>
</body>
</html>`


// signup otp email function
exports.generateOtpContent=(otp)=>{
        return emailTemplate.replace('{{OTP}}',otp)
      }

// reset password success
exports.resetPasswordSuccess = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Successful</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 500px;
            margin: 30px auto;
            background-color: #ffffff;
            border: 2px solid #F89F1F;
            border-radius: 8px;
            box-shadow: 0 0 12px rgba(0, 0, 0, 0.15);
            overflow: hidden;
        }
        .header {
            background-color: #382A1E;
            color: #F89F1F;
            padding: 20px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
        }
        .content {
            padding: 30px;
            text-align: center;
            color: #382A1E;
        }
        .message {
            font-size: 18px;
            margin: 20px 0;
            color: #382A1E;
        }
        .footer {
            background-color: #382A1E;
            color: #f4f4f4;
            padding: 10px;
            text-align: center;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            Password Reset Successful
        </div>
        <div class="content">
            <p class="message">Your password has been successfully reset. You can now log in to your <strong>Teako Interiors</strong> account using your new credentials.</p>
        </div>
        <div class="footer">
            &copy; 2024 Teako Interiors. All rights reserved.
        </div>
    </div>
</body>
</html>`
