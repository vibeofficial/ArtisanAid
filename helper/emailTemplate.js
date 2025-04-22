const bg = 'https://res.cloudinary.com/djhz8vda0/image/upload/v1744460034/Frame1_zjsvjo.png';
const fb = 'https://res.cloudinary.com/djhz8vda0/image/upload/v1744591727/fb_iu3eul.png';
const twitter = 'https://res.cloudinary.com/djhz8vda0/image/upload/v1744591727/twitter_zzeonb.png';
const linkedin = 'https://res.cloudinary.com/djhz8vda0/image/upload/v1744591727/linkedin_lxgsxb.png';
const landingPage = 'https://artisian-aid.vercel.app/';
const loginPage = 'https://artisian-aid.vercel.app/login';
const artisans = 'https://artisian-aid.vercel.app/artisanpage';


exports.verifyMail = (link) => {
  return `
  <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
        <title>Verify Email</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }

          @media only screen and (max-width: 600px) {
            .container {
              width: 90% !important;
            }

            .button {
              width: 100% !important;
              padding: 12px 0 !important;
              font-size: 15px !important;
            }
          }
        </style>
      </head>
      <body>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-image:url('${bg}'); background-size:cover; background-repeat:no-repeat; background-position:center; font-family: Montserrat, Arial, sans-serif;">
          <tr>
            <td align="center" valign="top" style="padding-top: 60px;">
              <table class="container" width="400" cellpadding="0" cellspacing="0" border="0" style="width:400px; max-width:90%; margin:auto;">
                <!-- Content Box -->
                <tr>
                  <td class="content-box" style="background-color:#ffffff; border-radius:8px 8px 0 0; padding:20px 25px 15px; text-align:center; box-shadow:0 0 5px rgba(0, 0, 0, 0.1);">
                    <h2 style="font-size:25px; line-height: 1; color:#000435; margin-bottom:9px;">
                      Please verify your <span style="color:#2F80ED;">email address</span> To access all<br>features
                    </h2>
                    <p style="font-size:13px; color:#808080; line-height:1.5; margin-bottom:16px;">
                      Thank you for joining Artisan Aid! Before we can get started, we need to verify your email address. This
                      ensures that you receive important updates and communications from us.<br><br>
                      To complete your account setup, please click the verification button below:
                    </p>
                    <a href="${link}" style="display:inline-block; background-color:#000435; color:#ffffff; text-decoration:none; padding:10px 20px; border-radius:5px; font-weight:bold; font-size:14px;">
                      Confirm Email
                    </a>
                  </td>
                </tr>

                <!-- Footer Box -->
                <tr>
                  <td class="footer-box" style="background-color:#C1DBEA; border-radius:0 0 8px 8px; text-align:center; padding:10px 15px;">
                    <p style="font-size:13px; color:#5B5B5B; margin-bottom:6px;">
                      Connect with us #artisanaid
                    </p>
                    <a href=""><img src="${twitter}" alt="social media icons" style="width:20px; margin-bottom:5px; cursor: pointer;" /></a>
                    <a href=""><img src="${linkedin}" alt="social media icons" style="width:19px; margin-bottom:5px; margin-right: 5px; margin-left: 5px; cursor: pointer;" /></a>
                    <a href=""><img src="${fb}" alt="social media icons" style="width:20px; margin-bottom:5px; cursor: pointer;" /></a>
                    <p style="font-size:12px; color:#98A2B3;">
                      @${new Date().getFullYear()} ArtisanAid. All Rights Reserved.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Optional spacing at bottom -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td height="40"></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};


exports.resetPassword = (link) => {
  return `
  <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
        <title>Verify Email</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }

          @media only screen and (max-width: 600px) {
            .container {
              width: 90% !important;
            }

            .button {
              width: 100% !important;
              padding: 12px 0 !important;
              font-size: 15px !important;
            }
          }
        </style>
      </head>
      <body>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-image:url('${bg}'); background-size:cover; background-repeat:no-repeat; background-position:center; font-family: Montserrat, Arial, sans-serif;">
          <tr>
            <td align="center" valign="top" style="padding-top: 60px;">
              <table class="container" width="400" cellpadding="0" cellspacing="0" border="0" style="width:400px; max-width:90%; margin:auto;">
                <!-- Content Box -->
                <tr>
                  <td class="content-box" style="background-color:#ffffff; border-radius:8px 8px 0 0; padding:20px 25px 15px; text-align:center; box-shadow:0 0 5px rgba(0, 0, 0, 0.1);">
                    <h2 style="font-size:25px; line-height: 1; color:#000435; margin-bottom:9px;">
                      Reset Password
                    </h2>
                    <p style="font-size:13px; color:#808080; line-height:1.5; margin-bottom:16px;">
                      We received a request to reset your account password. Click on the button below to create a new password:
                    </p>
                    <a href="${link}" style="display:inline-block; background-color:#000435; color:#ffffff; text-decoration:none; padding:10px 20px; border-radius:5px; font-weight:bold; font-size:14px;">
                      Confirm Email
                    </a>
                  </td>
                </tr>

                <!-- Footer Box -->
                <tr>
                  <td class="footer-box" style="background-color:#C1DBEA; border-radius:0 0 8px 8px; text-align:center; padding:10px 15px;">
                    <p style="font-size:13px; color:#5B5B5B; margin-bottom:6px;">
                      Connect with us #artisanaid
                    </p>
                    <a href=""><img src="${twitter}" alt="social media icons" style="width:20px; margin-bottom:5px;" /></a>
                    <a href=""><img src="${linkedin}" alt="social media icons" style="width:19px; margin-bottom:5px; margin-right: 5px; margin-left: 5px;" /></a>
                    <a href=""><img src="${fb}" alt="social media icons" style="width:20px; margin-bottom:5px;" /></a>
                    <p style="font-size:12px; color:#98A2B3;">
                      @${new Date().getFullYear()} ArtisanAid. All Rights Reserved.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Optional spacing at bottom -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td height="40"></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};


