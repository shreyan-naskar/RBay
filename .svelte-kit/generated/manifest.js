const c = [
	() => import("../../src/routes/__layout.svelte"),
	() => import("../runtime/components/error.svelte"),
	() => import("../../src/routes/index.svelte"),
	() => import("../../src/routes/dashboard/items/index.svelte"),
	() => import("../../src/routes/dashboard/items/new.svelte"),
	() => import("../../src/routes/privacy.svelte"),
	() => import("../../src/routes/about.svelte"),
	() => import("../../src/routes/items/index.svelte"),
	() => import("../../src/routes/items/[id].svelte"),
	() => import("../../src/routes/users/[id].svelte"),
	() => import("../../src/routes/auth/signin.svelte"),
	() => import("../../src/routes/auth/signup.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]], null, 1],

	// src/routes/dashboard/items/index.svelte
	[/^\/dashboard\/items\/?$/, [c[0], c[3]], [c[1]], null, 1],

	// src/routes/dashboard/items/new.svelte
	[/^\/dashboard\/items\/new\/?$/, [c[0], c[4]], [c[1]], null, 1],

	// src/routes/privacy.svelte
	[/^\/privacy\/?$/, [c[0], c[5]], [c[1]]],

	// src/routes/about.svelte
	[/^\/about\/?$/, [c[0], c[6]], [c[1]]],

	// src/routes/items/index.svelte
	[/^\/items\/?$/, [c[0], c[7]], [c[1]], null, 1],

	// src/routes/items/[id].svelte
	[/^\/items\/([^/]+?)\/?$/, [c[0], c[8]], [c[1]], (m) => ({ id: d(m[1])}), 1],

	// src/routes/users/[id].svelte
	[/^\/users\/([^/]+?)\/?$/, [c[0], c[9]], [c[1]], (m) => ({ id: d(m[1])}), 1],

	// src/routes/auth/signin.svelte
	[/^\/auth\/signin\/?$/, [c[0], c[10]], [c[1]], null, 1],

	// src/routes/auth/signup.svelte
	[/^\/auth\/signup\/?$/, [c[0], c[11]], [c[1]], null, 1]
];

// we import the root layout/error components eagerly, so that
// connectivity errors after initialisation don't nuke the app
export const fallback = [c[0](), c[1]()];