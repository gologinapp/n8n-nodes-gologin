import type { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { gologinApiRequest } from '../../shared/transport';

export const folderOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['folder'],
      },
    },
    options: [
      {
        name: 'Add Profiles',
        value: 'addProfiles',
        description: 'Add profiles to folder',
        action: 'Add profiles to folder',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new folder',
        action: 'Create a folder',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a folder',
        action: 'Delete a folder',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many folders',
        action: 'Get many folders',
      },
      {
        name: 'Remove Profiles',
        value: 'removeProfiles',
        description: 'Remove profiles from folder',
        action: 'Remove profiles from folder',
      },
    ],
    default: 'getAll',
  },
];

export const folderFields: INodeProperties[] = [
  {
    displayName: 'Folder Name',
    name: 'folderName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['folder'],
        operation: ['create', 'delete', 'addProfiles', 'removeProfiles'],
      },
    },
    default: '',
    description: 'Name of the folder',
  },
  {
    displayName: 'Profile IDs',
    name: 'profileIds',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['folder'],
        operation: ['addProfiles', 'removeProfiles'],
      },
    },
    default: '',
    description: 'Comma-separated list of profile IDs',
  },
];

export async function executeFolderOperation(this: IExecuteFunctions, operation: string, index: number): Promise<INodeExecutionData[]> {
  if (operation === 'getAll') {
    const responseData = await gologinApiRequest(this, 'GET', '/folders');
    return this.helpers.returnJsonArray(responseData);
  }

  if (operation === 'create') {
    const folderName = this.getNodeParameter('folderName', index) as string;

    const body = {
      name: folderName,
    };

    const responseData = await gologinApiRequest(this, 'POST', '/folders/folder', body);
    return this.helpers.returnJsonArray(responseData);
  }

  if (operation === 'addProfiles' || operation === 'removeProfiles') {
    const folderName = this.getNodeParameter('folderName', index) as string;
    const profileIdsString = this.getNodeParameter('profileIds', index) as string;
    const profiles = profileIdsString.split(',').map(id => id.trim());

    const body = {
      name: folderName,
      profiles,
      action: operation === 'addProfiles' ? 'add' : 'remove',
    };

    const responseData = await gologinApiRequest(this, 'PATCH', '/folders/folder', body);
    return this.helpers.returnJsonArray(responseData);
  }

  if (operation === 'delete') {
    const folderName = this.getNodeParameter('folderName', index) as string;

    const qs = {
      name: folderName,
    };

    await gologinApiRequest(this, 'DELETE', '/folders/folder', undefined, qs);
    return this.helpers.returnJsonArray({ success: true, deletedFolder: folderName });
  }

  return [];
}


