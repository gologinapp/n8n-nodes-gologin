import type { INodeProperties, IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { gologinApiRequest } from '../../shared/transport';

export const updateDescription: INodeProperties[] = [
  {
    displayName: 'Profile ID',
    name: 'profileId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['profile'],
        operation: ['update'],
      },
    },
    default: '',
    description: 'The ID of the profile to update',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['profile'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Notes',
        name: 'notes',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        description: 'Notes about the profile',
      },
      {
        displayName: 'Profile Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Name of the profile',
      },
      {
        displayName: 'Proxy Host',
        name: 'proxyHost',
        type: 'string',
        default: '',
        description: 'Proxy host (IP address or domain name)',
      },
      {
        displayName: 'Proxy Mode',
        name: 'proxyMode',
        type: 'options',
        options: [
          { name: 'Geolocation', value: 'geolocation' },
          { name: 'GoLogin Proxy', value: 'gologin' },
          { name: 'HTTP', value: 'http' },
          { name: 'None', value: 'none' },
          { name: 'SOCKS4', value: 'socks4' },
          { name: 'SOCKS5', value: 'socks5' },
          { name: 'SSH', value: 'possh' },
          { name: 'Tor', value: 'tor' },
        ],
        default: 'none',
        description: 'Proxy connection protocol',
      },
      {
        displayName: 'Proxy Password',
        name: 'proxyPassword',
        type: 'string',
        typeOptions: { password: true },
        default: '',
        description: 'Proxy password for authentication',
      },
      {
        displayName: 'Proxy Port',
        name: 'proxyPort',
        type: 'number',
        default: 8080,
        description: 'Proxy port number',
      },
      {
        displayName: 'Proxy Username',
        name: 'proxyUsername',
        type: 'string',
        default: '',
        description: 'Proxy username for authentication',
      },
    ],
  },
];

export async function updateProfile(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  const profileId = this.getNodeParameter('profileId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index) as {
    name?: string;
    notes?: string;
    proxyMode?: string;
    proxyHost?: string;
    proxyPort?: number;
    proxyUsername?: string;
    proxyPassword?: string;
  };

  const body: IDataObject = {
    id: profileId,
  };

  if (updateFields.name) body.name = updateFields.name;
  if (updateFields.notes) body.notes = updateFields.notes;

  if (updateFields.proxyMode) {
    const proxy: IDataObject = {
      mode: updateFields.proxyMode,
    };

    if (updateFields.proxyHost) proxy.host = updateFields.proxyHost;
    if (updateFields.proxyPort) proxy.port = updateFields.proxyPort;
    if (updateFields.proxyUsername) proxy.username = updateFields.proxyUsername;
    if (updateFields.proxyPassword) proxy.password = updateFields.proxyPassword;

    body.proxy = proxy;
  }

  const responseData = await gologinApiRequest(this, 'PUT', `/browser/${profileId}/custom`, body);

  return this.helpers.returnJsonArray(responseData);
}

