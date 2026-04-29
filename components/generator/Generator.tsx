"use client";

import { useState, useEffect, useRef } from "react";
import {
  Link2,
  Type,
  Wifi,
  User,
  Mail,
  MessageSquare,
  SlidersHorizontal,
  Download,
  ChevronDown,
  Upload,
  Info,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  QRType,
  QRStyle,
  QRContent,
  URLContent,
  TextContent,
  WiFiContent,
  VCardContent,
  EmailContent,
  SMSContent,
  DEFAULT_QR_STYLE,
} from "@/types";
import { encodeQRContent, getQRHint } from "@/lib/utils/qr-encode";
import { useProStatus } from "@/lib/hooks/useProStatus";

// ─── Constants ───────────────────────────────────────────────────────────────

const QR_TYPES = [
  { type: "url" as QRType, label: "URL", icon: Link2 },
  { type: "text" as QRType, label: "Texto", icon: Type },
  { type: "wifi" as QRType, label: "WiFi", icon: Wifi },
  { type: "vcard" as QRType, label: "vCard", icon: User },
  { type: "email" as QRType, label: "Email", icon: Mail },
  { type: "sms" as QRType, label: "SMS", icon: MessageSquare },
] as const;

const DOT_STYLES = [
  { value: "square", label: "Cuadrado" },
  { value: "rounded", label: "Redondeado" },
  { value: "dots", label: "Puntos" },
  { value: "classy", label: "Clásico" },
  { value: "classy-rounded", label: "Clásico R." },
  { value: "extra-rounded", label: "Extra R." },
] as const;

const ECL_LEVELS = [
  { value: "L", label: "L — Baja (7%)" },
  { value: "M", label: "M — Media (15%)" },
  { value: "Q", label: "Q — Alta (25%)" },
  { value: "H", label: "H — Máxima (30%)" },
] as const;

const DOWNLOAD_SIZES = [256, 512, 1024, 2048];

const DEFAULT_CONTENTS: Record<QRType, QRContent> = {
  url: { type: "url", url: "" },
  text: { type: "text", text: "" },
  wifi: { type: "wifi", ssid: "", password: "", encryption: "WPA", hidden: false },
  vcard: { type: "vcard", firstName: "", lastName: "", phone: "", email: "", organization: "", website: "" },
  email: { type: "email", to: "", subject: "", body: "" },
  sms: { type: "sms", phone: "", message: "" },
};

// ─── Shared input primitives ─────────────────────────────────────────────────

const inputClass =
  "w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-colors placeholder:text-muted-foreground/50";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
      {children}
    </label>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

// ─── QR type forms ───────────────────────────────────────────────────────────

function URLForm({ content, onChange }: { content: URLContent; onChange: (c: URLContent) => void }) {
  return (
    <Field label="URL">
      <input
        type="url"
        className={inputClass}
        value={content.url}
        onChange={(e) => onChange({ ...content, url: e.target.value })}
        placeholder="https://tu-sitio.com"

      />
    </Field>
  );
}

function TextForm({ content, onChange }: { content: TextContent; onChange: (c: TextContent) => void }) {
  return (
    <Field label="Texto">
      <textarea
        className={cn(inputClass, "resize-none")}
        rows={4}
        value={content.text}
        onChange={(e) => onChange({ ...content, text: e.target.value })}
        placeholder="Ingresá el texto que querés codificar..."
      />
    </Field>
  );
}

function WiFiForm({ content, onChange }: { content: WiFiContent; onChange: (c: WiFiContent) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Nombre de red (SSID)">
        <input
          className={inputClass}
          value={content.ssid}
          onChange={(e) => onChange({ ...content, ssid: e.target.value })}
          placeholder="Mi red WiFi"
        />
      </Field>
      {content.encryption !== "nopass" && (
        <Field label="Contraseña">
          <input
            type="password"
            className={inputClass}
            value={content.password}
            onChange={(e) => onChange({ ...content, password: e.target.value })}
            placeholder="Contraseña"
          />
        </Field>
      )}
      <Field label="Seguridad">
        <select
          className={inputClass}
          value={content.encryption}
          onChange={(e) =>
            onChange({ ...content, encryption: e.target.value as WiFiContent["encryption"] })
          }
        >
          <option value="WPA">WPA / WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">Sin contraseña</option>
        </select>
      </Field>
      <label className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
        <input
          type="checkbox"
          checked={content.hidden}
          onChange={(e) => onChange({ ...content, hidden: e.target.checked })}
          className="rounded border-border w-4 h-4 accent-accent"
        />
        <span className="text-muted-foreground">Red oculta</span>
      </label>
    </div>
  );
}

