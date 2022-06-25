import { dm } from '../services/data-maker/dataMaker';
import { odp } from '../services/odp/odp';

export const serviceMapper = {
	ODP: odp,
	'Data Maker': dm,
};
export function getService(service) {
	return serviceMapper[service];
}
