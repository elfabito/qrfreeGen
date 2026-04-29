import type { QRContent, VCardContent, WiFiContent } from "@/types";

export function encodeQRContent(content: QRContent): string {
  switch (content.type) {
    case "url":
      return content.url || "";
    case "text":
      return content.text || "";
    case "wifi": {
      const { ssid, password, encryption, hidden } = content as WiFiContent;
      return `WIFI:T:${encryption};S:${ssid};P:${password};H:${hidden ? "true" : "false"};;`;
    }
    case "vcard": {
      const c = content as VCardContent;
      const name = [c.firstName, c.lastName].filter(Boolean).join(" ");
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${name}`,
        c.phone ? `TEL:${c.phone}` : null,
        c.email ? `EMAIL:${c.email}` : null,
        c.organization ? `ORG:${c.organization}` : null,
        c.website ? `URL:${c.website}` : null,
        "END:VCARD",
      ].filter(Boolean);
      return lines.join("\n");
    }
    case "email": {
      const params: string[] = [];
      if (content.subject) params.push(`subject=${encodeURIComponent(content.subject)}`);
      if (content.body) params.push(`body=${encodeURIComponent(content.body)}`);
      return `mailto:${content.to}${params.length ? "?" + params.join("&") : ""}`;
    }
    case "sms":
      return `smsto:${content.phone}:${content.message}`;
  }
}

export function getQRHint(content: QRContent): string {
  switch (content.type) {
    case "url":
      return content.url
        ? `Este QR llevará siempre a ${content.url}. Si en el futuro este link puede cambiar, considerá un QR dinámico.`
        : "";
    case "text":
      return "El texto está codificado dentro del QR. No puede modificarse después de impreso.";
    case "wifi":
      return (content as WiFiContent).ssid
        ? `Este QR conectará siempre a "${(content as WiFiContent).ssid}". Si cambiás la contraseña, necesitás generar uno nuevo.`
        : "";
    case "vcard":
      return "Esta tarjeta de contacto es permanente. Si tus datos cambian, considerá un QR dinámico.";
    case "email":
      return "Al escanear este QR se abrirá el cliente de correo con los datos pre-completados.";
    case "sms":
      return "Al escanear este QR se abrirá la app de mensajes con el teléfono y mensaje pre-completados.";
  }
}
