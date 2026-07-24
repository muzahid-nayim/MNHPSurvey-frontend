"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	useRemoveAvatarMutation,
	useUploadAvatarMutation,
	type User,
} from "@/core/api/authApi";
import { updateUser } from "@/core/store/slices/authSlice";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getDisplayName, getUserInitials } from "./profileUtils";

type Props = {
	user: User;
};

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB — same as backend
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function AvatarUploadCard({ user }: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const dispatch = useDispatch();
	const [preview, setPreview] = useState<string | null>(null);
	const [uploadAvatar, { isLoading: uploading }] = useUploadAvatarMutation();
	const [removeAvatar, { isLoading: removing }] = useRemoveAvatarMutation();

	const busy = uploading || removing;
	const imageSrc = preview || user.avatar || undefined;

	const onPickFile = () => {
		if (!busy) inputRef.current?.click();
	};

	const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		// allow picking the same file again later
		e.target.value = "";
		if (!file) return;

		if (!ALLOWED.includes(file.type)) {
			toast.error("Please choose a JPEG, PNG, WEBP, or GIF image.");
			return;
		}
		if (file.size > MAX_SIZE) {
			toast.error("Image must be 2 MB or smaller.");
			return;
		}

		const localUrl = URL.createObjectURL(file);
		setPreview(localUrl);

		try {
			const updated = await uploadAvatar(file).unwrap();
			dispatch(updateUser(updated));
			toast.success("Profile picture updated");
			setPreview(null);
			URL.revokeObjectURL(localUrl);
		} catch (err) {
			setPreview(null);
			URL.revokeObjectURL(localUrl);
			const data = (err as { data?: { error?: string } })?.data;
			toast.error(data?.error || "Failed to upload picture");
		}
	};

	const onRemove = async () => {
		try {
			const updated = await removeAvatar().unwrap();
			dispatch(updateUser(updated));
			setPreview(null);
			toast.success("Profile picture removed");
		} catch {
			toast.error("Failed to remove picture");
		}
	};

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-base sm:text-lg">
					Profile picture
				</CardTitle>
				<CardDescription>
					JPG, PNG, WEBP or GIF — up to 2 MB
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
					<button
						type="button"
						onClick={onPickFile}
						disabled={busy}
						className="group relative rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						aria-label="Change profile picture"
					>
						<Avatar className="h-24 w-24 border sm:h-28 sm:w-28">
							<AvatarImage
								src={imageSrc}
								alt={getDisplayName(user)}
								className="object-cover"
							/>
							<AvatarFallback className="bg-primary/15 text-xl font-semibold text-primary">
								{getUserInitials(user)}
							</AvatarFallback>
						</Avatar>
						<span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
							{busy ? (
								<Loader2 className="h-5 w-5 animate-spin text-white" />
							) : (
								<Camera className="h-5 w-5 text-white" />
							)}
						</span>
					</button>

					<div className="flex w-full flex-col gap-2 sm:w-auto">
						<p className="text-center text-sm font-medium sm:text-left">
							{getDisplayName(user)}
						</p>
						<div className="flex flex-col gap-2 sm:flex-row">
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="gap-1.5"
								onClick={onPickFile}
								disabled={busy}
							>
								{uploading ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Camera className="h-4 w-4" />
								)}
								{user.avatar ? "Change photo" : "Upload photo"}
							</Button>
							{user.avatar && (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="gap-1.5 text-destructive hover:text-destructive"
									onClick={onRemove}
									disabled={busy}
								>
									{removing ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Trash2 className="h-4 w-4" />
									)}
									Remove
								</Button>
							)}
						</div>
					</div>
				</div>

				<input
					ref={inputRef}
					type="file"
					accept="image/jpeg,image/png,image/webp,image/gif"
					className="hidden"
					onChange={onFileChange}
				/>
			</CardContent>
		</Card>
	);
}