exports.acceptVerification = () => {
  return `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ACCOUNT VERIFICATION</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
  </head>

  <body style="margin: 0; padding: 0; font-family: Montserrat, sans-serif; background-color: #f4f4f4; color: #000;">
    <table align="center" width="100%" style="max-width: 400px; background-color: #ffffff; border-collapse: collapse;">
      <!-- Header Section -->
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #C1DBEA;">
          <h2 style="margin: 0; color: #000;">Artisan<span style="color: #FFA500;">Aid</span></h2>
        </td>
      </tr>

      <!-- Body Section -->
      <tr>
        <td style="padding: 20px; text-align: center;">
          <h2 style="color: #000;">Artisan Account Verification Successful</h2>
          <p style="font-size: 14px; line-height: 1.5; color: #808080;">
            Great news! We've reviewed the documents you submitted, and your artisan account has been successfully verified.
            <br /><br />
            Click on the button below to connect with employers now!
          </p>
          <a href="${landingPage}" 
             style="display: inline-block; background-color: #000435; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 14px; margin-top: 15px;">
            Connect Now!!!
          </a>
        </td>
      </tr>

      <!-- Social Section -->
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #f4f4f4;">
          <p style="font-size: 14px; color: #98A2B3;">Connect with us #artisanaid</p>
          <div>
            <a href="" style="margin: 5px;"><img src="${twitter}" alt="Twitter" style="width: 24px;"></a>
            <a href="" style="margin: 5px;"><img src="${linkedin}" alt="LinkedIn" style="width: 24px;"></a>
            <a href="" style="margin: 5px;"><img src="${fb}" alt="Facebook" style="width: 24px;"></a>
          </div>
          <p style="font-size: 12px; color: #808080;">©${new Date().getFullYear()} ArtisanAid. All Rights Reserved.</p>
        </td>
      </tr>
    </table>
  </body>

  </html>
  `;
};


