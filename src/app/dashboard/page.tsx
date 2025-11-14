"use client";

import { useGetProfileQuery } from "@/core/api/authApi";

export default function Dashboard() {
	const { data: user, isLoading, isError } = useGetProfileQuery();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error fetching profile</div>;
	}

	return (
		<div>
			<h1>Profile</h1>
			<p>ID: {user?.id}</p>
			<p>Username: {user?.username}</p>
			<p>Email: {user?.email}</p>
			<p>First Name: {user?.first_name}</p>
			<p>Last Name: {user?.last_name}</p>
			<p>Is Email Verified: {user?.is_email_verified ? "Yes" : "No"}</p>
			<p>Date Joined: {user?.date_joined}</p>
		</div>
	);
}
