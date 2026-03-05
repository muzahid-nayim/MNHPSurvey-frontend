"use client";
import { useForm } from "react-hook-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateProfileMutation } from "@/core/api/authApi";
import { User } from "@/core/api/authApi";
import { toast } from "react-toastify";
import { AlertCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateUser } from "@/core/store/slices/authSlice";

interface EditProfileFormData {
	first_name?: string;
	last_name?: string;
	username: string;
}

interface EditProfileFormProps {
	user: User | null;
}

export function EditProfileForm({ user }: EditProfileFormProps) {
	const [updateProfile, { isLoading }] = useUpdateProfileMutation();
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<EditProfileFormData>({
		mode: "onBlur",
		defaultValues: {
			first_name: user?.first_name || "",
			last_name: user?.last_name || "",
			username: user?.username || "",
		},
	});

	const onSubmit = async (data: EditProfileFormData) => {
		try {
			const updatedUser = await updateProfile(data).unwrap();
			toast.success("Profile updated successfully!");
			dispatch(updateUser(updatedUser));
		} catch (error: unknown) {
			const errorData = (error as Record<string, unknown>)?.data as
				| Record<string, unknown>
				| undefined;
			const errorMessage =
				String(errorData?.error) ||
				String(errorData?.message) ||
				"Failed to update profile";
			toast.error(errorMessage);
		}
	};

	if (!user) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Edit Profile</CardTitle>
				<CardDescription>
					Update your personal information
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{/* Username */}
					<div className="space-y-2">
						<Label htmlFor="username">Username</Label>
						<Input
							{...register("username", {
								required: "Username is required",
								minLength: {
									value: 3,
									message:
										"Username must be at least 3 characters",
								},
								maxLength: {
									value: 150,
									message:
										"Username must be less than 150 characters",
								},
							})}
							type="text"
							id="username"
							placeholder="Enter your username"
							disabled={isLoading}
							className="text-sm md:text-base "
						/>
						{errors.username && (
							<p className="text-sm text-red-500 flex items-center gap-1">
								<AlertCircle className="h-3 w-3" />
								{errors.username.message}
							</p>
						)}
					</div>

					{/* First Name */}
					<div className="space-y-2">
						<Label htmlFor="first_name">First Name</Label>
						<Input
							{...register("first_name", {
								maxLength: {
									value: 150,
									message:
										"First name must be less than 150 characters",
								},
							})}
							type="text"
							id="first_name"
							placeholder="Enter your first name (optional)"
							disabled={isLoading}
							className="text-sm md:text-base "
						/>
						{errors.first_name && (
							<p className="text-sm text-red-500 flex items-center gap-1">
								<AlertCircle className="h-3 w-3" />
								{errors.first_name.message}
							</p>
						)}
					</div>

					{/* Last Name */}
					<div className="space-y-2">
						<Label htmlFor="last_name">Last Name</Label>
						<Input
							{...register("last_name", {
								maxLength: {
									value: 150,
									message:
										"Last name must be less than 150 characters",
								},
							})}
							type="text"
							id="last_name"
							placeholder="Enter your last name (optional)"
							disabled={isLoading}
							className="text-sm md:text-base "
						/>
						{errors.last_name && (
							<p className="text-sm text-red-500 flex items-center gap-1">
								<AlertCircle className="h-3 w-3" />
								{errors.last_name.message}
							</p>
						)}
					</div>

					<Button
						type="submit"
						disabled={isLoading}
						className="w-full"
					>
						{isLoading ? "Saving..." : "Save Changes"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
