const bg = 'https://res.cloudinary.com/djhz8vda0/image/upload/v1744460034/Frame1_zjsvjo.png';
const fb = 'https://res.cloudinary.com/djhz8vda0/image/upload/v1744591727/fb_iu3eul.png';
const twitter = 'https://res.cloudinary.com/djhz8vda0/image/upload/v1744591727/twitter_zzeonb.png';
const linkedin = 'https://res.cloudinary.com/djhz8vda0/image/upload/v1744591727/linkedin_lxgsxb.png';
const landingPage = 'https://artisian-aid.vercel.app/'


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
                      &#169;${new Date().getFullYear()} ArtisanAid. All Rights Reserved.
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


// exports.acceptVerification = () => {
//   return `
//   <!DOCTYPE html>
//   <html lang="en">

//   <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Document</title>
//     <link rel="preconnect" href="https://fonts.googleapis.com">
//     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
//     <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
//       rel="stylesheet">
//     <style>
//       * {
//         margin: 0;
//         padding: 0;
//         box-sizing: border-box;
//       }

//       body {
//         height: 100vh;
//         width: 100%;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//       }

//       main {
//         height: 90%;
//         width: 30%;
//         background: #C1DBEA;
//         display: flex;
//         flex-direction: column;
//         align-items: center;
//         font-family: Montserrat;
//       }

//       .secOne {
//         width: 80%;
//         height: 15%;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//       }

//       .secTwo {
//         width: 80%;
//         height: 61%;
//         background: #fff;
//         margin-bottom: 10px;
//       }

//       .secTwoFisrt {
//         width: 100%;
//         height: 25%;
//         display: flex;
//         align-items: center;
//       }

//       .secTwoSecond {
//         width: 100%;
//         height: 25%;
//       }

//       .secTwoThird {
//         width: 100%;
//         height: 25%;
//         display: flex;
//         position: relative;
//         align-items: center;
//         justify-content: center;
//       }

//       a {
//         width: 100%;
//         height: 100%;
//         display: flex;
//         position: relative;
//         align-items: center;
//         justify-content: center;
//       }

//       .secTwoFourth {
//         width: 100%;
//         height: 25%;
//       }

//       .secThree {
//         width: 80%;
//         height: 12%;
//         display: flex;
//         flex-direction: column;
//         align-items: center;
//       }

//       .secThreeP {
//         font-size: 12px;
//       }

//       .secThreeImg {
//         display: flex;
//         justify-content: center;
//         margin: 5px;
//         gap: 5px;
//       }

//       .secFour {
//         width: 80%;
//         height: 12%;
//       }
//     </style>
//   </head>

//   <body>
//     <main>
//       <section class="secOne">
//         <h2 style="color: #fff;">Artisan<span style="color: #FFA500;">Aid.</span></h2>
//       </section>
//       <section class="secTwo">
//         <div class="secTwoFisrt">
//           <h2 style="font-size: 21px; text-align: center;">Artisan Account Verification Successful</h2>
//         </div>
//         <div class="secTwoSecond">
//           <p style="font-size: 11px; text-align: center; color: #808080;">Great news! We've reviewed the documents you
//             submitted, and your artisan account has been<br><br>successfully verified.
//             Click on the button below to connect with employers now!!!</p>
//         </div>
//         <div class="secTwoThird">
//           <a href="${landi}">
//             <div class="btn1"
//               style="height: 55%; width: 50%; background: #000435; position: absolute; border-radius: 5px; z-index: 1; top: 13px; left: 70px; display: flex; align-items: center; justify-content: center;">
//               <p style="color: #fff;">Connect Now!!!</p>
//             </div>
//             <div class="btn1"
//               style="height: 55%; width: 50%; background: #2F80ED; position: absolute; border-radius: 5px; bottom: 15px;">
//             </div>
//           </a>
//         </div>
//         <div class="secTwoFourth">
//           <p style="color: #808080; font-size: 12px; text-align: center;">Start exploring opportunities and building your
//             profile today!</p>
//         </div>
//       </section>
//       <section class="secThree">
//         <div class="secThreeP">
//           <p style="font-size: 12px;">Connect with us #artisanaid</p>
//         </div>

//         <div class="secThreeImg">
//           <img src="${twitter}" alt="" style="width: 7%;">
//           <img src="${linkedin}" alt="" style="width: 7%;">
//           <img src="${fb}" alt="" style="width: 7%;">
//         </div>

//         <div>
//           <p style="font-size: 12px; color: #98A2B3;">©${new Date().getFullYear()} [ArtisanAid]. All Rights Reserved</p>
//         </div>
//       </section>
//       <section class="secFour"></section>
//     </main>
//   </body>

//   </html>
//   `
// };


exports.acceptVerification = (landingPage, twitter, linkedin, fb) => {
  return `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
      rel="stylesheet">
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Montserrat, sans-serif;
        background: #f4f4f4;
      }

      main {
        max-width: 600px;
        width: 100%;
        background: #C1DBEA;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 20px auto;
      }

      .secOne {
        width: 90%;
        padding: 20px 0;
        text-align: center;
      }

      .secTwo {
        width: 90%;
        background: #fff;
        margin-bottom: 10px;
        padding: 20px 10px;
        text-align: center;
      }

      .secTwo h2 {
        font-size: 21px;
        margin-bottom: 10px;
      }

      .secTwo p {
        font-size: 11px;
        color: #808080;
        margin-bottom: 20px;
        line-height: 1.5;
      }

      .btnContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        height: 50px;
        margin-bottom: 20px;
      }

      .btnBack {
        height: 100%;
        width: 50%;
        background: #2F80ED;
        border-radius: 5px;
        position: absolute;
        bottom: 0;
      }

      .btnFront {
        height: 100%;
        width: 50%;
        background: #000435;
        border-radius: 5px;
        position: absolute;
        top: 0;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        text-decoration: none;
        font-size: 14px;
      }

      .secThree {
        width: 90%;
        padding: 20px 0;
        text-align: center;
      }

      .secThree p {
        font-size: 12px;
        color: #98A2B3;
      }

      .socialIcons img {
        width: 24px;
        margin: 5px;
      }
    </style>
  </head>

  <body>
    <main>
      <section class="secOne">
        <h2 style="color: #fff;">Artisan<span style="color: #FFA500;">Aid.</span></h2>
      </section>
      <section class="secTwo">
        <h2>Artisan Account Verification Successful</h2>
        <p>
          Great news! We've reviewed the documents you submitted, and your artisan account has been<br><br>
          successfully verified. Click on the button below to connect with employers now!!!
        </p>
        <div class="btnContainer">
          <div class="btnBack"></div>
          <a href="${landingPage}" class="btnFront">Connect Now!!!</a>
        </div>
        <p style="font-size: 12px;">Start exploring opportunities and building your profile today!</p>
      </section>
      <section class="secThree">
        <p>Connect with us #artisanaid</p>
        <div class="socialIcons">
          <img src="${twitter}" alt="Twitter">
          <img src="${linkedin}" alt="LinkedIn">
          <img src="${fb}" alt="Facebook">
        </div>
        <p>©${new Date().getFullYear()} [ArtisanAid]. All Rights Reserved</p>
      </section>
    </main>
  </body>

  </html>
  `;
};
