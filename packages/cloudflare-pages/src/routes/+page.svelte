<script lang="ts">
	let password_mode = true;
	let exporting = false;
</script>

<div class="hero min-h-screen bg-base-200">
	<div class="hero-content flex-col lg:flex-row-reverse">
		<div class="text-center lg:text-left">
			<h1 class="text-5xl font-bold">Export Now!</h1>
			<p class="py-6">Export your data from Moodle with a developer friendly JSON format.</p>
			<p>
				<a href="https://github.com/JacobLinCool/moodle-export" target="_blank">
					<button class="btn btn-secondary btn-outline">View on GitHub</button>
				</a>
			</p>
		</div>
		<div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
			<div
				class="absolute right-0 top-0 p-4 tooltip tooltip-primary"
				data-tip="Toggle between session and username/password mode"
			>
				<input type="checkbox" class="toggle toggle-primary" bind:checked={password_mode} />
			</div>
			<form
				class="card-body"
				action="/api/export"
				method="get"
				on:submit={() => (exporting = true)}
			>
				<div class="form-control">
					<label class="label" for="base">
						<span class="label-text">Moodle Base URL</span>
					</label>
					<input
						id="base"
						name="base"
						type="url"
						placeholder="https://moodle.example.com"
						class="input input-bordered"
					/>
				</div>
				{#if password_mode === false}
					<div class="form-control">
						<label class="label" for="session">
							<span class="label-text">Session</span>
						</label>
						<input
							id="session"
							name="session"
							type="text"
							placeholder="Your MoodleSession cookie value"
							class="input input-bordered"
						/>
					</div>
				{:else}
					<div class="form-control">
						<label class="label" for="username">
							<span class="label-text">Username</span>
						</label>
						<input
							id="username"
							name="username"
							type="text"
							placeholder="Your Moodle Username"
							class="input input-bordered"
						/>
					</div>
					<div class="form-control">
						<label class="label" for="password">
							<span class="label-text">Password</span>
						</label>
						<input
							id="password"
							name="password"
							type="password"
							placeholder="Your Moodle Password"
							class="input input-bordered"
						/>
					</div>
				{/if}
				<div class="form-control mt-6">
					<input
						type="submit"
						class="btn btn-primary"
						class:animate-pulse={exporting}
						value={exporting ? "Exporting ..." : "Export as JSON"}
						disabled={exporting}
					/>
				</div>

				<div class="divider max-md:hidden" />
				<div class="form-control max-md:hidden">
					<label class="label" for="filter">
						<span
							class="label-text tooltip tooltip-right tooltip-info"
							data-tip="Filter courses by name that contains this string"
							>Course Name Filter</span
						>
					</label>
					<input
						id="filter"
						name="filter"
						type="text"
						placeholder="Leave empty to export all courses"
						class="input input-bordered"
					/>
				</div>
			</form>
		</div>
	</div>
</div>
