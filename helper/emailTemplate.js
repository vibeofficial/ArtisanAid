// exports.verifyMail = (link) => {
//   const bg = 'https://res.cloudinary.com/djhz8vda0/image/upload/v1744292357/Frame1_p8ipss.png';
//   const social = 'https://res.cloudinary.com/djhz8vda0/image/upload/v1744292366/social_madlyu.png';

//   return `
//   <!DOCTYPE html>
//   <html lang="en">
//     <head>
//       <meta charset="UTF-8" />
//       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//       <title>Verify Email</title>
//       <style>
//         body {
//           margin: 0;
//           padding: 0;
//           background-color: #f4f4f4;
//         }

//         @media only screen and (max-width: 600px) {
//           .container {
//             width: 90% !important;
//           }

//           .button {
//             width: 100% !important;
//             padding: 12px 0 !important;
//             font-size: 15px !important;
//           }
//         }

//         @media (prefers-color-scheme: dark) {
//           body {
//             background-color: #1a1a1a !important;
//           }

//           .content-box {
//             background-color: #ffffff !important;
//             color: #000435 !important;
//           }

//           .content-box h2,
//           .content-box p {
//             color: #000435 !important;
//           }

//           .footer-box {
//             background-color: #333333 !important;
//           }

//           .footer-box p {
//             color: #cccccc !important;
//           }
//         }
//       </style>
//     </head>
//     <body>
//       <table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0" style="height:100vh; background-image:url('${bg}'); background-size:cover; background-repeat:no-repeat; background-position:center; font-family: Montserrat, Arial, sans-serif;">
//         <tr>
//           <td align="center" valign="middle">
//             <table class="container" width="400" cellpadding="0" cellspacing="0" border="0" style="width:400px; max-width:90%; margin:auto;">
//               <!-- Content Box -->
//               <tr>
//                 <td class="content-box" style="background-color:#ffffff; border-radius:8px 8px 0 0; padding:20px 25px 15px; text-align:center; box-shadow:0 0 5px rgba(0, 0, 0, 0.1); margin-top: 28px;">
//                   <h2 style="font-size:18px; color:#000435; margin-bottom:12px;">
//                     Please verify your <span style="color:#2F80ED;">email address</span> To access all<br>features
//                   </h2>
//                   <p style="font-size:13px; color:#808080; line-height:1.5; margin-bottom:16px;">
//                     Thank you for joining Artisan Aid! Before we can get started, we need to verify your email address. This
//                     ensures that you receive important updates and communications from us.<br><br>
//                     To complete your account setup, please click the verification button below:
//                   </p>
//                   <a href="${link}" style="display:inline-block; background-color:#000435; color:#ffffff; text-decoration:none; padding:10px 20px; border-radius:5px; font-weight:bold; font-size:14px;">
//                     Confirm Email
//                   </a>
//                 </td>
//               </tr>

//               <!-- Footer Box -->
//               <tr>
//                 <td class="footer-box" style="background-color:#C1DBEA; border-radius:0 0 8px 8px; text-align:center; padding:12px 20px;">
//                   <p style="font-size:13px; color:#5B5B5B; margin-bottom:6px;">
//                     Connect with us #artisanaid
//                   </p>
//                   <img src="${social}" alt="social media icons" style="width:100px; margin-bottom:8px;" />
//                   <p style="font-size:12px; color:#98A2B3;">
//                     &copy;2025 ArtisanAid. All Rights Reserved.
//                   </p>
//                 </td>
//               </tr>
//             </table>
//           </td>
//         </tr>
//       </table>
//     </body>
//   </html>
//   `;
// };







exports.verifyMail = (link) => {
  const bg = 'https://res.cloudinary.com/djhz8vda0/image/upload/v1744460034/Frame1_zjsvjo.png';
  const social = 'https://res.cloudinary.com/djhz8vda0/image/upload/v1744460015/social_qhnxbz.png';

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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

        @media (prefers-color-scheme: dark) {
          body {
            background-color: #1a1a1a !important;
          }

          .content-box {
            background-color: #ffffff !important;
            color: #000435 !important;
          }

          .content-box h2,
          .content-box p {
            color: #000435 !important;
          }

          .footer-box {
            background-color: #333333 !important;
          }

          .footer-box p {
            color: #cccccc !important;
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
                  <h2 style="font-size:25px; color:#000435; margin-bottom:9px;">
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
                <td class="footer-box" style="background-color:#C1DBEA; border-radius:0 0 8px 8px; text-align:center; padding:12px 20px;">
                  <p style="font-size:13px; color:#5B5B5B; margin-bottom:6px;">
                    Connect with us #artisanaid
                  </p>
                  <img src="${social}" alt="social media icons" style="width:100px; margin-bottom:8px;" />
                  <p style="font-size:12px; color:#98A2B3;">
                    &copy;2025 ArtisanAid. All Rights Reserved.
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
