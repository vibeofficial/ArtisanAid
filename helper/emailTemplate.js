exports.verifyMail = (link) => {
  const bg = 'https://res.cloudinary.com/djhz8vda0/image/upload/v1744292357/Frame1_p8ipss.png';
  const social = 'https://res.cloudinary.com/djhz8vda0/image/upload/v1744292366/social_madlyu.png';

  return `
      <!DOCTYPE html>
    <html lang="en">

      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>verify email</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">

        <style>
          * {
            margin: 0;
            padding: 0;
          }

          body {
            width: 100%;
            height: 100vh;
          }

          main {
            height: 100%;
            width: 50%;
            margin: 0 auto;
            background: url(${bg});
            background-size: contain;
            background-repeat: no-repeat;
            position: relative;
            font-family: Montserrat, sans-serif;
          }

          .sectionEmpty {
            height: 70%;
            width: 100%;
          }

          .info {
            height: 55%;
            width: 50%;
            background: #fff;
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
          }

          .info .top {
            height: 33%;
            width: 80%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .info .top h2 {
            font-size: 20px;
            text-align: center;
            color: #000435;
          }

          .ea {
            color: #2F80ED;
          }

          .info .middle {
            height: 33%;
            width: 85%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .info .middle p {
            font-size: 13px;
            color: #808080;
            text-align: center;
          }

          .info .btn {
            height: 33%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .info .btn a {
            height: 35%;
            width: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
          }

          .info .btn button {
            height: 100%;
            width: 100%;
            background: #000435;
            border: none;
            color: #fff;
            border-radius: 5px;
            font-weight: bold;
            transition: all 0.5s;
          }

          .info .btn button:hover {
            cursor: pointer;
            background: #2f3476;
            transition: all 0.5s;
          }

          .social {
            height: 30%;
            width: 100%;
            background: #C1DBEA;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .socialEmpty {
            height: 25%;
            width: 100%;
          }

          .socialTop {
            width: 100%;
            height: 25%;
            display: flex;
            align-items: end;
            justify-content: center;
          }

          .socialTop p {
            color: #5B5B5B;
            font-size: 14px;
          }

          .socialMiddle {
            width: 20%;
            height: 25%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .socialMiddle img {
            width: 90%;
          }

          .socialBottom {
            width: 100%;
            height: 34%;
            display: flex;
            align-items: start;
            justify-content: center;
          }

          .socialBottom p {
            color: #98A2B3;
            font-size: 13px;
          }
        </style>

      </head>

      <body>
        <main>
          <section class="sectionEmpty"></section>

          <section class="info">
            <div class="top">
              <h2>Please verify your <span class="ea">email address</span> To access all<br>features</h2>
            </div>

            <div class="middle">
              <p>Thank you for joining Artisan Aid! Before we can get started, we need to verify your email address. This
                ensures that you receive important updates and communications from us.<br><br>To complete your account setup,
                please click the verification button below:</p>
            </div>

            <div class="btn"><a href=""><button>Confirm Email</button></a></div>
          </section>

          <section class="social">
            <div class="socialEmpty"></div>
            
            <div class="socialTop">
              <p>Connect with us #artisanaid</p>
            </div>

            <div class="socialMiddle">
              <img src=${social} alt="">
            </div>

            <div class="socialBottom">
              <p>&#169;2025 [ArtisanAid]. All Rights Reserved.</p>
            </div>
          </section>
        </main>
      </body>

    </html>
  `;
};