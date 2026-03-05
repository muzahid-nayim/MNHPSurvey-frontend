"use client";
import { useEffect, useState } from "react";
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
import { useChangePasswordMutation } from "@/core/api/authApi";
import { toast } from "react-toastify";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

interface ChangePasswordFormData {
	old_password: string;
	new_password: string;
	new_password2: string;
}

export function ChangePasswordForm() {
	const [changePassword, { isLoading }] = useChangePasswordMutation();
	const [showPassword, setShowPassword] = useState({
		old: false,
		new: false,
		confirm: false,
	});
	const [passwordStrength, setPasswordStrength] = useState(0);

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors, isValid },
	} = useForm<ChangePasswordFormData>({
		mode: "onChange",
		defaultValues: {
			old_password: "",
			new_password: "",
			new_password2: "",
		},
	});

	const newPassword = watch("new_password");

	// Calculate password strength
	const calculatePasswordStrength = (password: string) => {
		if (!password) return 0;
		let strength = 0;
		if (password.length >= 8) strength++;
		if (/[A-Z]/.test(password)) strength++;
		if (/[0-9]/.test(password)) strength++;
		if (/[^A-Za-z0-9]/.test(password)) strength++;
		setPasswordStrength(strength);
		return strength;
	};

	useEffect(() => {
		calculatePasswordStrength(newPassword);
	}, [newPassword]);

	const onSubmit = async (data: ChangePasswordFormData) => {
		try {
			await changePassword({
				old_password: data.old_password,
				new_password: data.new_password,
				new_password2: data.new_password2,
			}).unwrap();

			toast.success("Password changed successfully!");
			reset();
		} catch (error: unknown) {
			const errorData = (error as Record<string, unknown>)?.data as
				| Record<string, unknown>
				| undefined;
			const errorMessage =
				String(errorData?.error) ||
				String(errorData?.message) ||
				"Failed to change password";
			toast.error(errorMessage);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Change Password</CardTitle>
				<CardDescription>
					Update your password to keep your account secure
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{/* Old Password */}
					<div className="space-y-2">
						<Label htmlFor="old_password">Current Password</Label>
						<div className="relative">
							<Input
								{...register("old_password", {
									required: "Current password is required",
									minLength: {
										value: 6,
										message:
											"Password must be at least 6 characters",
									},
								})}
								type={showPassword.old ? "text" : "password"}
								id="old_password"
								placeholder="Enter your current password"
								disabled={isLoading}
								className="text-sm md:text-base pr-10"
							/>
							<button
								type="button"
								onClick={() =>
									setShowPassword((prev) => ({
										...prev,
										old: !prev.old,
									}))
								}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							>
								{showPassword.old ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</button>
						</div>
						{errors.old_password && (
							<p className="text-sm text-red-500 flex items-center gap-1">
								<AlertCircle className="h-3 w-3" />
								{errors.old_password.message}
							</p>
						)}
					</div>

					{/* New Password */}
					<div className="space-y-2">
						<Label htmlFor="new_password">New Password</Label>
						<div className="relative">
							<Input
								{...register("new_password", {
									required: "New password is required",
									minLength: {
										value: 8,
										message:
											"Password must be at least 8 characters",
									},
									validate: (value) => {
										if (!value) return true;
										if (!/[A-Z]/.test(value)) {
											return "Must contain at least one uppercase letter";
										}
										if (!/[a-z]/.test(value)) {
											return "Must contain at least one lowercase letter";
										}
										if (!/[0-9]/.test(value)) {
											return "Must contain at least one number";
										}
										return true;
									},
								})}
								type={showPassword.new ? "text" : "password"}
								id="new_password"
								placeholder="Enter your new password"
								disabled={isLoading}
								className="text-sm md:text-base pr-10"
							/>
							<button
								type="button"
								onClick={() =>
									setShowPassword((prev) => ({
										...prev,
										new: !prev.new,
									}))
								}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							>
								{showPassword.new ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</button>
						</div>
						{newPassword && (
							<div className="space-y-2">
								<div className="flex justify-between items-center">
									<span className="text-sm font-medium">
										Password Strength
									</span>
									<span
										className={`text-sm font-medium ${
											passwordStrength === 0
												? "text-red-500"
												: passwordStrength === 1
													? "text-orange-500"
													: passwordStrength === 2
														? "text-yellow-500"
														: passwordStrength === 3
															? "text-lime-500"
															: "text-green-500"
										}`}
									>
										{passwordStrength === 0
											? "Too Weak"
											: passwordStrength === 1
												? "Weak"
												: passwordStrength === 2
													? "Fair"
													: passwordStrength === 3
														? "Good"
														: "Strong"}
									</span>
								</div>
								<div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
									<div
										className={`h-full transition-all duration-300 ${
											passwordStrength === 0
												? "bg-red-500 w-1/4"
												: passwordStrength === 1
													? "bg-orange-500 w-1/2"
													: passwordStrength === 2
														? "bg-yellow-500 w-3/4"
														: passwordStrength === 3
															? "bg-lime-500 w-full"
															: "bg-green-500 w-full"
										}`}
									/>
								</div>
								<div className="flex gap-2 text-xs">
									<div
										className={`flex items-center gap-1 ${
											/[A-Z]/.test(newPassword)
												? "text-green-600"
												: "text-muted-foreground"
										}`}
									>
										<span
											className={`w-2 h-2 rounded-full ${
												/[A-Z]/.test(newPassword)
													? "bg-green-600"
													: "bg-gray-400"
											}`}
										/>
										Uppercase letter
									</div>
									<div
										className={`flex items-center gap-1 ${
											/[0-9]/.test(newPassword)
												? "text-green-600"
												: "text-muted-foreground"
										}`}
									>
										<span
											className={`w-2 h-2 rounded-full ${
												/[0-9]/.test(newPassword)
													? "bg-green-600"
													: "bg-gray-400"
											}`}
										/>
										Number
									</div>
									<div
										className={`flex items-center gap-1 ${
											newPassword.length >= 8
												? "text-green-600"
												: "text-muted-foreground"
										}`}
									>
										<span
											className={`w-2 h-2 rounded-full ${
												newPassword.length >= 8
													? "bg-green-600"
													: "bg-gray-400"
											}`}
										/>
										8+ characters
									</div>
									<div
										className={`flex items-center gap-1 ${
											/[^A-Za-z0-9]/.test(newPassword)
												? "text-green-600"
												: "text-muted-foreground"
										}`}
									>
										<span
											className={`w-2 h-2 rounded-full ${
												/[^A-Za-z0-9]/.test(newPassword)
													? "bg-green-600"
													: "bg-gray-400"
											}`}
										/>
										Special character
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Confirm New Password */}
					<div className="space-y-2">
						<Label htmlFor="new_password2">
							Confirm New Password
						</Label>
						<div className="relative">
							<Input
								{...register("new_password2", {
									required: "Please confirm your password",
									minLength: {
										value: 8,
										message:
											"Password must be at least 8 characters",
									},
									validate: (value) => {
										if (value !== newPassword) {
											return "Passwords do not match";
										}
										return true;
									},
								})}
								type={
									showPassword.confirm ? "text" : "password"
								}
								id="new_password2"
								placeholder="Confirm your new password"
								disabled={isLoading}
								className="text-sm md:text-base pr-10"
							/>
							<button
								type="button"
								onClick={() =>
									setShowPassword((prev) => ({
										...prev,
										confirm: !prev.confirm,
									}))
								}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							>
								{showPassword.confirm ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</button>
						</div>
						{errors.new_password2 && (
							<p className="text-sm text-red-500 flex items-center gap-1">
								<AlertCircle className="h-3 w-3" />
								{errors.new_password2.message}
							</p>
						)}
					</div>

					<Button
						type="submit"
						disabled={isLoading || !isValid}
						className="w-full"
					>
						{isLoading ? "Updating..." : "Update Password"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