function VCardForm({ content, onChange }: { content: VCardContent; onChange: (c: VCardContent) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Nombre">
          <input
            className={inputClass}
            value={content.firstName}
            onChange={(e) => onChange({ ...content, firstName: e.target.value })}
            placeholder="Juan"
          />
        </Field>
        <Field label="Apellido">
          <input
            className={inputClass}
            value={content.lastName}
            onChange={(e) => onChange({ ...content, lastName: e.target.value })}
            placeholder="García"
          />
        </Field>
      </div>
      <Field label="Teléfono">
        <input
          type="tel"
          className={inputClass}
          value={content.phone}
          onChange={(e) => onChange({ ...content, phone: e.target.value })}
          placeholder="+598 91 234 567"
        />
      </Field>
      <Field label="Email">
        <input
          type="email"
          className={inputClass}
          value={content.email}
          onChange={(e) => onChange({ ...content, email: e.target.value })}
          placeholder="juan@ejemplo.com"
        />
      </Field>
      <Field label="Organización">
        <input
          className={inputClass}
          value={content.organization}
          onChange={(e) => onChange({ ...content, organization: e.target.value })}
          placeholder="Mi empresa"
        />
      </Field>
      <Field label="Sitio web">
        <input
          type="url"
          className={inputClass}
          value={content.website}
          onChange={(e) => onChange({ ...content, website: e.target.value })}
          placeholder="https://juan.com"
        />
      </Field>
    </div>
  );
}

function EmailForm({ content, onChange }: { content: EmailContent; onChange: (c: EmailContent) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Para">
        <input
          type="email"
          className={inputClass}
          value={content.to}
          onChange={(e) => onChange({ ...content, to: e.target.value })}
          placeholder="destino@ejemplo.com"
        />
      </Field>
      <Field label="Asunto">
        <input
          className={inputClass}
          value={content.subject}
          onChange={(e) => onChange({ ...content, subject: e.target.value })}
          placeholder="Asunto del mensaje"
        />
      </Field>
      <Field label="Mensaje">
        <textarea
          className={cn(inputClass, "resize-none")}
          rows={3}
          value={content.body}
          onChange={(e) => onChange({ ...content, body: e.target.value })}
          placeholder="Cuerpo del mensaje..."
        />
      </Field>
    </div>
  );
}

function SMSForm({ content, onChange }: { content: SMSContent; onChange: (c: SMSContent) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Teléfono">
        <input
          type="tel"
          className={inputClass}
          value={content.phone}
          onChange={(e) => onChange({ ...content, phone: e.target.value })}
          placeholder="+598 91 234 567"
        />
      </Field>
      <Field label="Mensaje">
        <textarea
          className={cn(inputClass, "resize-none")}
          rows={3}
          value={content.message}
          onChange={(e) => onChange({ ...content, message: e.target.value })}
          placeholder="Texto del SMS..."
        />
      </Field>
    </div>
  );
}

// ─── QR Preview ──────────────────────────────────────────────────────────────