exports.rejectVerification = () => {
  return `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ACCOUNT VERIFICATION</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
  </head>

  <body style="margin: 0; padding: 0; font-family: Montserrat, sans-serif; background-color: #f4f4f4; color: #000;">
    <table align="center" width="100%" style="max-width: 400px; background-color: #ffffff; border-collapse: collapse;">
      <!-- Header Section -->
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #C1DBEA;">
          <h2 style="margin: 0; color: #000;">Artisan<span style="color: #FFA500;">Aid</span></h2>
        </td>
      </tr>

      <!-- Body Section -->
      <tr>
        <td style="padding: 20px; text-align: center;">
          <h2 style="color: #000;">Artisan Account Verification Declined</h2>
          <p style="font-size: 14px; line-height: 1.5; color: #808080;">
            Thank you for submitting your documents for verification. After careful review, we were unable to verify your artisan account at this time.
            <br /><br />
            Please log in to your account to update or re-upload your documents.
          </p>
          <a href="${loginPage}" 
             style="display: inline-block; background-color: #000435; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 14px; margin-top: 15px;">
            Log In
          </a>
        </td>
      </tr>

      <!-- Social Section -->
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #f4f4f4;">
          <p style="font-size: 14px; color: #98A2B3;">Connect with us #artisanaid</p>
          <div>
            <a href="" style="margin: 5px;"><img src="${twitter}" alt="Twitter" style="width: 24px;"></a>
            <a href="" style="margin: 5px;"><img src="${linkedin}" alt="LinkedIn" style="width: 24px;"></a>
            <a href="" style="margin: 5px;"><img src="${fb}" alt="Facebook" style="width: 24px;"></a>
          </div>
          <p style="font-size: 12px; color: #808080;">©${new Date().getFullYear()} ArtisanAid. All Rights Reserved.</p>
        </td>
      </tr>
    </table>
  </body>

  </html>
  `;
};


exports.premiumSubscription = () => {
  return `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ACCOUNT VERIFICATION</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
  </head>

  <body style="margin: 0; padding: 0; font-family: Montserrat, sans-serif; background-color: #f4f4f4; color: #000;">
    <table align="center" width="100%" style="max-width: 400px; background-color: #ffffff; border-collapse: collapse;">
      <!-- Header Section -->
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #C1DBEA;">
          <h2 style="margin: 0; color: #000;">Artisan<span style="color: #FFA500;">Aid</span></h2>
        </td>
      </tr>

      <!-- Body Section -->
      <tr>
        <td style="padding: 20px; text-align: center;">
          <h2 style="color: #000;">Premium Subscription Successful</h2>
          <p style="font-size: 14px; line-height: 1.5; color: #808080;">
           Thank you for subscribing to the premium package! Your subscription is now active, and you're all set to enjoy exclusive features designed to help you grow your artisan business.
          </p>
          <a href="${loginPage}" 
             style="display: inline-block; background-color: #000435; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 14px; margin-top: 15px;">
            Log In
          </a>
        </td>
      </tr>

      <!-- Social Section -->
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #f4f4f4;">
          <p style="font-size: 14px; color: #98A2B3;">Connect with us #artisanaid</p>
          <div>
            <a href="" style="margin: 5px;"><img src="${twitter}" alt="Twitter" style="width: 24px;"></a>
            <a href="" style="margin: 5px;"><img src="${linkedin}" alt="LinkedIn" style="width: 24px;"></a>
            <a href="" style="margin: 5px;"><img src="${fb}" alt="Facebook" style="width: 24px;"></a>
          </div>
          <p style="font-size: 12px; color: #808080;">©${new Date().getFullYear()} ArtisanAid. All Rights Reserved.</p>
        </td>
      </tr>
    </table>
  </body>

  </html>
  `;
};


