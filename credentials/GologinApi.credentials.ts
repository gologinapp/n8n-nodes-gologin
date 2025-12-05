import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class GologinApi implements ICredentialType {
	name = 'gologinApi';

	displayName = 'GoLogin API';

	icon: Icon = 'file:../icons/gologin.svg';

	documentationUrl = 'https://docs.gologin.com/';

	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials?.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.gologin.com',
			url: '/user',
			method: 'GET',
		},
	};
}