function QRPreview({ qrData, style }: { qrData: string; style: QRStyle }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let mounted = true;

    const opts = {
      data: qrData || "https://qr.desane.com.uy",
      dotsOptions: { color: style.dotColor, type: style.dotStyle as string },
      backgroundOptions: { color: style.backgroundColor },
      qrOptions: { errorCorrectionLevel: style.errorCorrectionLevel as string },
      ...(style.logoDataUrl
        ? {
            image: style.logoDataUrl,
            imageOptions: { crossOrigin: "anonymous", margin: 4, imageSize: style.logoSize },
          }
        : {}),
    };

    if (instanceRef.current) {
      instanceRef.current.update(opts);
    } else {
      import("qr-code-styling").then(({ default: QRCodeStyling }) => {
        if (!mounted || !containerRef.current) return;
        const instance = new QRCodeStyling({ width: 280, height: 280, ...opts } as any);
        containerRef.current.innerHTML = "";
        instance.append(containerRef.current);
        instanceRef.current = instance;
      });
    }

    return () => {
      mounted = false;
    };
  }, [qrData, style]);

  return (
    <div
      className="rounded-xl overflow-hidden border border-border shadow-sm bg-white"
      style={{ padding: 12 }}
    >
      <div ref={containerRef} className="flex items-center justify-center w-[280px] h-[280px]" />
    </div>
  );
}

// ─── Customization panel ─────────────────────────────────────────────────────