exports.basicSubscription = () => {
  return `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ACCOUNT VERIFICATION</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
  </head>

  <body style="margin: 0; padding: 0; font-family: Montserrat, sans-serif; background-color: #f4f4f4; color: #000;">
    <table align="center" width="100%" style="max-width: 400px; background-color: #ffffff; border-collapse: collapse;">
      <!-- Header Section -->
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #C1DBEA;">
          <h2 style="margin: 0; color: #000;">Artisan<span style="color: #FFA500;">Aid</span></h2>
        </td>
      </tr>

      <!-- Body Section -->
      <tr>
        <td style="padding: 20px; text-align: center;">
          <h2 style="color: #000;">Basic Subscription Successful</h2>
          <p style="font-size: 14px; line-height: 1.5; color: #808080;">
           Thank you for subscribing to the basic package! Your subscription is now active, and you're all set to enjoy exclusive features designed to help you grow your artisan business.
          </p>
          <a href="${loginPage}" 
             style="display: inline-block; background-color: #000435; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 14px; margin-top: 15px;">
            Log In
          </a>
        </td>
      </tr>

      <!-- Social Section -->
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #f4f4f4;">
          <p style="font-size: 14px; color: #98A2B3;">Connect with us #artisanaid</p>
          <div>
            <a href="" style="margin: 5px;"><img src="${twitter}" alt="Twitter" style="width: 24px;"></a>
            <a href="" style="margin: 5px;"><img src="${linkedin}" alt="LinkedIn" style="width: 24px;"></a>
            <a href="" style="margin: 5px;"><img src="${fb}" alt="Facebook" style="width: 24px;"></a>
          </div>
          <p style="font-size: 12px; color: #808080;">©${new Date().getFullYear()} ArtisanAid. All Rights Reserved.</p>
        </td>
      </tr>
    </table>
  </body>

  </html>
  `;
};


exports.acceptJobOffer = (name) => {
  return `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ACCOUNT VERIFICATION</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
  </head>

  <body style="margin: 0; padding: 0; font-family: Montserrat, sans-serif; background-color: #f4f4f4; color: #000;">
    <table align="center" width="100%" style="max-width: 400px; background-color: #ffffff; border-collapse: collapse;">
      <!-- Header Section -->
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #C1DBEA;">
          <h2 style="margin: 0; color: #000;">Artisan<span style="color: #FFA500;">Aid</span></h2>
        </td>
      </tr>

      <!-- Body Section -->
      <tr>
        <td style="padding: 20px; text-align: center;">
          <h2 style="color: #000;">Your Booking Has Been <span style="color: #FFA500;">Accepted by ${name}</span></h2>
          <p style="font-size: 14px; line-height: 1.5; color: #808080;">
           We're excited to inform you that the artisan you booked, ${name}, has accepted your booking request!<br><br>
           They will be reaching out to you shortly to discuss the details and next steps. In the meantime, you can review the booking details in your account.
          </p>
          <a href="${loginPage}" 
             style="display: inline-block; background-color: #000435; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 14px; margin-top: 15px;">
            Login In
          </a>
        </td>
      </tr>

      <!-- Social Section -->
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #f4f4f4;">
          <p style="font-size: 14px; color: #98A2B3;">Connect with us #artisanaid</p>
          <div>
            <a href="" style="margin: 5px;"><img src="${twitter}" alt="Twitter" style="width: 24px;"></a>
            <a href="" style="margin: 5px;"><img src="${linkedin}" alt="LinkedIn" style="width: 24px;"></a>
            <a href="" style="margin: 5px;"><img src="${fb}" alt="Facebook" style="width: 24px;"></a>
          </div>
          <p style="font-size: 12px; color: #808080;">©${new Date().getFullYear()} ArtisanAid. All Rights Reserved.</p>
        </td>
      </tr>
    </table>
  </body>

  </html>
  `;
};


