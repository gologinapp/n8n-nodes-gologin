import type { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { gologinApiRequest } from '../../shared/transport';

export const proxyOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['proxy'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new proxy',
        action: 'Create a proxy',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a proxy',
        action: 'Delete a proxy',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a proxy by ID',
        action: 'Get a proxy',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many proxies',
        action: 'Get many proxies',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a proxy',
        action: 'Update a proxy',
      },
    ],
    default: 'getAll',
  },
];

export const proxyFields: INodeProperties[] = [
  {
    displayName: 'Proxy ID',
    name: 'proxyId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['proxy'],
        operation: ['get', 'update', 'delete'],
      },
    },
    default: '',
    description: 'The ID of the proxy',
  },
  {
    displayName: 'Proxy Mode',
    name: 'proxyMode',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['proxy'],
        operation: ['create', 'update'],
      },
    },
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
    default: 'http',
    description: 'Proxy connection protocol',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['proxy'],
        operation: ['create', 'update'],
      },
    },
    options: [
      {
        displayName: 'Change IP URL',
        name: 'changeIpUrl',
        type: 'string',
        default: '',
        description: 'URL to change IP address if proxy provider supports it',
      },
      {
        displayName: 'Custom Name',
        name: 'customName',
        type: 'string',
        default: '',
        description: 'Custom name for the proxy',
      },
      {
        displayName: 'Host',
        name: 'host',
        type: 'string',
        default: '',
        description: 'Proxy host (IP address or domain name)',
      },
      {
        displayName: 'Notes',
        name: 'notes',
        type: 'string',
        default: '',
        description: 'Notes about the proxy',
      },
      {
        displayName: 'Password',
        name: 'password',
        type: 'string',
        typeOptions: { password: true },
        default: '',
        description: 'Proxy password for authentication',
      },
      {
        displayName: 'Port',
        name: 'port',
        type: 'number',
        default: 8080,
        description: 'Proxy port number',
      },
      {
        displayName: 'Username',
        name: 'username',
        type: 'string',
        default: '',
        description: 'Proxy username for authentication',
      },
    ],
  },
];

export async function executeProxyOperation(this: IExecuteFunctions, operation: string, index: number): Promise<INodeExecutionData[]> {
  if (operation === 'getAll') {
    const responseData = await gologinApiRequest(this, 'GET', '/proxy/v2');
    return this.helpers.returnJsonArray(responseData.proxies || []);
  }

  if (operation === 'get') {
    const proxyId = this.getNodeParameter('proxyId', index) as string;
    const responseData = await gologinApiRequest(this, 'GET', `/proxy/${proxyId}`);
    return this.helpers.returnJsonArray(responseData);
  }

  if (operation === 'create') {
    const proxyMode = this.getNodeParameter('proxyMode', index) as string;
    const additionalFields = this.getNodeParameter('additionalFields', index) as Record<string, unknown>;

    const body = {
      proxies: [
        {
          mode: proxyMode,
          ...additionalFields,
        },
      ],
    };

    const responseData = await gologinApiRequest(this, 'POST', '/proxy/add_proxies', body);
    return this.helpers.returnJsonArray(responseData);
  }

  if (operation === 'update') {
    const proxyId = this.getNodeParameter('proxyId', index) as string;
    const proxyMode = this.getNodeParameter('proxyMode', index) as string;
    const additionalFields = this.getNodeParameter('additionalFields', index) as Record<string, unknown>;

    const body = {
      id: proxyId,
      mode: proxyMode,
      ...additionalFields,
    };

    const responseData = await gologinApiRequest(this, 'PUT', `/proxy/${proxyId}`, body);
    return this.helpers.returnJsonArray(responseData);
  }

  if (operation === 'delete') {
    const proxyId = this.getNodeParameter('proxyId', index) as string;
    await gologinApiRequest(this, 'DELETE', `/proxy/${proxyId}`);
    return this.helpers.returnJsonArray({ success: true, deletedProxyId: proxyId });
  }

  return [];
}

