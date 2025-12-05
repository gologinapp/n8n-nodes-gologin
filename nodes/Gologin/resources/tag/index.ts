import type { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { gologinApiRequest } from '../../shared/transport';

export const tagOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['tag'],
      },
    },
    options: [
      {
        name: 'Add to Profiles',
        value: 'addToProfiles',
        description: 'Add tag to profiles',
        action: 'Add tag to profiles',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new tag',
        action: 'Create a tag',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a tag',
        action: 'Delete a tag',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many tags',
        action: 'Get many tags',
      },
      {
        name: 'Remove From Profiles',
        value: 'removeFromProfiles',
        description: 'Remove tag from profiles',
        action: 'Remove tag from profiles',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a tag',
        action: 'Update a tag',
      },
    ],
    default: 'getAll',
  },
];

export const tagFields: INodeProperties[] = [
  {
    displayName: 'Tag ID',
    name: 'tagId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['tag'],
        operation: ['update', 'delete', 'removeFromProfiles'],
      },
    },
    default: '',
    description: 'The ID of the tag',
  },
  {
    displayName: 'Tag Title',
    name: 'tagTitle',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['tag'],
        operation: ['create', 'update', 'addToProfiles'],
      },
    },
    default: '',
    description: 'Title of the tag',
  },
  {
    displayName: 'Tag Color',
    name: 'tagColor',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['tag'],
        operation: ['create', 'update', 'addToProfiles'],
      },
    },
    options: [
      { name: 'Pink', value: 'pink' },
      { name: 'Yellow', value: 'yellow' },
      { name: 'Green', value: 'green' },
      { name: 'Blue', value: 'blue' },
      { name: 'Light Grey', value: 'lightgrey' },
      { name: 'Peach', value: 'peach' },
      { name: 'Lime', value: 'lime' },
      { name: 'Turquoise', value: 'turquoise' },
      { name: 'Lilac', value: 'lilac' },
      { name: 'Grey', value: 'grey' },
    ],
    default: 'blue',
    description: 'Color of the tag',
  },
  {
    displayName: 'Profile IDs',
    name: 'profileIds',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['tag'],
        operation: ['addToProfiles', 'removeFromProfiles'],
      },
    },
    default: '',
    description: 'Comma-separated list of profile IDs',
  },
  {
    displayName: 'Workspace ID',
    name: 'workspaceId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['tag'],
        operation: ['create', 'update', 'getAll'],
      },
    },
    default: '',
    description: 'Workspace ID (leave empty for default workspace)',
  },
];

export async function executeTagOperation(this: IExecuteFunctions, operation: string, index: number): Promise<INodeExecutionData[]> {
  if (operation === 'getAll') {
    const workspaceId = this.getNodeParameter('workspaceId', index) as string;
    const qs: Record<string, string> = {};
    if (workspaceId) qs.workspace = workspaceId;

    const responseData = await gologinApiRequest(this, 'GET', '/tags/all', undefined, qs);
    return this.helpers.returnJsonArray(responseData.tags || []);
  }

  if (operation === 'create') {
    const title = this.getNodeParameter('tagTitle', index) as string;
    const color = this.getNodeParameter('tagColor', index) as string;
    const workspaceId = this.getNodeParameter('workspaceId', index) as string;

    const body: Record<string, string> = {
      title,
      color,
    };

    if (workspaceId) body.workspace = workspaceId;

    const responseData = await gologinApiRequest(this, 'POST', '/tags', body);
    return this.helpers.returnJsonArray(responseData);
  }

  if (operation === 'update') {
    const tagId = this.getNodeParameter('tagId', index) as string;
    const title = this.getNodeParameter('tagTitle', index) as string;
    const color = this.getNodeParameter('tagColor', index) as string;
    const workspaceId = this.getNodeParameter('workspaceId', index) as string;

    const body: Record<string, string> = {
      title,
      color,
    };

    if (workspaceId) body.workspace = workspaceId;

    const responseData = await gologinApiRequest(this, 'POST', `/tags/${tagId}`, body);
    return this.helpers.returnJsonArray(responseData);
  }

  if (operation === 'addToProfiles') {
    const title = this.getNodeParameter('tagTitle', index) as string;
    const color = this.getNodeParameter('tagColor', index) as string;
    const profileIdsString = this.getNodeParameter('profileIds', index) as string;
    const browserIds = profileIdsString.split(',').map(id => id.trim());

    const body = {
      title,
      color,
      browserIds,
    };

    const responseData = await gologinApiRequest(this, 'POST', '/tags/addToProfiles', body);
    return this.helpers.returnJsonArray(responseData);
  }

  if (operation === 'removeFromProfiles') {
    const tagId = this.getNodeParameter('tagId', index) as string;
    const profileIdsString = this.getNodeParameter('profileIds', index) as string;
    const browserIds = profileIdsString.split(',').map(id => id.trim());

    const body = {
      browserIds,
    };

    await gologinApiRequest(this, 'DELETE', `/tags/${tagId}/removeFromProfiles`, body);
    return this.helpers.returnJsonArray({ success: true, tagId, removedFromProfiles: browserIds });
  }

  if (operation === 'delete') {
    const tagId = this.getNodeParameter('tagId', index) as string;
    await gologinApiRequest(this, 'DELETE', `/tags/${tagId}`);
    return this.helpers.returnJsonArray({ success: true, deletedTagId: tagId });
  }

  return [];
}


