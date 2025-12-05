import type { INodeProperties, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { gologinApiRequest } from '../../shared/transport';

export const workspaceOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['workspace'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new workspace',
        action: 'Create a workspace',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a workspace',
        action: 'Delete a workspace',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a workspace by ID',
        action: 'Get a workspace',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many workspaces',
        action: 'Get many workspaces',
      },
      {
        name: 'Rename',
        value: 'rename',
        description: 'Rename a workspace',
        action: 'Rename a workspace',
      },
    ],
    default: 'getAll',
  },
];

export const workspaceFields: INodeProperties[] = [
  {
    displayName: 'Workspace ID',
    name: 'workspaceId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['workspace'],
        operation: ['get', 'delete', 'rename'],
      },
    },
    default: '',
    description: 'The ID of the workspace',
  },
  {
    displayName: 'Workspace Name',
    name: 'workspaceName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['workspace'],
        operation: ['create', 'rename'],
      },
    },
    default: '',
    description: 'Name of the workspace',
  },
  {
    displayName: 'Operating System',
    name: 'os',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['workspace'],
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
    description: 'OS for starting profiles in workspace',
  },
  {
    displayName: 'OS Specification',
    name: 'osSpec',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['workspace'],
        operation: ['create'],
      },
    },
    options: [
      { name: 'None', value: '' },
      { name: 'M1', value: 'M1' },
      { name: 'M2', value: 'M2' },
      { name: 'M3', value: 'M3' },
      { name: 'M4', value: 'M4' },
      { name: 'Windows 11', value: 'win11' },
    ],
    default: '',
  },
];

export async function executeWorkspaceOperation(this: IExecuteFunctions, operation: string, index: number): Promise<INodeExecutionData[]> {
  if (operation === 'getAll') {
    const responseData = await gologinApiRequest(this, 'GET', '/workspaces');
    return this.helpers.returnJsonArray(responseData);
  }

  if (operation === 'get') {
    const workspaceId = this.getNodeParameter('workspaceId', index) as string;
    const responseData = await gologinApiRequest(this, 'GET', `/workspaces/${workspaceId}`);
    return this.helpers.returnJsonArray(responseData);
  }

  if (operation === 'create') {
    const workspaceName = this.getNodeParameter('workspaceName', index) as string;
    const os = this.getNodeParameter('os', index) as string;
    const osSpec = this.getNodeParameter('osSpec', index) as string;

    const body: Record<string, string> = {
      name: workspaceName,
    };

    if (os) body.os = os;
    if (osSpec) body.osSpec = osSpec;

    const responseData = await gologinApiRequest(this, 'POST', '/workspaces', body);
    return this.helpers.returnJsonArray(responseData);
  }

  if (operation === 'rename') {
    const workspaceId = this.getNodeParameter('workspaceId', index) as string;
    const workspaceName = this.getNodeParameter('workspaceName', index) as string;

    const body = {
      name: workspaceName,
    };

    const responseData = await gologinApiRequest(this, 'PATCH', `/workspaces/${workspaceId}/rename`, body);
    return this.helpers.returnJsonArray(responseData);
  }

  if (operation === 'delete') {
    const workspaceId = this.getNodeParameter('workspaceId', index) as string;
    await gologinApiRequest(this, 'DELETE', `/workspaces/${workspaceId}`);
    return this.helpers.returnJsonArray({ success: true, deletedWorkspaceId: workspaceId });
  }

  return [];
}

