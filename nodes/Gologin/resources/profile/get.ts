import type { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { gologinApiRequest } from '../../shared/transport';

export const getDescription: INodeProperties[] = [
	{
		displayName: 'Profile ID',
		name: 'profileId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['profile'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The ID of the profile to retrieve',
	},
	{
		displayName: 'Workspace ID',
		name: 'workspaceId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['profile'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'If you want to get the profile from a specific workspace',
	},
];

export async function getProfile(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const profileId = this.getNodeParameter('profileId', index) as string;
	const workspaceId = this.getNodeParameter('workspaceId', index) as string;

	const qs: Record<string, string> = {};
	if (workspaceId) {
		qs.currentWorkspace = workspaceId;
	}

	const responseData = await gologinApiRequest(this, 'GET', `/browser/${profileId}`, undefined, qs);

	return this.helpers.returnJsonArray(responseData);
}


