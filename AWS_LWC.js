import { LightningElement } from "lwc";
import { loadScript} from "lightning/platformResourceLoader";
import awsjssdk from "@salesforce/resourceUrl/awsjssdk";
export default class AmazonSesCmp extends LightningElement {
  sesConfig = {
    accessKey: "<your access key>",
    secretAccessKey: "<your secret access key>",
    region: "<your region>"
  };
  ses;
  renderedCallback() {
    Promise.all([loadScript(this, awsjssdk)])
      .then(() => {
        console.log("loaded");
        this.AWSSDKIntialized();
      })
      .catch((error) => {
        console.log("error " + error);
      });
  }
  AWSSDKIntialized() {
    const AWS = window.AWS;
    console.log(JSON.stringify(AWS.config));
    AWS.config.update({
      accessKeyId: this.sesConfig.accessKey,
      secretAccessKey: this.sesConfig.secretAccessKey,
      region: this.sesConfig.region
    });
    this.ses = new AWS.SES({ apiVersion: "2010-12-01" });
  }
  sendEmail(){
    const params = {
      Destination: {
        BccAddresses: [
         ], // Optional
         CcAddresses: [
         "verified email address"
          ],// Optional
         ToAddresses: ["verified email address"] // Email address/addresses that you want to send your email
      },
     // ConfigurationSetName: <<ConfigurationSetName>>,
      Message: {
        Body: {
          Html: {
            // HTML Format of the email
            Charset: "UTF-8",
            Data:
 "<html><body><h1>Hello  Mukul</h1><p style='color:blue'>Sample Body</p></body></html>"
          },
          Text: {
            Charset: "UTF-8",
            Data: "Hello Mukul Sample Body"
          }
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Test email"
        }
      },
      ReplyToAddresses: [
        ], // Optional
      Source: "<verified From Email Address>"
     };
    
const sendEmail = this.ses.sendEmail(params).promise();
    sendEmail
      .then((data) => {
        console.log("email submitted to SES  ", data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
