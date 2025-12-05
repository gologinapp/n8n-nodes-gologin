import type { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { gologinApiRequest, gologinApiRequestAllItems } from '../../shared/transport';

export const getAllDescription: INodeProperties[] = [
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['profile'],
        operation: ['getAll'],
      },
    },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['profile'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
    },
    default: 50,
    description: 'Max number of results to return',
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['profile'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Folder ID',
        name: 'folder',
        type: 'string',
        default: '',
        description: 'Folder ID to filter profiles by',
      },
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search query to filter profiles by name',
      },
      {
        displayName: 'Sort Field',
        name: 'sorterField',
        type: 'options',
        options: [
          { name: 'Created At', value: 'createdAt' },
          { name: 'Last Activity', value: 'lastActivity' },
          { name: 'Name', value: 'name' },
          { name: 'Order', value: 'order' },
          { name: 'OS', value: 'os' },
          { name: 'Proxy Type', value: 'proxyType' },
          { name: 'Shared Emails', value: 'sharedEmails' },
          { name: 'Updated At', value: 'updatedAt' },
        ],
        default: 'createdAt',
        description: 'Field to sort by',
      },
      {
        displayName: 'Sort Order',
        name: 'sorterOrder',
        type: 'options',
        options: [
          { name: 'Ascending', value: 'ascend' },
          { name: 'Descending', value: 'descend' },
        ],
        default: 'descend',
      },
      {
        displayName: 'Tag ID',
        name: 'tag',
        type: 'string',
        default: '',
        description: 'Tag ID to filter profiles by',
      },
    ],
  },
];

export async function getAllProfiles(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const filters = this.getNodeParameter('filters', index) as {
    search?: string;
    folder?: string;
    tag?: string;
    sorterField?: string;
    sorterOrder?: string;
  };

  const qs: Record<string, string | number> = {};

  if (filters.search) qs.search = filters.search;
  if (filters.folder) qs.folder = filters.folder;
  if (filters.tag) qs.tag = filters.tag;
  if (filters.sorterField) qs.sorterField = filters.sorterField;
  if (filters.sorterOrder) qs.sorterOrder = filters.sorterOrder;

  let responseData;

  if (returnAll) {
    responseData = await gologinApiRequestAllItems(this, 'GET', '/browser/v2', undefined, qs);
  } else {
    const limit = this.getNodeParameter('limit', index) as number;
    qs.page = 1;
    const response = await gologinApiRequest(this, 'GET', '/browser/v2', undefined, qs);
    responseData = response.profiles || [];
    responseData = responseData.slice(0, limit);
  }

  return this.helpers.returnJsonArray(responseData);
}

