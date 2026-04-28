export type QRType = "url" | "text" | "wifi" | "vcard" | "email" | "sms";

export type DotStyle = "square" | "rounded" | "dots" | "classy" | "classy-rounded" | "extra-rounded";

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QRStyle {
  dotColor: string;
  backgroundColor: string;
  dotStyle: DotStyle;
  errorCorrectionLevel: ErrorCorrectionLevel;
  logoDataUrl: string | null;
  logoSize: number;
}

export interface URLContent {
  type: "url";
  url: string;
}

export interface TextContent {
  type: "text";
  text: string;
}

export interface WiFiContent {
  type: "wifi";
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}

export interface VCardContent {
  type: "vcard";
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  organization: string;
  website: string;
}

export interface EmailContent {
  type: "email";
  to: string;
  subject: string;
  body: string;
}

export interface SMSContent {
  type: "sms";
  phone: string;
  message: string;
}

export type QRContent =
  | URLContent
  | TextContent
  | WiFiContent
  | VCardContent
  | EmailContent
  | SMSContent;

export interface QRConfig {
  content: QRContent;
  style: QRStyle;
}

export const DEFAULT_QR_STYLE: QRStyle = {
  dotColor: "#000000",
  backgroundColor: "#ffffff",
  dotStyle: "square",
  errorCorrectionLevel: "M",
  logoDataUrl: null,
  logoSize: 0.3,
};
