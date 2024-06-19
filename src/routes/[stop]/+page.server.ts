import * as stopsService from '$lib/server/stops-service';
import * as tripsService from '$lib/server/trips-service';
import { error } from '@sveltejs/kit';
import type { StopGroupDetails } from '$lib/StopGroupDetails';

export async function load({ params }) {
	const slug = params.stop;

	const stopGroup = await stopsService.getStopGroupBySlug(slug);
	if (!stopGroup) {
		error(404);
	}

	const directions = [];

	const promises = stopGroup.stops.map(s => tripsService.getTrips(s));
	const results = await Promise.all(promises);
	for (const direction of results) {
		directions.push(direction);
	}

	return {
		details: {
			code: stopGroup.code,
			name: stopGroup.name,
			lastUpdatedAt: new Date(),
			directions
		} as StopGroupDetails
	};
}
