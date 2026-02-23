

export default function Status(){

	return (<>
	{/* Stats Section */}
			<section className="container mx-auto px-4 py-16">
				<div className="max-w-4xl mx-auto">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
						<div className="space-y-2">
							<div className="text-3xl font-bold text-foreground">
								10K+
							</div>
							<div className="text-sm text-muted-foreground">
								Surveys Created
							</div>
						</div>
						<div className="space-y-2">
							<div className="text-3xl font-bold text-foreground">
								500K+
							</div>
							<div className="text-sm text-muted-foreground">
								Responses
							</div>
						</div>
						<div className="space-y-2">
							<div className="text-3xl font-bold text-foreground">
								99.9%
							</div>
							<div className="text-sm text-muted-foreground">
								Uptime
							</div>
						</div>
						<div className="space-y-2">
							<div className="text-3xl font-bold text-foreground">
								4.8/5
							</div>
							<div className="text-sm text-muted-foreground">
								User Rating
							</div>
						</div>
					</div>
				</div>
			</section>
	</>)
}