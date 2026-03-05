import React, { useRef, useCallback } from "react";
import { useQRCode } from "next-qrcode";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type QrCodeGeneratorProps = {
	text: string;
	showDownload?: boolean;
	onDownload?: () => void;
};

function QrCodeGenerator({
	text,
	showDownload = false,
	onDownload,
}: QrCodeGeneratorProps) {
	const { Canvas } = useQRCode();
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const setCanvasRef = useCallback((node: HTMLDivElement | null) => {
		if (node) {
			const canvas = node.querySelector("canvas");
			if (canvas) {
				canvasRef.current = canvas;
			}
		}
	}, []);

	const handleDownload = () => {
		const canvas = canvasRef.current;
		if (!canvas) {
			console.error("Canvas not found");
			return;
		}

		const dataUrl = canvas.toDataURL("image/png");
		const link = document.createElement("a");
		link.href = dataUrl;
		link.download = `qrcode-${text.slice(0, 20).replace(/[^a-z0-9]/gi, "_")}.png`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		onDownload?.();
	};

	return (
		<div className="flex flex-col items-center gap-4">
			<div ref={setCanvasRef}>
				<Canvas
					text={text}
					options={{
						margin: 2,
						width: 200,
						color: {
							dark: "#000",
							light: "#FFF",
						},
					}}
				/>
			</div>
			{showDownload && (
				<Button
					onClick={handleDownload}
					variant="outline"
					size="sm"
					className="gap-2"
				>
					<Download className="h-4 w-4" />
					Download QR Code
				</Button>
			)}
		</div>
	);
}

export default QrCodeGenerator;
