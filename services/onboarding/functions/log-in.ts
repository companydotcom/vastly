import {
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
  AdminGetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import inputOutputLogger from "@middy/input-output-logger";
import jsonBodyParser from "@middy/http-json-body-parser";
import { TIMEOUT_MINS } from "../lib/constants";
import { encrypt } from "../lib/encryption";

const { SES_FROM_ADDRESS, USER_POOL_ID, AWS_REGION } = process.env;
const ONE_MIN = 60 * 1000;

const cognitoClient = new CognitoIdentityProviderClient({ region: AWS_REGION });
const sesClient = new SESClient({ region: AWS_REGION });

const logIn = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { email, port } = typeof event.body === "string" ? JSON.parse(event.body) : event.body;

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        status: "EMAIL_MISSING",
        message: "You must provide a valid email.",
      }),
    };
  }

  // only send the magic link on the first attempt
  const now = new Date();
  const expiration = new Date(now.getTime() + ONE_MIN * TIMEOUT_MINS);
  const payload = {
    email,
    expiration: expiration.toJSON(),
  };

  const BASE_URL = `localhost:${port || 5001}`;

  const tokenRaw = await encrypt(JSON.stringify(payload));
  const token = new URLSearchParams({ "": tokenRaw || "" }).toString().slice(1);
  const magicLink = `http://${BASE_URL}?email=${email}&token=${token}`;

  try {
    const existingUserCommand = new AdminGetUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
    });

    const existingUser = await cognitoClient.send(existingUserCommand);

    if (existingUser) {
      // the decision to use Cognito’s user attributes has an impact on the number of users
      // that can sign in at the same time. Because Cognito has a hard limit of 25 reqs/sec
      // on AdminSetUserAttribute. If you’re likely to experience thundering herd problems
      // then you should consider using DynamoDB to record the secret token instead.
      const command = new AdminUpdateUserAttributesCommand({
        UserPoolId: USER_POOL_ID,
        Username: email,
        UserAttributes: [
          {
            Name: "custom:authChallenge",
            Value: tokenRaw,
          },
        ],
      });

      await cognitoClient.send(command);

      await sendEmail(email, magicLink);
      return {
        statusCode: 202,
        body: JSON.stringify({ code: "EMAIL_SENT", message: "The email has been sent!" }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: {
            code: "USER_NOT_FOUND",
            message: "User not found",
          },
        }),
      };
    }
  } catch (error: any) {
    if (error?.__type === "UserNotFoundException") {
      return {
        statusCode: error.$metadata.httpStatusCode || 400,
        body: JSON.stringify({
          error: {
            code: "USER_NOT_FOUND",
            message: "User not found",
          },
        }),
      };
    }

    return {
      statusCode: error.$metadata.httpStatusCode || 400,
      body: JSON.stringify({
        error: {
          code: "ERROR LOGGING IN",
          message: error?.__type,
        },
      }),
    };
  }
};