exports.rejectJobOffer = (name) => {
  return `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ACCOUNT VERIFICATION</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
  </head>

  <body style="margin: 0; padding: 0; font-family: Montserrat, sans-serif; background-color: #f4f4f4; color: #000;">
    <table align="center" width="100%" style="max-width: 400px; background-color: #ffffff; border-collapse: collapse;">
      <!-- Header Section -->
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #C1DBEA;">
          <h2 style="margin: 0; color: #000;">Artisan<span style="color: #FFA500;">Aid</span></h2>
        </td>
      </tr>

      <!-- Body Section -->
      <tr>
        <td style="padding: 20px; text-align: center;">
          <h2 style="color: #000;">Update on Your Artisan Booking Request</h2>
          <p style="font-size: 14px; line-height: 1.5; color: #808080;">
           We wanted to inform you that the artisan you recently booked, ${name}, has unfortunately been rejected and will not be available for your project at this time.<br><br>
           We understand how important it is to find the right talent for your needs, and we're here to help you connect with other qualified artisans who can bring your project to life.
          </p>
          <a href="${artisans}" 
             style="display: inline-block; background-color: #000435; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 14px; margin-top: 15px;">
            Explore more artisans
          </a>
        </td>
      </tr>

      <!-- Social Section -->
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #f4f4f4;">
          <p style="font-size: 14px; color: #98A2B3;">Connect with us #artisanaid</p>
          <div>
            <a href="" style="margin: 5px;"><img src="${twitter}" alt="Twitter" style="width: 24px;"></a>
            <a href="" style="margin: 5px;"><img src="${linkedin}" alt="LinkedIn" style="width: 24px;"></a>
            <a href="" style="margin: 5px;"><img src="${fb}" alt="Facebook" style="width: 24px;"></a>
          </div>
          <p style="font-size: 12px; color: #808080;">©${new Date().getFullYear()} ArtisanAid. All Rights Reserved.</p>
        </td>
      </tr>
    </table>
  </body>

  </html>
  `;
};


exports.subscriptionExpire = () => {
  return `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ACCOUNT VERIFICATION</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
  </head>

  <body style="margin: 0; padding: 0; font-family: Montserrat, sans-serif; background-color: #f4f4f4; color: #000;">
    <table align="center" width="100%" style="max-width: 400px; background-color: #ffffff; border-collapse: collapse;">
      <!-- Header Section -->
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #C1DBEA;">
          <h2 style="margin: 0; color: #000;">Artisan<span style="color: #FFA500;">Aid</span></h2>
        </td>
      </tr>

      <!-- Body Section -->
      <tr>
        <td style="padding: 20px; text-align: center;">
          <h2 style="color: #000;">Your Subscription Has Expired - Don't Miss Out!</h2>
          <p style="font-size: 14px; line-height: 1.5; color: #808080;">
          We hope you’ve enjoyed all the benefits of being part of the Artisan aid community! We want to notify you that your subscription has expired.<br><br>
          To continue enjoying uninterrupted access to our platform—connecting you with top employers —please renew your subscription before it expires by clicking on the link below.
          </p>
          <a href="${loginPage}" 
             style="display: inline-block; background-color: #000435; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 14px; margin-top: 15px;">
            Login to Subscribe
          </a>
        </td>
      </tr>

      <!-- Social Section -->
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #f4f4f4;">
          <p style="font-size: 14px; color: #98A2B3;">Connect with us #artisanaid</p>
          <div>
            <a href="" style="margin: 5px;"><img src="${twitter}" alt="Twitter" style="width: 24px;"></a>
            <a href="" style="margin: 5px;"><img src="${linkedin}" alt="LinkedIn" style="width: 24px;"></a>
            <a href="" style="margin: 5px;"><img src="${fb}" alt="Facebook" style="width: 24px;"></a>
          </div>
          <p style="font-size: 12px; color: #808080;">©${new Date().getFullYear()} ArtisanAid. All Rights Reserved.</p>
        </td>
      </tr>
    </table>
  </body>

  </html>
  `;
};


