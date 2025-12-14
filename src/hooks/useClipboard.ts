// src/hooks/useClipboard.ts

import { toast } from "react-toastify";

export const useClipboard = () => {
	
	const copyToClipboard = async (text: string, successMessage = "Copied to clipboard!") => {
		// modern 
		if (navigator.clipboard && window.isSecureContext) {
			try {
				await navigator.clipboard.writeText(text);
				toast.success(successMessage);
				return true;
			} catch (error) {
				console.error("Clipboard API error:", error);
				return copyFallback(text, successMessage);
			}
		} else {
			// for http or older browsers
			return copyFallback(text, successMessage);
		}
	};
	
	const copyFallback = (text: string, successMessage: string) => {
		try {
			const textArea = document.createElement("textarea");
			textArea.value = text;
			textArea.style.position = "fixed";
			textArea.style.opacity = "0";
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand("copy");
			document.body.removeChild(textArea);
			
			toast.success(successMessage);
			console.log("Fallback copy successful from fallback.");
			return true;
		} catch (error) {
			console.error("Fallback copy error:", error);
			toast.error("Failed to copy. Please copy manually.");
			return false;
		}
	};
	
	return { copyToClipboard };
};