function CustomizationPanel({
  style,
  onChange,
  isPro,
}: {
  style: QRStyle;
  onChange: (s: QRStyle) => void;
  isPro: boolean;
}) {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ ...style, logoDataUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5 pt-4 border-t border-border">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Color de puntos">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={style.dotColor}
              onChange={(e) => onChange({ ...style, dotColor: e.target.value })}
              className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-muted p-0.5"
            />
            <span className="text-sm text-muted-foreground font-mono">{style.dotColor}</span>
          </div>
        </Field>
        <Field label="Color de fondo">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={style.backgroundColor}
              onChange={(e) => onChange({ ...style, backgroundColor: e.target.value })}
              className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-muted p-0.5"
            />
            <span className="text-sm text-muted-foreground font-mono">{style.backgroundColor}</span>
          </div>
        </Field>
      </div>

      <Field label="Forma de puntos">
        <div className="grid grid-cols-3 gap-2">
          {DOT_STYLES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onChange({ ...style, dotStyle: value as QRStyle["dotStyle"] })}
              className={cn(
                "px-2 py-1.5 rounded-lg border text-xs transition-colors",
                style.dotStyle === value
                  ? "border-accent bg-accent/10 text-accent font-medium"
                  : "border-border text-muted-foreground hover:border-accent/50 hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Corrección de errores">
        <select
          className={inputClass}
          value={style.errorCorrectionLevel}
          onChange={(e) =>
            onChange({ ...style, errorCorrectionLevel: e.target.value as QRStyle["errorCorrectionLevel"] })
          }
        >
          {ECL_LEVELS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Logo (opcional)">
        {isPro ? (
          <>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-accent/50 hover:text-foreground cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                <span>{style.logoDataUrl ? "Cambiar logo" : "Subir imagen"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
              {style.logoDataUrl && (
                <button
                  onClick={() => onChange({ ...style, logoDataUrl: null })}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Quitar
                </button>
              )}
            </div>
            {style.logoDataUrl && (
              <div className="mt-3">
                <Label>Tamaño del logo</Label>
                <input
                  type="range"
                  min="0.1"
                  max="0.5"
                  step="0.05"
                  value={style.logoSize}
                  onChange={(e) => onChange({ ...style, logoSize: parseFloat(e.target.value) })}
                  className="w-full accent-accent"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Pequeño</span>
                  <span>Grande</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-2 border border-dashed border-border rounded-lg text-sm text-muted-foreground cursor-not-allowed opacity-60">
              <Lock className="w-4 h-4 shrink-0" />
              <span className="flex-1">Subir imagen</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-accent/15 text-accent px-1.5 py-0.5 rounded">
                PRO
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Agregá tu logo al centro del QR.{" "}
              <a
                href="/checkout"
                className="text-accent underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                Ver plan Pro →
              </a>
            </p>
          </div>
        )}
      </Field>
    </div>
  );
}

// ─── Main Generator ───────────────────────────────────────────────────────────

export function Generator() {
  const [qrType, setQrType] = useState<QRType>("url");
  const [contents, setContents] = useState<Record<QRType, QRContent>>(DEFAULT_CONTENTS);
  const [style, setStyle] = useState<QRStyle>(DEFAULT_QR_STYLE);
  const [showCustomization, setShowCustomization] = useState(false);
  const [downloadSize, setDownloadSize] = useState(512);
  const { isPro } = useProStatus();

  const currentContent = contents[qrType];
  const qrData = encodeQRContent(currentContent);
  const hint = getQRHint(currentContent);

  const updateContent = (type: QRType, content: QRContent) => {
    setContents((prev) => ({ ...prev, [type]: content }));
  };

  const handleDownload = async (extension: "png" | "svg") => {
    const { default: QRCodeStyling } = await import("qr-code-styling");
    const size = extension === "svg" ? 512 : downloadSize;
    const instance = new QRCodeStyling({
      width: size,
      height: size,
      data: qrData || "https://qr.desane.com.uy",
      dotsOptions: { color: style.dotColor, type: style.dotStyle as string },
      backgroundOptions: { color: style.backgroundColor },
      qrOptions: { errorCorrectionLevel: style.errorCorrectionLevel as string },
      ...(style.logoDataUrl
        ? {
            image: style.logoDataUrl,
            imageOptions: { crossOrigin: "anonymous", margin: 4, imageSize: style.logoSize },
          }
        : {}),
    } as any);
    instance.download({ name: "qr", extension });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Left: form area */}
      <div className="lg:col-span-3 space-y-6">
        {/* Type selector */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {QR_TYPES.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => setQrType(type)}
              className={cn(
                "flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border text-xs font-medium transition-all",
                qrType === type
                  ? "border-accent bg-accent/10 text-accent shadow-sm"
                  : "border-border text-muted-foreground hover:border-accent/40 hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Dynamic form */}
        <div className="bg-card border border-border rounded-2xl p-6">
          {qrType === "url" && (
            <URLForm
              content={currentContent as URLContent}
              onChange={(c) => updateContent("url", c)}
            />
          )}
          {qrType === "text" && (
            <TextForm
              content={currentContent as TextContent}
              onChange={(c) => updateContent("text", c)}
            />
          )}
          {qrType === "wifi" && (
            <WiFiForm
              content={currentContent as WiFiContent}
              onChange={(c) => updateContent("wifi", c)}
            />
          )}
          {qrType === "vcard" && (
            <VCardForm
              content={currentContent as VCardContent}
              onChange={(c) => updateContent("vcard", c)}
            />
          )}
          {qrType === "email" && (
            <EmailForm
              content={currentContent as EmailContent}
              onChange={(c) => updateContent("email", c)}
            />
          )}
          {qrType === "sms" && (
            <SMSForm
              content={currentContent as SMSContent}
              onChange={(c) => updateContent("sms", c)}
            />
          )}

          {/* Customization toggle */}
          <div className="mt-6">
            <button
              onClick={() => setShowCustomization(!showCustomization)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Personalización avanzada</span>
              <ChevronDown
                className={cn("w-4 h-4 transition-transform", showCustomization && "rotate-180")}
              />
            </button>

            {showCustomization && (
              <CustomizationPanel style={style} onChange={setStyle} isPro={isPro} />
            )}
          </div>
        </div>
      </div>

      {/* Right: preview + download */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="flex flex-col items-center gap-5">
          <QRPreview qrData={qrData} style={style} />

          {/* Hint */}
          {hint && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2.5 max-w-[304px]">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent" />
              <span>{hint}</span>
              {qrType === "url" && (
                <a href="#estatico-vs-dinamico" className="shrink-0 text-accent underline underline-offset-2">
                  Ver Pro
                </a>
              )}
            </div>
          )}

          {/* Download */}
          <div className="w-full max-w-[304px] space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground font-medium">Tamaño PNG:</label>
              <select
                value={downloadSize}
                onChange={(e) => setDownloadSize(Number(e.target.value))}
                className="text-xs border border-border rounded-lg px-2 py-1 bg-muted focus:outline-none focus:ring-1 focus:ring-accent/30"
              >
                {DOWNLOAD_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}×{s}px
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDownload("png")}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-accent-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm shadow-sm shadow-accent/20"
              >
                <Download className="w-4 h-4" />
                PNG
              </button>
              <button
                onClick={() => handleDownload("svg")}
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-border text-foreground font-semibold rounded-xl hover:bg-muted transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                SVG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
