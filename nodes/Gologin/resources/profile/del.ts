import type { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { gologinApiRequest } from '../../shared/transport';

export const deleteDescription: INodeProperties[] = [
	{
		displayName: 'Profile IDs',
		name: 'profileIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['profile'],
				operation: ['delete'],
			},
		},
		default: '',
		description: 'Comma-separated list of profile IDs to delete',
	},
];

export async function deleteProfiles(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const profileIdsString = this.getNodeParameter('profileIds', index) as string;
	const profileIds = profileIdsString.split(',').map(id => id.trim());

	const body = {
		profilesToDelete: profileIds,
	};

	await gologinApiRequest(this, 'DELETE', '/browser', body);

	return this.helpers.returnJsonArray({ success: true, deletedProfiles: profileIds });
}


