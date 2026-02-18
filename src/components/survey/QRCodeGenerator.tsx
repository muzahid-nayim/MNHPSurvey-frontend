import React from "react";
import { useQRCode } from "next-qrcode";

type QrCodeGeneratorProps = {
	text: string;
};

function QrCodeGenerator({ text }: QrCodeGeneratorProps) {
	const { Canvas, SVG } = useQRCode();

	return (
		<SVG
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
	);
}

export default QrCodeGenerator;
