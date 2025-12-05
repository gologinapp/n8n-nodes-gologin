import type { INodeProperties, IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { gologinApiRequest } from '../../shared/transport';

export const createDescription: INodeProperties[] = [
  {
    displayName: 'Profile Name',
    name: 'profileName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['profile'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Name of the profile to create',
  },
  {
    displayName: 'Operating System',
    name: 'os',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['profile'],
        operation: ['create'],
      },
    },
    options: [
      { name: 'Android', value: 'android' },
      { name: 'Android Cloud', value: 'android-cloud' },
      { name: 'Linux', value: 'lin' },
      { name: 'macOS', value: 'mac' },
      { name: 'Windows', value: 'win' },
    ],
    default: 'win',
    description: 'Operating system type for the profile',
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['profile'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'OS Specification',
        name: 'osSpec',
        type: 'options',
        options: [
          { name: 'M1', value: 'M1' },
          { name: 'M2', value: 'M2' },
          { name: 'M3', value: 'M3' },
          { name: 'M4', value: 'M4' },
          { name: 'None', value: '' },
          { name: 'Windows 11', value: 'win11' },
        ],
        default: '',
        description: 'OS specification (chip version for macOS or Windows version)',
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
      {
        displayName: 'Workspace ID',
        name: 'workspaceId',
        type: 'string',
        default: '',
        description: 'Workspace ID to create the profile in',
      },
    ],
  },
];

export async function createProfile(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  const profileName = this.getNodeParameter('profileName', index) as string;
  const os = this.getNodeParameter('os', index) as string;
  const additionalOptions = this.getNodeParameter('additionalOptions', index) as {
    osSpec?: string;
    workspaceId?: string;
    proxyMode?: string;
    proxyHost?: string;
    proxyPort?: number;
    proxyUsername?: string;
    proxyPassword?: string;
  };

  const body: IDataObject = {
    name: profileName,
    os,
  };

  if (additionalOptions.osSpec) {
    body.osSpec = additionalOptions.osSpec;
  }

  if (additionalOptions.workspaceId) {
    body.currentWorkspace = additionalOptions.workspaceId;
  }

  if (additionalOptions.proxyMode && additionalOptions.proxyMode !== 'none') {
    const proxy: IDataObject = {
      mode: additionalOptions.proxyMode,
    };

    if (additionalOptions.proxyHost) proxy.host = additionalOptions.proxyHost;
    if (additionalOptions.proxyPort) proxy.port = additionalOptions.proxyPort;
    if (additionalOptions.proxyUsername) proxy.username = additionalOptions.proxyUsername;
    if (additionalOptions.proxyPassword) proxy.password = additionalOptions.proxyPassword;

    body.proxy = proxy;
  }

  const responseData = await gologinApiRequest(this, 'POST', '/browser/quick', body);

  return this.helpers.returnJsonArray(responseData);
}