exports.artisanBookingMail = (category) => {
  return `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ACCOUNT VERIFICATION</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
  </head>

  <body style="margin: 0; padding: 0; font-family: Montserrat, sans-serif; background-color: #f4f4f4; color: #000;">
    <table align="center" width="100%" style="max-width: 400px; background-color: #ffffff; border-collapse: collapse;">
      <!-- Header Section -->
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #C1DBEA;">
          <h2 style="margin: 0; color: #000;">Artisan<span style="color: #FFA500;">Aid</span></h2>
        </td>
      </tr>

      <!-- Body Section -->
      <tr>
        <td style="padding: 20px; text-align: center;">
          <h2 style="color: #000;">New Booking Alert - Please Confirm Within 24 Hours</h2>
          <p 
          Good news! You have a new service booking on your ${category}.<br><br>
          Please log in to the app to to see employer’s details and confirm or reject this booking within the next 24 hours.
          </p>
          <a href="${loginPage}" 
             style="display: inline-block; background-color: #000435; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 14px; margin-top: 15px;">
            Proceed to Log in
          </a>
        </td>
      </tr>

      <!-- Social Section -->
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #f4f4f4;">
          <p style="font-size: 14px; color: #98A2B3;">Connect with us #artisanaid</p>
          <div>
            <a href="" style="margin: 5px;"><img src="${twitter}" alt="Twitter" style="width: 24px;"></a>
            <a href="" style="margin: 5px;"><img src="${linkedin}" alt="LinkedIn" style="width: 24px;"></a>
            <a href="" style="margin: 5px;"><img src="${fb}" alt="Facebook" style="width: 24px;"></a>
          </div>
          <p style="font-size: 12px; color: #808080;">©${new Date().getFullYear()} ArtisanAid. All Rights Reserved.</p>
        </td>
      </tr>
    </table>
  </body>

  </html>
  `;
};


exports.employerBookingMail = (fullname, category) => {
  return `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ACCOUNT VERIFICATION</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
  </head>

  <body style="margin: 0; padding: 0; font-family: Montserrat, sans-serif; background-color: #f4f4f4; color: #000;">
    <table align="center" width="100%" style="max-width: 400px; background-color: #ffffff; border-collapse: collapse;">
      <!-- Header Section -->
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #C1DBEA;">
          <h2 style="margin: 0; color: #000;">Artisan<span style="color: #FFA500;">Aid</span></h2>
        </td>
      </tr>

      <!-- Body Section -->
      <tr>
        <td style="padding: 20px; text-align: center;">
          <h2 style="color: #000;">Your Artisan Booking is Confirmed!</h2>
          <p 
          Thanks for booking ${fullname} on ${category}. Your artisan will contact you within 24 hours to arrange the service.<br><br>
          If you do not hear from the artisan within this time frame, feel free to browse and book another artisan through our app to ensure your project is completed on time.
          </p>
          <a href="${artisans}" 
             style="display: inline-block; background-color: #000435; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 14px; margin-top: 15px;">
            Explore more artisans
          </a>
        </td>
      </tr>

      <!-- Social Section -->
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #f4f4f4;">
          <p style="font-size: 14px; color: #98A2B3;">Connect with us #artisanaid</p>
          <div>
            <a href="" style="margin: 5px;"><img src="${twitter}" alt="Twitter" style="width: 24px;"></a>
            <a href="" style="margin: 5px;"><img src="${linkedin}" alt="LinkedIn" style="width: 24px;"></a>
            <a href="" style="margin: 5px;"><img src="${fb}" alt="Facebook" style="width: 24px;"></a>
          </div>
          <p style="font-size: 12px; color: #808080;">©${new Date().getFullYear()} ArtisanAid. All Rights Reserved.</p>
        </td>
      </tr>
    </table>
  </body>

  </html>
  `;
};