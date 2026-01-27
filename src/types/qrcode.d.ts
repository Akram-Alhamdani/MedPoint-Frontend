declare module "qrcode" {
    export interface QRCodeRenderersOptions {
        errorCorrectionLevel?: "L" | "M" | "Q" | "H";
        type?: "image/png" | "image/jpeg" | "image/webp" | "svg" | "utf8";
        quality?: number;
        margin?: number;
        scale?: number;
        color?: {
            dark?: string;
            light?: string;
        };
        width?: number;
    }

    export function toDataURL(
        text: string,
        options?: QRCodeRenderersOptions,
    ): Promise<string>;

    export function toString(
        text: string,
        options?: QRCodeRenderersOptions,
    ): Promise<string>;

    export function toCanvas(
        canvas: HTMLCanvasElement,
        text: string,
        options?: QRCodeRenderersOptions,
    ): Promise<void>;

    export function toFile(
        path: string,
        text: string,
        options?: QRCodeRenderersOptions,
    ): Promise<void>;

    const QRCode: {
        toDataURL: typeof toDataURL;
        toString: typeof toString;
        toCanvas: typeof toCanvas;
        toFile: typeof toFile;
    };

    export default QRCode;
}
