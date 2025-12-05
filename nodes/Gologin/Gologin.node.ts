import {
  NodeConnectionTypes,
  type IExecuteFunctions,
  type INodeExecutionData,
  type INodeType,
  type INodeTypeDescription,
} from 'n8n-workflow';
import { profileOperations, profileFields } from './resources/profile';
import { proxyOperations, proxyFields, executeProxyOperation } from './resources/proxy';
import { workspaceOperations, workspaceFields, executeWorkspaceOperation } from './resources/workspace';
import { tagOperations, tagFields, executeTagOperation } from './resources/tag';
import { folderOperations, folderFields, executeFolderOperation } from './resources/folder';
import { getAllProfiles } from './resources/profile/getAll';
import { getProfile } from './resources/profile/get';
import { createProfile } from './resources/profile/create';
import { updateProfile } from './resources/profile/update';
import { deleteProfiles } from './resources/profile/del';

export class Gologin implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'GoLogin',
    name: 'gologin',
    icon: 'file:../../icons/gologin.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with GoLogin API to manage browser profiles',
    defaults: {
      name: 'GoLogin',
    },
    usableAsTool: true,
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [
      {
        name: 'gologinApi',
        required: true,
      },
    ],
    requestDefaults: {
      baseURL: 'https://api.gologin.com',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Folder',
            value: 'folder',
          },
          {
            name: 'Profile',
            value: 'profile',
          },
          {
            name: 'Proxy',
            value: 'proxy',
          },
          {
            name: 'Tag',
            value: 'tag',
          },
          {
            name: 'Workspace',
            value: 'workspace',
          },
        ],
        default: 'profile',
      },
      ...profileOperations,
      ...profileFields,
      ...proxyOperations,
      ...proxyFields,
      ...workspaceOperations,
      ...workspaceFields,
      ...tagOperations,
      ...tagFields,
      ...folderOperations,
      ...folderFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        if (resource === 'profile') {
          if (operation === 'getAll') {
            returnData.push(...(await getAllProfiles.call(this, i)));
          } else if (operation === 'get') {
            returnData.push(...(await getProfile.call(this, i)));
          } else if (operation === 'create') {
            returnData.push(...(await createProfile.call(this, i)));
          } else if (operation === 'update') {
            returnData.push(...(await updateProfile.call(this, i)));
          } else if (operation === 'delete') {
            returnData.push(...(await deleteProfiles.call(this, i)));
          }
        } else if (resource === 'proxy') {
          returnData.push(...(await executeProxyOperation.call(this, operation, i)));
        } else if (resource === 'workspace') {
          returnData.push(...(await executeWorkspaceOperation.call(this, operation, i)));
        } else if (resource === 'tag') {
          returnData.push(...(await executeTagOperation.call(this, operation, i)));
        } else if (resource === 'folder') {
          returnData.push(...(await executeFolderOperation.call(this, operation, i)));
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: error.message,
            },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}