async function sendEmail(emailAddress: string, magicLink: string) {
  try {
    const emailInput = {
      Destination: {
        ToAddresses: [emailAddress],
      },
      Source: SES_FROM_ADDRESS,
      Message: {
        Subject: {
          Charset: "UTF-8",
          Data: "Your one-time sign in link",
        },
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="font-family:arial, 'helvetica neue', helvetica, sans-serif">
               <head>
                  <meta charset="UTF-8">
                  <meta content="width=device-width, initial-scale=1" name="viewport">
                  <meta name="x-apple-disable-message-reformatting">
                  <meta http-equiv="X-UA-Compatible" content="IE=edge">
                  <meta content="telephone=no" name="format-detection">
                  <title>New message</title>
                  <!--[if (mso 16)]>
                  <style type="text/css">
                     a {text-decoration: none;}
                  </style>
                  <![endif]--><!--[if gte mso 9]>
                  <style>sup { font-size: 100% !important; }</style>
                  <![endif]--><!--[if gte mso 9]>
                  <xml>
                     <o:OfficeDocumentSettings>
                        <o:AllowPNG></o:AllowPNG>
                        <o:PixelsPerInch>96</o:PixelsPerInch>
                     </o:OfficeDocumentSettings>
                  </xml>
                  <![endif]-->
                  <style type="text/css">
                     #outlook a {
                     padding:0;
                     }
                     .es-button {
                     mso-style-priority:100!important;
                     text-decoration:none!important;
                     }
                     a[x-apple-data-detectors] {
                     color:inherit!important;
                     text-decoration:none!important;
                     font-size:inherit!important;
                     font-family:inherit!important;
                     font-weight:inherit!important;
                     line-height:inherit!important;
                     }
                     .es-desk-hidden {
                     display:none;
                     float:left;
                     overflow:hidden;
                     width:0;
                     max-height:0;
                     line-height:0;
                     mso-hide:all;
                     }
                     td .es-button-border:hover a.es-button-1 {
                     background:#00529E!important;
                     }
                     @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120%!important } h1 { font-size:36px!important; text-align:left } h2 { font-size:20px!important; text-align:left } h3 { font-size:16px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:36px!important; text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:20px!important; text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:16px!important; text-align:left } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:16px!important; display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } }
                  </style>
               </head>
               <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
                  <div class="es-wrapper-color" style="background-color:#F6F6F6">
                     <!--[if gte mso 9]>
                     <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                        <v:fill type="tile" color="#f6f6f6"></v:fill>
                     </v:background>
                     <![endif]-->
                     <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#F6F6F6">
                        <tr>
                           <td valign="top" style="padding:0;Margin:0">
                              <table class="es-header" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
                                 <tr>
                                    <td align="center" style="padding:0;Margin:0">
                                       <table class="es-header-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px;margin-top:24px;">
                                          <tr>
                                             <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px">
                                                <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                   <tr>
                                                      <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                                                         <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                            <tr>
                                                               <td align="center" style="padding:0;Margin:0">
                                                                  <h1 style="Margin:0;line-height:43px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:36px;font-style:normal;font-weight:bold;color:#333333"><strong>Welcome!</strong></h1>
                                                                  <h2 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:20px;font-style:normal;font-weight:bold;color:#333333"><strong>Here's your magic link.</strong></h2>
                                                               </td>
                                                            </tr>
                                                            <tr>
                                                               <td align="center" style="padding:20px;Margin:0;font-size:0">
                                                                  <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                     <tr>
                                                                        <td style="padding:0;Margin:0;border-bottom:0px solid #cccccc;background:unset;height:1px;width:100%;margin:0px"></td>
                                                                     </tr>
                                                                  </table>
                                                               </td>
                                                            </tr>
                                                         </table>
                                                      </td>
                                                   </tr>
                                                </table>
                                             </td>
                                          </tr>
                                       </table>
                                    </td>
                                 </tr>
                              </table>
                              <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                                 <tr>
                                    <td align="center" style="padding:0;Margin:0">
                                       <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                                          <tr>
                                             <td align="left" style="padding:0;Margin:0;padding-left:20px;padding-right:20px">
                                                <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                   <tr>
                                                      <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                                                         <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                            <tr>
                                                               <td align="center" style="padding:0;Margin:0">
                                                                  <h3 style="Margin:0;line-height:19px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:16px;font-style:normal;font-weight:normal;color:#333333">Your link will expire in ${TIMEOUT_MINS} minutes.</h3>
                                                               </td>
                                                            </tr>
                                                            <tr>
                                                               <td align="center" style="padding:20px;Margin:0;font-size:0">
                                                                  <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                     <tr>
                                                                        <td style="padding:0;Margin:0;border-bottom:1px solid #ffffff;background:unset;height:1px;width:100%;margin:0px"></td>
                                                                     </tr>
                                                                  </table>
                                                               </td>
                                                            </tr>
                                                            <tr>
                                                               <td align="center" style="padding:0;Margin:0">
                                                                  <!--[if mso]>
                                                                  <a href=${magicLink} target="_blank" hidden>
                                                                     <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href=${magicLink}
                                                                        style="height:40px; v-text-anchor:middle; width:175px" arcsize="15%" strokecolor="#0067c5" strokeweight="1px" fillcolor="#0067c5">
                                                                        <w:anchorlock></w:anchorlock>
                                                                        <center style='color:#ffffff; font-family:verdana, geneva, sans-serif; font-size:14px; font-weight:400; line-height:14px; mso-text-raise:1px'>Authenticate</center>
                                                                     </v:roundrect>
                                                                  </a>
                                                                  <![endif]--><!--[if !mso]><!-- --><span class="msohide es-button-1 es-button-border" style="border-style:solid;border-color:#0067c5;background:#0067c5;border-width:0px 0px 2px 0px;display:inline-block;border-radius:6px;width:auto;mso-hide:all"><a href=${magicLink} class="es-button es-button-1" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:18px;display:inline-block;background:#0067c5;border-radius:6px;font-family:verdana, geneva, sans-serif;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center;padding:10px 20px 10px 20px;mso-padding-alt:0;mso-border-alt:10px solid #0067c5">Authenticate</a></span><!--<![endif]-->
                                                               </td>
                                                            </tr>
                                                            <tr>
                                                               <td align="center" style="padding:20px;Margin:0;font-size:0px">
                                                                  <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                     <tr>
                                                                        <td style="padding:0;Margin:0;border-bottom:1px solid #ffffff;background:unset;height:1px;width:100%;margin:0px"></td>
                                                                     </tr>
                                                                  </table>
                                                               </td>
                                                            </tr>
                                                         </table>
                                                      </td>
                                                   </tr>
                                                </table>
                                             </td>
                                          </tr>
                                       </table>
                                    </td>
                                 </tr>
                              </table>
                              <table class="es-footer" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top;margin-bottom:24px">
                                 <tr>
                                    <td align="center" style="padding:0;Margin:0">
                                       <table class="es-footer-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                                          <tr>
                                             <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px">
                                                <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                   <tr>
                                                      <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                                                         <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                            <tr>
                                                               <td align="left" style="padding:0;Margin:0">
                                                                  <h3 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:16px;font-style:normal;font-weight:normal;color:#333333;text-align:center">Have any questions?</h3>
                                                                  <h3 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:16px;font-style:normal;font-weight:normal;color:#333333;text-align:center"><a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#0066c0;font-size:16px;text-align:center" href="https://vastly.is">Contact our Support Desk.</a></h3>
                                                               </td>
                                                            </tr>
                                                            <tr>
                                                               <td align="center" height="48" style="padding:0;Margin:0"></td>
                                                            </tr>
                                                         </table>
                                                      </td>
                                                   </tr>
                                                </table>
                                             </td>
                                          </tr>
                                       </table>
                                    </td>
                                 </tr>
                              </table>
                           </td>
                        </tr>
                     </table>
                  </div>
               </body>
            </html>`,
          },
          Text: {
            Charset: "UTF-8",
            Data: `Welcome!\nYour link will expire in ${TIMEOUT_MINS} minutes.\nAuthenticate at ${magicLink}`,
          },
        },
      },
    };

    const command = new SendEmailCommand(emailInput);

    await sesClient.send(command);
  } catch (error) {
    console.log("Error sending email:", error);
    return error;
  }
}

const handler = middy(logIn)
  .use(jsonBodyParser())
  .use(cors())
  .use(inputOutputLogger())
  .use(httpErrorHandler());

export { handler, sendEmail };
